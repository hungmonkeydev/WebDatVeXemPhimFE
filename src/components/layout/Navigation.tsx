import NavItem from '../Layout/NavItem';
import { Link } from 'react-router-dom';
export default function Navigation() {
  const menuItems = [
    {
      title: 'Phim',
      isMegaMenu: true,
      subMenu: [
        { label: 'Phim đang chiếu', path: '/movies/now-showing' },
        { label: 'Phim sắp chiếu', path: '/movies/coming-soon' },
        { label: 'Phim IMAX', path: '/movies/imax' }
      ]
    },
    {
      title: 'Góc Điện Ảnh', subMenu: [
        { label: 'Thể Loại Phim', path: '/the-loai-phim' },
        { label: 'Diễn Viên', path: '/dien-vien' },
        { label: 'Đạo Diễn', path: '/dao-dien' },
        { label: 'Bình Luận Phim', path: '/binh-luan-phim' },
        { label: 'Blog Điện Ảnh', path: '/blog-dien-anh' }
      ]
    },
    {
      title: 'Sự Kiện', subMenu: [
        { label: 'Sự Kiện Đang Diễn Ra', path: '/su-kien-dang-dien-ra' },
        { label: 'Sự Kiện Sắp Diễn Ra', path: '/su-kien-sap-dien-ra' }
      ]
    },
    {
      title: 'Rạp/Giá Vé', subMenu: [
        { label: 'Rạp/Giá Vé', path: '/rap-gia-ve' }
      ]
    },
    { title: 'Đổi Quà', path: '/loyalty-store' }
  ];

  return (
    <nav className="w-full pl-2 lg:pl-0">
      <ul className="flex flex-col lg:flex-row items-start lg:items-center gap-6 lg:gap-6 font-medium text-gray-700 w-full">
        {menuItems.map((item) => (
          <NavItem
            key={item.title}
            title={item.title}
            subMenu={item.subMenu}
            isMegaMenu={item.isMegaMenu}
            path={item.path}
          />
        ))}
      </ul>
    </nav>
  );
}