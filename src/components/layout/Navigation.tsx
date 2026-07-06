import NavItem from './NavItem';

export default function Navigation() {
  const menuItems = [
    { title: 'Phim', isMegaMenu: true },
    { title: 'Star Shop', subMenu: ['Seasonal Merchandise', 'Movie Merchandise'] },
    { title: 'Góc Điện Ảnh', subMenu: ['Thể Loại Phim', 'Diễn Viên', 'Đạo Diễn', 'Bình Luận Phim', 'Blog Điện Ảnh'] },
    { title: 'Sự Kiện' },
    { title: 'Rạp/Giá Vé' },
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
        />
      ))}
      </ul>
    </nav>
  );
}