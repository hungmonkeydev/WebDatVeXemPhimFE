import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
    stages: [
        { duration: '10s', target: 50 }, 
        { duration: '30s', target: 50 }, 
        { duration: '10s', target: 0 },  
    ],
    thresholds: {
        http_req_duration: ['p(95)<1000'], // Yêu cầu 95% request phải phản hồi dưới 1 giây
        http_req_failed: ['rate<0.05'],    // Tỉ lệ rớt không được quá 5%
    },
};

export default function () {
    const BASE_URL = 'http://localhost:8080/api';
    const loginPayload = JSON.stringify({
        email: 'trinhancao982@gmail.com', 
        password: 'Hunghung18@'              
    });
    
    const publicHeaders = {
        headers: { 'Content-Type': 'application/json' }
    };

    const res = http.post(`${BASE_URL}/auth/login`, loginPayload, publicHeaders);
    
    // In lỗi ra nếu có để dễ bắt bệnh (nếu có lỗi khác lòi ra)
    if (res.status !== 200) {
        console.log(`🚨 Bị chặn! Status: ${res.status} - Nội dung: ${res.body}`);
    }

    check(res, {
        '[Login] Thành công': (r) => r.status === 200,
    });

    sleep(1);
}