import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
    stages: [
        { duration: '10s', target: 50 },
        { duration: '30s', target: 50 },
        { duration: '10s', target: 0 },
    ],
    thresholds: {
        http_req_duration: ['p(95)<1000'],
        http_req_failed: ['rate<0.05'],
    },
};

// Đã xác nhận qua SQL: showtime 49 chỉ có đúng 50 seat_id available: 151 → 200.
// => Tối đa 25 cặp riêng biệt (2 ghế/VU, không trùng nhau).
// Nếu target VU > 25, các VU sẽ dùng LẶP LẠI cặp ghế (qua modulo) => có tranh chấp
// ghế thật giữa các VU trùng cặp (đây là test tranh chấp thật, không phải bug).
const AVAILABLE_SEAT_PAIRS = [
    [151, 152], [153, 154], [155, 156], [157, 158], [159, 160],
    [161, 162], [163, 164], [165, 166], [167, 168], [169, 170],
    [171, 172], [173, 174], [175, 176], [177, 178], [179, 180],
    [181, 182], [183, 184], [185, 186], [187, 188], [189, 190],
    [191, 192], [193, 194], [195, 196], [197, 198], [199, 200],
];

const BASE_URL = 'http://localhost:8080/api';
const MOVIE_ID = 1;        // TODO: đổi theo movieId thật (phim có suất chiếu 49)
const SHOWTIME_ID = 49;
const TODAY = '2026-08-08'; // TODO: đổi đúng ngày chiếu của showtime 49

// Đặt DEBUG = true khi chạy với --vus 1 --iterations 1 để xem log chi tiết.
// Nhớ đổi lại false khi chạy full load test (50 VU) để tránh log spam.
const DEBUG = false;

export default function () {
    const publicHeaders = { headers: { 'Content-Type': 'application/json' } };

    // BƯỚC 1: ĐĂNG NHẬP
    const loginPayload = JSON.stringify({
        email: 'trinhancao982@gmail.com',
        password: 'Hunghung18@'
    });
    const loginRes = http.post(`${BASE_URL}/auth/login`, loginPayload, publicHeaders);

    if (DEBUG) {
        console.log('[DEBUG] Login status:', loginRes.status);
        console.log('[DEBUG] Login body:', loginRes.body);
    }

    const loginOk = check(loginRes, {
        '[Step 1] Đăng nhập thành công (200)': (r) => r.status === 200,
    });
    if (!loginOk) return;

    // Parse token — thử nhiều pattern tên field phổ biến (camelCase / snake_case,
    // lồng trong "data" hoặc ở root) để tránh trường hợp field không khớp -> token rỗng.
    let loginBody;
    try {
        loginBody = loginRes.json();
    } catch (e) {
        if (DEBUG) console.log('[DEBUG] Không parse được JSON từ login response:', e);
        return;
    }

    const token =
        loginBody?.data?.accessToken ||
        loginBody?.data?.access_token ||
        loginBody?.accessToken ||
        loginBody?.access_token ||
        loginBody?.data?.token ||
        loginBody?.token ||
        '';

    if (DEBUG) {
        console.log('[DEBUG] Token lấy được:', token ? `${token.substring(0, 20)}...` : '(RỖNG)');
    }

    if (!token) {
        if (DEBUG) console.log('[DEBUG] Token rỗng — dừng iteration, kiểm tra lại field trong login body ở trên.');
        return;
    }

    const privateHeaders = {
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
    };

    sleep(1);

    // BƯỚC 2: VÀO TRANG CHỦ — xem phim đang chiếu
    const homeRes = http.get(`${BASE_URL}/movies/now-showing?page=0&size=20`, privateHeaders);
    check(homeRes, { '[Step 2] Tải trang chủ thành công (200)': (r) => r.status === 200 });

    sleep(1); // user lướt xem, chọn phim

    // BƯỚC 3: CHỌN SUẤT CHIẾU — xem lịch chiếu của phim đã chọn theo ngày
    const showtimeListUrl = `${BASE_URL}/showtimes?movieId=${MOVIE_ID}&date=${TODAY}` +
        `&activeOnly=true&futureOnly=true&groupBy=CINEMA&sortBy=START_TIME` +
        `&includeAvailableSeats=true&valid=true`;
    const showtimeListRes = http.get(showtimeListUrl, privateHeaders);
    check(showtimeListRes, { '[Step 3] Tải danh sách suất chiếu thành công (200)': (r) => r.status === 200 });

    sleep(1);

    // BƯỚC 4: VÀO TRANG CHỌN GHẾ
    const seatmapRes = http.get(`${BASE_URL}/showtimes/${SHOWTIME_ID}/seatmap`, privateHeaders);
    check(seatmapRes, { '[Step 4] Tải sơ đồ ghế thành công (200)': (r) => r.status === 200 });

    sleep(2);

    // BƯỚC 5: GIỮ GHẾ — với 50 VU nhưng chỉ 25 cặp ghế thật, các VU sẽ dùng LẶP LẠI
    // cặp ghế theo modulo => 2 VU có cùng pairIndex sẽ THẬT SỰ tranh chấp 1 cặp ghế.
    // Đây là test có chủ đích: xác nhận backend xử lý đúng race condition (chỉ 1 VU
    // giữ được ghế thành công, VU còn lại nhận lỗi rõ ràng "held by another user"),
    // không phải bug. Vì vậy "checks_failed" ở Step 5 > 0% là kết quả HỢP LÝ, không
    // phải dấu hiệu lỗi hệ thống — miễn là response trả lỗi đúng (400, message rõ ràng),
    // không phải 500/timeout.
    const pairIndex = (__VU - 1) % AVAILABLE_SEAT_PAIRS.length;
    const seatIds = AVAILABLE_SEAT_PAIRS[pairIndex];

    const holdPayload = JSON.stringify({ showtimeId: SHOWTIME_ID, seatIds: seatIds });
    const holdRes = http.post(`${BASE_URL}/bookings/hold-seats`, holdPayload, privateHeaders);

    if (DEBUG) {
        console.log('[DEBUG] Hold-seats payload:', holdPayload);
        console.log('[DEBUG] Hold-seats status:', holdRes.status);
        console.log('[DEBUG] Hold-seats body:', holdRes.body);
    }

    check(holdRes, { '[Step 5] Giữ ghế thành công (200)': (r) => r.status === 200 });

    sleep(1);

    // BƯỚC 6 (dọn dẹp): Nhả ghế đã giữ để lần chạy test sau không bị thiếu ghế available.
    // Chỉ release nếu Step 5 thành công (tránh gọi release cho ghế chưa hề được giữ).
    if (holdRes.status === 200) {
        const releasePayload = JSON.stringify({ showtimeId: SHOWTIME_ID, seatIds: seatIds });
        const releaseRes = http.post(`${BASE_URL}/bookings/release-seats`, releasePayload, privateHeaders);

        if (DEBUG) {
            console.log('[DEBUG] Release-seats status:', releaseRes.status, 'body:', releaseRes.body);
        }

        check(releaseRes, { '[Step 6] Nhả ghế thành công (200)': (r) => r.status === 200 });
    }
}