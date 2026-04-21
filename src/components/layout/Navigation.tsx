import NavItem from './NavItem';

export default function Navigation() {
  const menuItems = [
    { title: 'Phim', subMenu: ['Phim Đang Chiếu', 'Phim Sắp Chiếu'] },
    { title: 'Star Shop', subMenu: ['Seasonal Merchandise', 'Movie Merchandise'] },
    { title: 'Góc Điện Ảnh', subMenu: ['Thể Loại Phim', 'Diễn Viên', 'Đạo Diễn', 'Bình Luận Phim', 'Blog Điện Ảnh'] },
    { title: 'Sự Kiện' },
    { title: 'Rạp/Giá Vé' },
  ];

  return (
    <nav>
      <ul className="flex items-center gap-6 font-medium text-gray-700 whitespace-nowrap">
        {menuItems.map((item) => (
          // Gọi thằng con NavItem và ném data cho nó xử lý
          <NavItem 
            key={item.title} 
            title={item.title} 
            subMenu={item.subMenu} 
          />
        ))}
      </ul>
    </nav>
  );
}