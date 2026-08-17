import React, { useState, useEffect } from 'react';
import {
    Table, Button, Space, Tag, Input, Form, Modal, Select, Popconfirm,
    message, Tooltip, InputNumber, Descriptions, Badge, Switch
} from 'antd';
import { SearchOutlined, EditOutlined, DeleteOutlined, PlusOutlined, LockOutlined, UnlockOutlined, EyeOutlined, ReloadOutlined, UndoOutlined } from '@ant-design/icons';
import { adminUserService } from '../../services/adminUserService';
import { CheckCircleFilled, CloseCircleFilled } from '@ant-design/icons';

import { useAdminUser, type UserType } from '../../Hooks/useAdminUser';

export default function UserManage() {
    const [searchTerm, setSearchTerm] = useState('');
    const {
        users, isLoading, currentPage, pageSize, totalUsers,
        form, banForm, resetPasswordForm,
        isModalOpen, setIsModalOpen, editingUser,
        isBanModalOpen, setIsBanModalOpen, banningUser,
        isResetPasswordModalOpen, setIsResetPasswordModalOpen, resettingUser,
        isDetailModalOpen, setIsDetailModalOpen, userDetail, isFetchingDetail,
        handleTableChange, showModal, handleFormSubmit, handleDelete,
        showBanModal, handleBanSubmit, handleUnban,
        showResetPasswordModal, handleResetPassword, handleRestoreUser, showDetailModal
    } = useAdminUser();
    const columns = [
        { title: 'ID', dataIndex: 'userId', key: 'userId', width: 70 },
        {
            title: 'Khách hàng',
            key: 'user',
            render: (_: any, record: UserType) => (
                <div>
                    <div className={`font-semibold ${record.isActive ? 'text-gray-800' : 'text-red-500 line-through'}`}>{record.fullName}</div>
                    <div className={`text-xs ${record.isActive ? 'text-gray-500' : 'text-red-400'}`}>{record.email}</div>
                    {!record.isActive && <Tag color="error" className="mt-1">Đã khóa</Tag>}
                </div>
            ),
        },
        { title: 'Số điện thoại', dataIndex: 'phone', key: 'phone' },
        {
            title: 'Giới tính', dataIndex: 'gender', key: 'gender',
            render: (gender: string) => gender === 'MALE' ? 'Nam' : gender === 'FEMALE' ? 'Nữ' : 'Khác'
        },
        {
            title: 'Vai trò', dataIndex: 'role', key: 'role',
            render: (role: string) => (
                <Tag color={role === 'ADMIN' ? 'volcano' : 'geekblue'} className="font-bold">{role}</Tag>
            ),
        },
        {
            title: 'Hành động', key: 'action', width: 120,
            render: (_: any, record: UserType) => {
                // Sửa thành deletedAt vì BE trả về deletedAt chứ không phải isDeleted
                const isDeleted = !!(record as any).deletedAt;

                if (isDeleted) {
                    return (
                        <Space size="middle">
                            <Tooltip title="Xem chi tiết">
                                <Button type="text" icon={<EyeOutlined className="text-green-500" />} onClick={() => showDetailModal(record.userId)} />
                            </Tooltip>
                            <Popconfirm
                                title="Khôi phục tài khoản"
                                description="Bạn có chắc chắn muốn khôi phục tài khoản này không?"
                                onConfirm={() => handleRestoreUser(record.userId)}
                                okText="Khôi phục"
                                cancelText="Hủy"
                            >
                                <Tooltip title="Khôi phục">
                                    <Button type="text" icon={<UndoOutlined className="text-blue-500" />} />
                                </Tooltip>
                            </Popconfirm>
                        </Space>
                    );
                }

                return (
                    <Space size="middle">
                        <Tooltip title="Chỉnh sửa">
                            <Button type="text" icon={<EditOutlined className="text-blue-500" />} onClick={() => showModal(record)} />
                        </Tooltip>
                        {record.isActive ? (
                            <Tooltip title="Khóa tài khoản">
                                <Button
                                    type="text"
                                    icon={<UnlockOutlined className="text-green-500" />}
                                    onClick={() => showBanModal(record)}
                                />
                            </Tooltip>
                        ) : (
                            <Tooltip title="Mở khóa tài khoản">
                                <Button
                                    type="text"
                                    danger
                                    icon={<LockOutlined />}
                                    onClick={() => handleUnban(record.userId)}
                                />
                            </Tooltip>
                        )}
                        <Tooltip title="Xem chi tiết">
                            <Button type="text" icon={<EyeOutlined className="text-green-500" />} onClick={() => showDetailModal(record.userId)} />
                        </Tooltip>
                        
                        <Tooltip title="Reset mật khẩu">
                            <Button type="text" danger icon={<ReloadOutlined />} onClick={() => showResetPasswordModal(record)} />
                        </Tooltip>

                        <Popconfirm
                            title="Cảnh báo"
                            description={`Bạn có chắc chắn muốn xóa ${record.fullName}?`}
                            onConfirm={() => handleDelete(record.userId)}
                            okText="Xóa" cancelText="Hủy" okButtonProps={{ danger: true }}
                        >
                            <Tooltip title="Xóa tài khoản">
                                <Button type="text" danger icon={<DeleteOutlined />} />
                            </Tooltip>
                        </Popconfirm>
                    </Space>
                );
            },
        },
    ];
    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-xl font-bold text-gray-800">Quản lý Người dùng</h2>
                    <p className="text-gray-500 text-sm">Danh sách khách hàng và quản trị viên hệ thống</p>
                </div>
                <div className="flex gap-4">
                    <Input 
                        placeholder="Tìm theo tên, email (Trang HT)..." 
                        prefix={<SearchOutlined />} 
                        className="w-64" 
                        allowClear 
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Button type="primary" icon={<PlusOutlined />} onClick={() => showModal()} className="bg-blue-600">
                        Thêm Người Dùng
                    </Button>
                </div>
            </div>

            <Table
                columns={columns} 
                dataSource={users.filter(u => {
                    if (!searchTerm) return true;
                    const kw = searchTerm.toLowerCase();
                    return (
                        (u.fullName && u.fullName.toLowerCase().includes(kw)) ||
                        (u.email && u.email.toLowerCase().includes(kw)) ||
                        (u.phone && u.phone.includes(kw))
                    );
                })} 
                rowKey="userId" loading={isLoading}
                onChange={handleTableChange}
                pagination={{
                    current: currentPage, pageSize: pageSize, total: totalUsers,
                    showSizeChanger: true, showTotal: (total) => `Tổng ${total} người dùng`,
                }}
                bordered
            />

            {/* ====== MODAL THÊM/SỬA NGƯỜI DÙNG ====== */}
            <Modal
                title={editingUser ? "Chỉnh sửa thông tin" : "Thêm người dùng mới"}
                open={isModalOpen} onOk={handleFormSubmit} onCancel={() => setIsModalOpen(false)}
                okText={editingUser ? "Cập nhật" : "Tạo tài khoản"} cancelText="Hủy bỏ" destroyOnHidden
            >
                <Form form={form} layout="vertical" className="mt-4">
                    <Form.Item name="fullName" label="Họ và tên" rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}>
                        <Input placeholder="Ví dụ: Nguyễn Văn A" />
                    </Form.Item>

                    <div className="grid grid-cols-2 gap-4">
                        <Form.Item
                            name="email" label="Email"
                            rules={[
                                { required: true, message: 'Vui lòng nhập email!' },
                                { pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Email không đúng định dạng!' }
                            ]}
                        >
                            <Input placeholder="Email" disabled={!!editingUser} />
                        </Form.Item>
                        <Form.Item name="phone" label="Số điện thoại" rules={[{ required: true, message: 'Vui lòng nhập SĐT!' }]}>
                            <Input placeholder="Số điện thoại" />
                        </Form.Item>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <Form.Item name="role" label="Vai trò" rules={[{ required: true, message: 'Vui lòng chọn vai trò!' }]}>
                            <Select options={[{ value: 'CUSTOMER', label: 'Khách hàng' }, { value: 'ADMIN', label: 'Quản trị viên' }]} />
                        </Form.Item>
                        <Form.Item name="gender" label="Giới tính" rules={[{ required: true }]}>
                            <Select options={[{ value: 'MALE', label: 'Nam' }, { value: 'FEMALE', label: 'Nữ' }, { value: 'OTHER', label: 'Khác' }]} />
                        </Form.Item>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <Form.Item name="birthDate" label="Ngày sinh">
                            <Input type="date" className="w-full" />
                        </Form.Item>
                        <Form.Item name="membershipTierId" label="Hạng thành viên">
                            <Select options={[
                                { value: 1, label: 'Thành viên Đồng' },
                                { value: 2, label: 'Thành viên Bạc' },
                                { value: 3, label: 'Thành viên Vàng' }
                            ]} placeholder="Chọn hạng..." allowClear />
                        </Form.Item>
                    </div>

                    {!editingUser && (
                        <Form.Item name="password" label="Mật khẩu" rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}>
                            <Input.Password placeholder="Nhập mật khẩu" autoComplete="new-password" />
                        </Form.Item>
                    )}

                    {editingUser && (
                        <div className="grid grid-cols-3 gap-4 border-t pt-4 mt-2">
                            <Form.Item name="isActive" label="Hoạt động" valuePropName="checked">
                                <Switch checkedChildren="Bật" unCheckedChildren="Tắt" />
                            </Form.Item>
                            <Form.Item name="emailVerified" label="Xác thực Email" valuePropName="checked">
                                <Switch checkedChildren="Đã XN" unCheckedChildren="Chưa" />
                            </Form.Item>
                            <Form.Item name="phoneVerified" label="Xác thực SĐT" valuePropName="checked">
                                <Switch checkedChildren="Đã XN" unCheckedChildren="Chưa" />
                            </Form.Item>
                        </div>
                    )}
                </Form>
                {/* ====== MODAL KHÓA TÀI KHOẢN ====== */}

            </Modal>
            {isBanModalOpen && (
                <Modal
                    title={<span>Khóa tài khoản: <span className="text-red-500">{banningUser?.fullName}</span></span>}
                    open={isBanModalOpen}
                    onOk={handleBanSubmit}
                    onCancel={() => setIsBanModalOpen(false)}
                    okText="Xác nhận khóa"
                    cancelText="Hủy"
                    okButtonProps={{ danger: true }}
                >
                    <Form form={banForm} layout="vertical" className="mt-4" initialValues={{ lockDurationHours: 24 }}>
                        <Form.Item name="reason" label="Lý do khóa" rules={[{ required: true, message: 'Vui lòng nhập lý do khóa!' }]}>
                            <Input.TextArea rows={3} placeholder="Ví dụ: Đặt vé ảo..." />
                        </Form.Item>
                        <Form.Item name="lockDurationHours" label="Thời gian khóa (Giờ)" rules={[{ required: true, message: 'Vui lòng nhập số giờ!' }]}>
                            <InputNumber min={0} className="w-full" placeholder="Nhập số giờ..." addonAfter="Giờ" />
                        </Form.Item>
                    </Form>
                </Modal>
            )}

            {/* ====== MODAL ĐẶT LẠI MẬT KHẨU ====== */}
            {isResetPasswordModalOpen && (
                <Modal
                    title={<span>Đặt lại mật khẩu cho: <span className="text-blue-500">{resettingUser?.fullName}</span></span>}
                    open={isResetPasswordModalOpen}
                    onOk={handleResetPassword}
                    onCancel={() => setIsResetPasswordModalOpen(false)}
                    okText="Xác nhận"
                    cancelText="Hủy"
                >
                    <Form form={resetPasswordForm} layout="vertical" className="mt-4">
                        <Form.Item 
                            name="newPassword" 
                            label="Mật khẩu mới" 
                            rules={[
                                { required: true, message: 'Vui lòng nhập mật khẩu mới!' },
                                { min: 8, message: 'Mật khẩu phải từ 8 ký tự trở lên!' },
                                { pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/, message: 'Mật khẩu phải chứa chữ hoa, chữ thường, số và ký tự đặc biệt!' }
                            ]}
                        >
                            <Input.Password placeholder="Nhập mật khẩu mới..." />
                        </Form.Item>
                    </Form>
                </Modal>
            )}

            {/* ====== MODAL CHI TIẾT USER ====== */}
            <Modal
                title={<span className="text-lg font-bold">Hồ sơ khách hàng</span>}
                open={isDetailModalOpen}
                onCancel={() => setIsDetailModalOpen(false)}
                footer={[<Button key="close" type="primary" onClick={() => setIsDetailModalOpen(false)}>Đóng</Button>]}
                width={750}
                destroyOnHidden
            >
                {isFetchingDetail ? (
                    <p className="text-center my-10">Đang tải dữ liệu...</p>
                ) : userDetail && (
                    <Descriptions bordered column={2} size="small" className="mt-4">
                        {/* Thông tin cơ bản */}
                        <Descriptions.Item label="Họ và tên" span={2}>
                            <b className="text-base">{userDetail.fullName}</b>
                        </Descriptions.Item>
                        <Descriptions.Item label="Email">{userDetail.email}</Descriptions.Item>
                        <Descriptions.Item label="Số điện thoại">{userDetail.phone}</Descriptions.Item>

                        <Descriptions.Item label="Ngày sinh">
                            {userDetail.birthDate ? new Date(userDetail.birthDate).toLocaleDateString('vi-VN') : 'Chưa cập nhật'}
                        </Descriptions.Item>
                        <Descriptions.Item label="Giới tính">
                            {userDetail.gender === 'MALE' ? 'Nam' : userDetail.gender === 'FEMALE' ? 'Nữ' : 'Khác'}
                        </Descriptions.Item>

                        {/* Thông tin thẻ thành viên */}
                        <Descriptions.Item label="Hạng thành viên">
                            <Tag color="gold" className="font-bold">{userDetail.membershipTierName}</Tag>
                        </Descriptions.Item>
                        <Descriptions.Item label="Ngày gia nhập">
                            {userDetail.memberSince ? new Date(userDetail.memberSince).toLocaleDateString('vi-VN') : 'Chưa có'}
                        </Descriptions.Item>

                        <Descriptions.Item label="Điểm tích lũy">
                            <b className="text-blue-600">{userDetail.loyaltyPoints}</b> điểm
                        </Descriptions.Item>
                        <Descriptions.Item label="Tổng chi tiêu">
                            <b className="text-red-500">{userDetail.totalSpent?.toLocaleString()} VNĐ</b>
                        </Descriptions.Item>
                        <Descriptions.Item label="Trạng thái tài khoản">
                            {userDetail.isActive ? <Badge status="success" text="Đang hoạt động" /> : <Badge status="error" text="Đang khóa" />}
                        </Descriptions.Item>
                        <Descriptions.Item label="Xác thực">
                            Email: {userDetail.emailVerified
                                ? <CheckCircleFilled style={{ color: '#52c41a' }} />
                                : <CloseCircleFilled style={{ color: '#ff4d4f' }} />
                            }
                            {' '}| SĐT: {userDetail.phoneVerified
                                ? <CheckCircleFilled style={{ color: '#52c41a' }} />
                                : <CloseCircleFilled style={{ color: '#ff4d4f' }} />
                            }                        </Descriptions.Item>

                        <Descriptions.Item label="Đăng nhập sai">
                            <b className="text-orange-500">{userDetail.failedLoginAttempts} lần</b>
                        </Descriptions.Item>
                        <Descriptions.Item label="Lần đăng nhập cuối">
                            {userDetail.lastLoginAt ? new Date(userDetail.lastLoginAt).toLocaleString('vi-VN') : 'Chưa từng ĐN'}
                        </Descriptions.Item>

                        <Descriptions.Item label="Ngày tạo tài khoản">
                            {userDetail.createdAt ? new Date(userDetail.createdAt).toLocaleString('vi-VN') : ''}
                        </Descriptions.Item>
                        <Descriptions.Item label="Khóa đến lúc">
                            {userDetail.lockedUntil ? <span className="text-red-500 font-bold">{new Date(userDetail.lockedUntil).toLocaleString('vi-VN')}</span> : 'Không bị khóa'}
                        </Descriptions.Item>
                    </Descriptions>
                )}
            </Modal>
        </div>

    );
}