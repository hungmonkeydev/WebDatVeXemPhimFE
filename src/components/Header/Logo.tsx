// src/components/Header/Logo.tsx

// Import hình ảnh từ thư mục assets (lùi ra 2 cấp thư mục)
import logoImg from '../../assets/galaxy-logo-mobile.074abeac.png';

export default function Logo() {
  return (
    <a href="/" className="block cursor-pointer">
      <img 
        src={logoImg} 
        alt="Galaxy Cinema" 
        // Dùng h-12 (height: 3rem) để giới hạn chiều cao, w-auto giúp giữ đúng tỷ lệ hình
        // object-contain giúp hình không bị méo
        className="h-12 w-auto object-contain" 
      />
    </a>
  );
}