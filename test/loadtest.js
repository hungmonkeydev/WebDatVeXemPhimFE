import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
    vus: 50, // Test nhanh 50 user
    duration: '30s', // Bắn liên tục trong 30 giây
};

export default function () {
    // Đổi lại URL này thành đúng cái API mà pro muốn test nha
    const url = 'http://localhost:8080/api/user/profile'; 

    const params = {
        headers: {
            'Content-Type': 'application/json',
            // Token đã được dán chuẩn chỉnh vào đây
            'Authorization': 'Bearer eyJhbGciOiJIUzM4NCJ9.eyJ0eXBlIjoiYWNjZXNzIiwic3ViIjoibm9pdGhhdHhheWR1bmd3ZWJAZ21haWwuY29tIiwiaWF0IjoxNzg2MDA0OTQ1LCJleHAiOjE4NzIzMTg1NDV9.JZ2x9rCuhIzfFyJGhBPnTUwoYm5fUmM3jmzaQCfhM5AEzqE1x6m1urxZiNWuFjnb'
        },
    };

    const res = http.get(url, params);

    check(res, {
        'Server sống (Status 200)': (r) => r.status === 200,
        'Phản hồi nhanh (< 500ms)': (r) => r.timings.duration < 500,
    });
    
    sleep(1);
}