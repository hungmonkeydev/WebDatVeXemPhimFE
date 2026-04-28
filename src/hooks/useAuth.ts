import { useState } from 'react';
import axios from 'axios';

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false);

  // Hàm login nhận vào email và password
  const login = async (email: string, password: string) => {
    setIsLoading(true);

    try {
      const response = await axios.post('https://webxemphim-sbim.onrender.com/api/v1/auth/login', {
        email: email.trim(),
        password: password.trim()
      });

      const token = response.data.data.accessToken;
      const user = response.data.data.user;

      if (token) {
        // Lưu data vào kho
        localStorage.setItem('access_token', token);
        localStorage.setItem('user_info', JSON.stringify(user));
        
        // Báo cho các component khác (như Header) biết để cập nhật UI
        window.dispatchEvent(new Event('authChange'));
        
        // Trả về kết quả thành công
        return { success: true, message: 'Đăng nhập thành công!' };
      }
      return { success: false, message: 'Lỗi xác thực từ máy chủ' };

    } catch (err: any) {
      console.log("Lỗi chi tiết từ Backend:", err.response?.data);
      
      let errorMessage = 'Có lỗi kết nối máy chủ, vui lòng thử lại sau.';

      // Bắt lỗi y chang file cũ của bạn
      if (err.response?.status === 401) {
        errorMessage = 'Email hoặc mật khẩu không chính xác!';
      } else if (err.response?.status === 422) {
        const responseData = err.response.data;
        errorMessage = responseData.message || 'Dữ liệu không hợp lệ!';
        if (responseData.errors && responseData.errors.length > 0) {
          errorMessage = responseData.errors[0].message;
        }
      }
      // Trả về kết quả thất bại kèm câu chửi của Backend
      return { success: false, message: errorMessage };

    } finally {
      setIsLoading(false);
    }
  };
  const register = async (userData: any) => {
    setIsLoading(true);

    try {
      console.log('Dữ liệu gửi đi:', userData);
      // Gọi API đăng ký
      const response = await axios.post('https://webxemphim-sbim.onrender.com/api/v1/auth/register', userData);
      
      // Trả về kết quả thành công
      return { success: true, message: 'Đăng ký thành công! Vui lòng đăng nhập.' };

    } catch (err: any) {
      console.log("Lỗi chi tiết từ Backend:", err.response?.data);
      
      let errorMessage = 'Lỗi kết nối máy chủ. Vui lòng thử lại!';

      // Bắt mạch lỗi Validation (422)
      if (err.response?.status === 422) {
        const responseData = err.response.data;
        errorMessage = responseData.message || 'Dữ liệu không hợp lệ!';
        if (responseData.errors && responseData.errors.length > 0) {
          errorMessage = responseData.errors[0].message; 
        }
      }
      
      // Trả về kết quả thất bại
      return { success: false, message: errorMessage };

    } finally {
      setIsLoading(false);
    }
  };
  // Trả đồ nghề ra cho Component xài
  return { login,register, isLoading };
};