import React from 'react';
import { Card, Col, Row, Statistic, Spin } from 'antd';
import {
    UserOutlined,
    UserAddOutlined,
    DollarCircleOutlined,
    TagOutlined
} from '@ant-design/icons';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend
} from 'recharts';
import { useAdminDashboard } from '../../Hooks/useAdminDashboard';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const AdminDashboard = () => {
    const { userStats, isLoading } = useAdminDashboard();

    if (isLoading) {
        return <div className="text-center mt-20"><Spin size="large" description="Đang tải dữ liệu..." /></div>;
    }

    const roleData = userStats?.roleDistribution
        ? Object.keys(userStats.roleDistribution).map((key) => ({
            name: key,
            value: userStats.roleDistribution[key]
        }))
        : [];

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <h1 className="text-2xl font-bold mb-6">Bảng Điều Khiển (Dashboard)</h1>

            {/* ================= KHU VỰC 1: THẺ THỐNG KÊ TỔNG QUAN ================= */}
            <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} lg={6}>
                    <Card className="shadow-sm border-l-4 border-l-blue-500 hover:shadow-md transition-all">
                        <Statistic title="Doanh thu hôm nay (Chờ API)" value={0} suffix="VNĐ" valueStyle={{ color: '#3f8600', fontWeight: 'bold' }} prefix={<DollarCircleOutlined />} />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card className="shadow-sm border-l-4 border-l-orange-500 hover:shadow-md transition-all">
                        <Statistic title="Vé đã bán hôm nay (Chờ API)" value={0} valueStyle={{ color: '#cf1322', fontWeight: 'bold' }} prefix={<TagOutlined />} />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card className="shadow-sm border-l-4 border-l-green-500 hover:shadow-md transition-all">
                        <Statistic title="Tổng người dùng" value={userStats?.totalUsers || 0} prefix={<UserOutlined />} />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card className="shadow-sm border-l-4 border-l-purple-500 hover:shadow-md transition-all">
                        <Statistic title="Đăng ký mới hôm nay" value={userStats?.newUsersToday || 0} valueStyle={{ color: '#722ed1', fontWeight: 'bold' }} prefix={<UserAddOutlined />} />
                    </Card>
                </Col>
            </Row>

            {/* ================= KHU VỰC 2: BIỂU ĐỒ ================= */}
            <Row gutter={[16, 16]} className="mt-6">
                <Col xs={24} lg={16}>
                    <Card title="Lượng Đăng Ký Mới (30 ngày qua)" className="shadow-sm h-full min-h-[350px]">
                        {userStats?.dailyRegistrations?.length > 0 ? (
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={userStats.dailyRegistrations} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                                    <YAxis allowDecimals={false} />
                                    <Tooltip />
                                    <Line type="monotone" dataKey="count" name="Người dùng mới" stroke="#8884d8" strokeWidth={3} activeDot={{ r: 8 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex items-center justify-center h-full text-gray-400">Chưa có dữ liệu 30 ngày qua</div>
                        )}
                    </Card>
                </Col>

                <Col xs={24} lg={8}>
                    <Card title="Cơ cấu Người Dùng" className="shadow-sm h-full min-h-[350px]">
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