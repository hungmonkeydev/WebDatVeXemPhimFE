import React from 'react';
import { Card, Col, Row, Statistic, Spin } from 'antd';
import {
    UserOutlined,
    UserAddOutlined,
    DollarCircleOutlined,
    TagOutlined
} from '@ant-design/icons';
import {
    LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend
} from 'recharts';

// Import cả 2 hook
import { useAdminDashboard } from '../../Hooks/useAdminDashboard';
import { useAdminRevenue } from '../../Hooks/useAdminRevenue';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#f26b38'];

const AdminDashboard = () => {
    // 1. Gọi Hook lấy data User
    const { userStats, isLoading: isUserLoading } = useAdminDashboard();

    // 2. Gọi Hook lấy data Revenue
    const {
        overviewData,
        periodData,
        movieData,
        paymentData,
        isLoading: isRevenueLoading
    } = useAdminRevenue();

    // 3. Xử lý loading chung
    if (isUserLoading || isRevenueLoading) {
        return <div className="flex justify-center items-center h-[70vh]"><Spin size="large" tip="Đang tổng hợp dữ liệu..." /></div>;
    }

    // Hàm format tiền tệ
    const formatVND = (value: number | string) => {
        return new Intl.NumberFormat('vi-VN').format(Number(value || 0)) + ' VNĐ';
    };

    // 2. Hàm format Trục Biểu Đồ (Viết tắt K và Tr cho gọn)
    const formatAxis = (val: number) => {
        if (val >= 1000000) {
            return `${(val / 1000000).toFixed(1).replace('.0', '')} Tr`;
        }
        if (val >= 1000) {
            return `${(val / 1000).toFixed(0)} K`;
        }
        return val.toString();
    };

    // Chuẩn bị data cho biểu đồ tròn (User Roles)
    const roleData = userStats?.roleDistribution
        ? Object.keys(userStats.roleDistribution).map((key) => ({
            name: key,
            value: userStats.roleDistribution[key]
        }))
        : [];

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">Bảng Điều Khiển (Dashboard)</h1>

            {/* ================= KHU VỰC 1: THẺ THỐNG KÊ TỔNG QUAN (KPIs) ================= */}
            <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} lg={6}>
                    <Card className="shadow-sm border-l-4 border-l-[#f26b38] hover:shadow-md transition-all rounded-xl">
                        <Statistic
                            title="Tổng Doanh Thu (30 ngày)"
                            value={overviewData?.totalRevenue || 0}
                            formatter={(val) => formatVND(val as number)}
                            valueStyle={{ color: '#f26b38', fontWeight: 'bold' }}
                            prefix={<DollarCircleOutlined />}
                        />

                        {/* NÓ NẰM Ở ĐÂY NÈ BA: Dưới Statistic và trên thẻ đóng /Card */}
                        <div className="text-sm text-gray-500 mt-4 border-t pt-2">
                            (Gồm {formatVND(overviewData?.ticketRevenue || 0)} vé + {formatVND(overviewData?.comboRevenue || 0)} bắp nước)
                        </div>

                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card className="shadow-sm border-l-4 border-l-blue-500 hover:shadow-md transition-all rounded-xl">
                        <Statistic
                            title="Tổng Vé Đã Bán"
                            value={overviewData?.totalTicketsSold || 0}
                            valueStyle={{ color: '#3b82f6', fontWeight: 'bold' }}
                            prefix={<TagOutlined />}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card className="shadow-sm border-l-4 border-l-green-500 hover:shadow-md transition-all rounded-xl">
                        <Statistic
                            title="Tổng Người Dùng"
                            value={userStats?.totalUsers || 0}
                            valueStyle={{ color: '#22c55e', fontWeight: 'bold' }}
                            prefix={<UserOutlined />}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card className="shadow-sm border-l-4 border-l-purple-500 hover:shadow-md transition-all rounded-xl">
                        <Statistic
                            title="Đăng Ký Mới Hôm Nay"
                            value={userStats?.newUsersToday || 0}
                            valueStyle={{ color: '#a855f7', fontWeight: 'bold' }}
                            prefix={<UserAddOutlined />}
                        />
                    </Card>
                </Col>
            </Row>

            {/* ================= KHU VỰC 2: BIỂU ĐỒ DOANH THU ================= */}
            <Row gutter={[16, 16]} className="mt-6">
                <Col xs={24} lg={16}>
                    <Card title="Biểu Đồ Doanh Thu (30 ngày qua)" className="shadow-sm h-full min-h-[350px] rounded-xl">
                        {periodData?.length > 0 ? (
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={periodData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />

                                    {/* BỎ formatAxis ở đây vì đây là trục ngày tháng (chữ) */}
                                    <XAxis dataKey="label" tick={{ fontSize: 12 }} />

                                    {/* ĐƯA formatAxis vào trục Y (trục tiền) */}
                                    <YAxis tickFormatter={formatAxis} width={70} />

                                    <Tooltip formatter={(value) => formatVND(value as number)} />
                                    <Line type="monotone" name="Doanh Thu" dataKey="totalRevenue" stroke="#f26b38" strokeWidth={3} activeDot={{ r: 8 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex items-center justify-center h-full text-gray-400">Chưa có dữ liệu doanh thu</div>
                        )}
                    </Card>
                </Col>

                <Col xs={24} lg={8}>
                    <Card title="Top Phim Doanh Thu Cao Nhất" className="shadow-sm h-full min-h-[350px] rounded-xl">
                        {movieData?.length > 0 ? (
                            <ResponsiveContainer width="100%" height={300}>
                                {/* 1. Bỏ layout="vertical" để biểu đồ đứng thẳng */}
                                <BarChart data={movieData} margin={{ top: 20, right: 5, left: 0, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />

                                    {/* 2. Đổi XAxis thành tên phim */}
                                    <XAxis dataKey="title" tick={{ fontSize: 11 }} interval={0} angle={-30} textAnchor="end" height={60} />

                                    {/* 3. Đổi YAxis thành trục tiền và đưa formatAxis vào */}
                                    <YAxis tickFormatter={formatAxis} width={70} />

                                    <Tooltip formatter={(value) => formatVND(value as number)} />

                                    {/* 4. Đổi radius bo góc lên đầu cột: [TopLeft, TopRight, BottomRight, BottomLeft] */}
                                    <Bar name="Doanh Thu" dataKey="ticketRevenue" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={30} />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex items-center justify-center h-full text-gray-400">Chưa có dữ liệu phim</div>
                        )}
                    </Card>
                </Col>
            </Row>

            {/* ================= KHU VỰC 3: BIỂU ĐỒ NGƯỜI DÙNG ================= */}
            <Row gutter={[16, 16]} className="mt-6">
                <Col xs={24} lg={16}>
                    <Card title="Lượng Đăng Ký Mới (30 ngày qua)" className="shadow-sm h-full min-h-[350px] rounded-xl">
                        {userStats?.dailyRegistrations?.length > 0 ? (
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={userStats.dailyRegistrations} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                                    <YAxis allowDecimals={false} />
                                    <Tooltip />
                                    <Line type="monotone" dataKey="count" name="Người dùng mới" stroke="#10b981" strokeWidth={3} activeDot={{ r: 8 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex items-center justify-center h-full text-gray-400">Chưa có dữ liệu đăng ký</div>
                        )}
                    </Card>
                </Col>

                <Col xs={24} lg={8}>
                    <Card title="Cơ cấu Người Dùng" className="shadow-sm h-full min-h-[350px] rounded-xl">
                        <div className="h-48 mb-4">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={roleData} cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={5} dataKey="value">
                                        {roleData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="flex flex-col space-y-4 pt-4 border-t">
                            <div className="w-full">
                                <div className="flex justify-between mb-1 text-sm">
                                    <span className="font-semibold text-green-600">Hoạt động</span>
                                    <span>{userStats?.activePercentage || 0}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div className="bg-green-500 h-2 rounded-full" style={{ width: `${userStats?.activePercentage || 0}%` }}></div>
                                </div>
                            </div>
                            <div className="w-full">
                                <div className="flex justify-between mb-1 text-sm">
                                    <span className="font-semibold text-red-500">Bị khóa</span>
                                    <span>{userStats?.bannedPercentage || 0}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div className="bg-red-500 h-2 rounded-full" style={{ width: `${userStats?.bannedPercentage || 0}%` }}></div>
                                </div>
                            </div>
                        </div>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default AdminDashboard;