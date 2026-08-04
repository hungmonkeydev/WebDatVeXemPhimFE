import { useState } from 'react';
import { authService } from '../services/authService';

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false);

  const login = async (email: string, password: string) => {
    setIsLoading(true);

    try {
      const response = await authService.login(email.trim(), password.trim());
      const token = response.data?.accessToken;
      const fullName = response.data?.fullName;
      if (token) {
        localStorage.setItem('access_token', token);
        
        let role = 'USER';
        try {
          const { default: api } = await import('../services/api');
          await api.get('/admin/movies?page=0&size=1');
          role = 'ADMIN';
        } catch (error) {
          role = 'USER';
        }
        
        localStorage.setItem('user_info', JSON.stringify({ fullName, role }));

        window.dispatchEvent(new Event('authChange'));

        return { success: true, message: 'Đăng nhập thành công!' };
      }
      return { success: false, message: 'Lỗi xác thực từ máy chủ' };

    } catch (err: any) {
      console.log("Lỗi chi tiết từ Backend:", err.response?.data);

      let errorMessage = 'Có lỗi kết nối máy chủ, vui lòng thử lại sau.';

      if (err.response?.status === 401) {
        errorMessage = 'Email hoặc mật khẩu không chính xác!';
      } else if (err.response?.status === 422 || err.response?.status === 400) {
        const responseData = err.response.data;
        errorMessage = responseData.message || 'Dữ liệu không hợp lệ!';
        if (responseData.errors && responseData.errors.length > 0) {
          errorMessage = responseData.errors[0].message;
        }
      }
      return { success: false, message: errorMessage };

    } finally {
      setIsLoading(false);
    }
  };
  const register = async (userData: any) => {
    setIsLoading(true);

    try {
      console.log('Dữ liệu gửi đi:', userData);
      const response = await authService.register(userData);
      return {
        success: true,
        message: response.message || 'Đăng ký thành công! Vui lòng đăng nhập.'
      };

    }
    catch (err: any) {
      console.log("Lỗi chi tiết từ Backend:", err.response?.data);

      let errorMessage = 'Lỗi kết nối máy chủ. Vui lòng thử lại!';

      if (err.response?.status === 409) {
        errorMessage = err.response.data?.message || 'Email hoặc số điện thoại đã được sử dụng!';
      }
      if (err.response?.status === 422 || err.response?.status === 400) {
        const responseData = err.response.data;
        errorMessage = responseData.message || 'Dữ liệu không hợp lệ!';
        if (responseData?.data && typeof responseData.data === 'object') {
          const errorDetails = Object.values(responseData.data);
          if (errorDetails.length > 0) {
            errorMessage = errorDetails[0] as string;
          }
        }
      }

      return { success: false, message: errorMessage };

    } finally {
      setIsLoading(false);
    }
  };
  const forgotPassword = async (email: string) => {
    setIsLoading(true);
    try {
      await authService.forgotPassword(email.trim());
      return { 
        success: true, 
        message: 'Mật khẩu tạm thời đã được gửi! Vui lòng kiểm tra email của bạn.' 
      };
    } catch (err: any) {
      console.log("Lỗi quên mật khẩu:", err.response?.data);
      let errorMessage = 'Không thể gửi email lúc này. Vui lòng thử lại sau!';
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      }
      return { success: false, message: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };
  const changePassword = async (passwordData: { oldPassword: string; newPassword: string; confirmPassword: string }) => {
    setIsLoading(true);
    try {
      await authService.changePassword(passwordData);
      return { 
        success: true, 
        message: 'Đổi mật khẩu thành công!' 
      };
    } catch (err: any) {
      console.log("Lỗi đổi mật khẩu:", err.response?.data);
      let errorMessage = 'Mật khẩu cũ không chính xác hoặc có lỗi xảy ra!';
      
      if (err.response?.status === 400 || err.response?.status === 422) {
        const responseData = err.response.data;
        errorMessage = responseData.message || 'Dữ liệu không hợp lệ!';
        if (responseData?.data && typeof responseData.data === 'object') {
          const errorDetails = Object.values(responseData.data);
          if (errorDetails.length > 0) {
            errorMessage = errorDetails[0] as string; 
          }
        }
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      }
      
      return { success: false, message: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };
  return { login, register, isLoading ,forgotPassword,changePassword};
};