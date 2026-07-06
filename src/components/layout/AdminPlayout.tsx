import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
    MenuFoldOutlined, MenuUnfoldOutlined, VideoCameraOutlined,
    ShopOutlined, ShoppingCartOutlined, BarChartOutlined,
    CalendarOutlined, PlaySquareOutlined,
    TeamOutlined, CoffeeOutlined, TagOutlined,
    LogoutOutlined, UserOutlined
} from '@ant-design/icons';
import { Button, Layout, Menu, theme, Dropdown, Avatar, Space, message, Result } from 'antd';
import type { MenuProps } from 'antd';
import LoginModal from '../Auth/LoginModal';

const { Header, Sider, Content } = Layout;

const AdminLayout: React.FC = () => {
    const [collapsed, setCollapsed] = useState(false);

    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();

    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    // Bắt sự kiện mỗi khi vào /admin
    useEffect(() => {
        const token = localStorage.getItem('access_token');
        if (!token) {
            setIsLoginModalOpen(true);
            setIsAuthenticated(false);
        } else {
            setIsAuthenticated(true);
        }
    }, []);

    // Hàm xử lý khi Đăng nhập thành công từ Modal
    const handleLoginSuccess = () => {
        setIsLoginModalOpen(false); 
        setIsAuthenticated(true); 
        message.success('Chào mừng Admin đã quay trở lại!');
    };

    // Hàm xử lý Đăng xuất
    const handleLogout = () => {
        localStorage.removeItem('access_token');
        setIsAuthenticated(false); 
        setIsLoginModalOpen(true);
        navigate('/admin/dashboard');
    };

    const menuItems = [
        { key: '/admin/dashboard', icon: <BarChartOutlined />, label: 'Thống kê Doanh thu' },
        {
            key: 'movies-group',
            icon: <VideoCameraOutlined />,
            label: 'Quản lý Phim',
            children: [
                { key: '/admin/movies', icon: <PlaySquareOutlined />, label: 'Danh sách Phim' },
                { key: '/admin/showtimes', icon: <CalendarOutlined />, label: 'Lịch chiếu' },
            ],
        },
        { key: '/admin/cinemas', icon: <ShopOutlined />, label: 'Cụm Rạp & Phòng' },
        { key: '/admin/orders', icon: <ShoppingCartOutlined />, label: 'Quản lý Đơn hàng' },
        { key: '/admin/users', icon: <TeamOutlined />, label: 'Quản lý Người dùng' },
        { key: '/admin/combos', icon: <CoffeeOutlined />, label: 'Quản lý Bắp nước' },
        { key: '/admin/promotions', icon: <TagOutlined />, label: 'Quản lý Khuyến mãi' },
    ];

    const userDropdownItems: MenuProps['items'] = [
        { key: 'profile', icon: <UserOutlined />, label: 'Hồ sơ cá nhân' },
        { type: 'divider' },
        { key: 'logout', icon: <LogoutOutlined />, label: 'Đăng xuất', danger: true, onClick: handleLogout },
    ];

    // NẾU CHƯA ĐĂNG NHẬP THÌ RENDER RA MÀN HÌNH KHÓA + LOGIN MODAL
    if (!isAuthenticated) {
        return (
            <div className="h-screen w-screen flex items-center justify-center bg-gray-50">
                <Result
                    status="403"
                    title="Yêu cầu đăng nhập"
                    subTitle="Vui lòng đăng nhập với tài khoản Quản trị viên để truy cập hệ thống."
                    extra={
                        <Button type="primary" onClick={() => setIsLoginModalOpen(true)} className="bg-[#f26b38]">
                            Mở lại bảng Đăng nhập
                        </Button>
                    }
                />

                <LoginModal
                    isOpen={isLoginModalOpen}
                    onClose={() => {
                        setIsLoginModalOpen(false);
                        navigate('/'); 
                    }}
                    onSuccess={handleLoginSuccess}
                />
            </div>
        );
    }

    // NẾU ĐÃ ĐĂNG NHẬP THÌ RENDER LAYOUT ADMIN BÌNH THƯỜNG
    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider trigger={null} collapsible collapsed={collapsed} width={250}>
                <div className="h-16 m-4 bg-white/20 rounded-md flex items-center justify-center text-white font-bold text-lg">
                    {collapsed ? 'VCA' : 'VieCinema Admin'}
                </div>
                <Menu theme="dark" mode="inline" selectedKeys={[location.pathname]} items={menuItems} onClick={({ key }) => navigate(key)} />
            </Sider>
            <Layout>
                <Header style={{ padding: '0 24px 0 0', background: colorBgContainer, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div className="flex items-center">
                        <Button type="text" icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />} onClick={() => setCollapsed(!collapsed)} style={{ fontSize: '16px', width: 64, height: 64 }} />
                        <span className="font-semibold text-lg text-gray-700 ml-4 hidden sm:block">Hệ thống Quản trị VieCinema</span>
                    </div>
                    <Dropdown menu={{ items: userDropdownItems }} placement="bottomRight" arrow>
                        <Space className="cursor-pointer hover:bg-gray-50 px-4 py-1 rounded-md transition-colors">
                            <Avatar style={{ backgroundColor: '#f26b38' }} icon={<UserOutlined />} />
                            <span className="font-medium text-gray-700 hidden md:block">Admin</span>
                        </Space>
                    </Dropdown>
                </Header>
                <Content style={{ margin: '24px 16px', padding: 24, minHeight: 280, background: colorBgContainer, borderRadius: borderRadiusLG }}>
                    <Outlet />
                </Content>
            </Layout>
        </Layout>
    );
};

export default AdminLayout;