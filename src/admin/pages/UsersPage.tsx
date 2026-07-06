import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Tag, Input, Form, Modal, Select, Popconfirm, message, Tooltip, InputNumber } from 'antd';
import { SearchOutlined, EditOutlined, DeleteOutlined, PlusOutlined, LockOutlined, UnlockOutlined } from '@ant-design/icons';
import { userService } from '../../services/userService';

interface UserType {
    userId: number;
    fullName: string;
    email: string;
    phone: string;
    role: string;
    gender: string;
    isActive: boolean;
}

export default function UserManage() {
    const [users, setUsers] = useState<UserType[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalUsers, setTotalUsers] = useState(0);

    // State cho Modal Thêm/Sửa
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<UserType | null>(null);
    const [form] = Form.useForm();

    const [isBanModalOpen, setIsBanModalOpen] = useState(false);
    const [banningUser, setBanningUser] = useState<UserType | null>(null);
    const [banForm] = Form.useForm();

    // Hàm load data
    const fetchUsers = async (page: number, size: number) => {
        setIsLoading(true);
        try {
            console.log(`👉 Đang gọi API trang ${page}, size ${size}...`);

            const res = await userService.getUsers(page, size);
            if (res && res.data) {
                setUsers(res.data.content);
                setTotalUsers(res.data.totalElements);
            }
        } catch (error) {
            message.error("Lỗi khi tải danh sách người dùng!");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers(currentPage, pageSize);
    }, [currentPage, pageSize]);

    const handleTableChange = (pagination: any) => {
        setCurrentPage(pagination.current);
        setPageSize(pagination.pageSize);
    };

    // Mở Modal Thêm/Sửa
    const showModal = (record?: UserType) => {
        if (record) {
            setEditingUser(record);
            form.setFieldsValue(record);
        } else {
            setEditingUser(null);
            form.resetFields();
            form.setFieldsValue({
                role: 'CUSTOMER',
                gender: 'MALE'
            });
        }
        setIsModalOpen(true);
    };

    // Xử lý Submit Form
    const handleFormSubmit = async () => {
        try {
            const values = await form.validateFields();

            const submitData = {
                fullName: values.fullName,
                email: values.email,
                phone: values.phone,
                role: values.role,
                gender: values.gender,
                password: values.password
            };

            if (editingUser) {
                await userService.updateUser(editingUser.userId, submitData);
                message.success("Cập nhật thành công!");
            } else {
                await userService.createUser(submitData);
                message.success("Thêm mới thành công!");
            }
            setIsModalOpen(false);
            fetchUsers(currentPage, pageSize);

        } catch (error: any) {
            console.log("Chi tiết lỗi:", error);
            if (error.response && error.response.data) {
                const errorMessage = error.response.data.message || "Có lỗi xảy ra!";
                message.error(errorMessage);
            } else if (error.errorFields) {
                message.warning("Vui lòng điền đầy đủ các thông tin bắt buộc!");
            } else {
                message.error("Không thể kết nối đến máy chủ!");
            }
        }
    };
    const handleDelete = async (userId: number) => {
        try {
            await userService.deleteUser(userId);
            message.success("Đã xóa người dùng thành công!");
            fetchUsers(currentPage, pageSize);
        } catch (error) {
            message.error("Xóa thất bại!");
        }
    };
    const showBanModal = (record: UserType) => {
        setBanningUser(record);
        setIsBanModalOpen(true); // Chỉ cần ra lệnh mở Modal, không ép dữ liệu ở đây nữa
    };
    const handleBanSubmit = async () => {
        try {
            const values = await banForm.validateFields();

            if (banningUser) {
                const res = await userService.banUser(banningUser.userId, {
                    reason: values.reason,
                    lockDurationHours: values.lockDurationHours
                });
                console.log("👉 BƯỚC 4: Kết quả server trả về:", res);

                message.success(`Đã khóa tài khoản ${banningUser.fullName} thành công!`);
                setIsBanModalOpen(false);
                fetchUsers(currentPage, pageSize);
            }
        } catch (error: any) {
            message.error(error.response?.data?.message || "Lỗi khi khóa tài khoản!");
        }
    };
    const columns = [
        { title: 'ID', dataIndex: 'userId', key: 'userId', width: 70 },
        {
            title: 'Khách hàng',
            key: 'user',
            render: (_: any, record: UserType) => (
                <div>
                    <div className="font-semibold text-gray-800">{record.fullName}</div>
                    <div className="text-xs text-gray-500">{record.email}</div>
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
            render: (_: any, record: UserType) => (
                <Space size="middle">
                    <Tooltip title="Chỉnh sửa">
                        <Button type="text" icon={<EditOutlined className="text-blue-500" />} onClick={() => showModal(record)} />
                    </Tooltip>
                    <Tooltip title={record.isActive ? "Khóa tài khoản" : "Tài khoản đang bị khóa"}>
                        <Button
                            type="text"
                            icon={
                                record.isActive
                                    ? <UnlockOutlined className="text-green-500" />   // Đang hoạt động -> khóa mở
                                    : <LockOutlined className="text-red-500" />        // Đang bị khóa -> khóa đóng
                            }
                            onClick={() => showBanModal(record)}
                        />
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
            ),
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
                    <Input placeholder="Tìm theo tên, email..." prefix={<SearchOutlined />} className="w-64" allowClear />
                    <Button type="primary" icon={<PlusOutlined />} onClick={() => showModal()} className="bg-blue-600">
                        Thêm Người Dùng
                    </Button>
                </div>
            </div>

            <Table
                columns={columns} dataSource={users} rowKey="userId" loading={isLoading}
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
                            name="email"
                            label="Email"
                            rules={[
                                { required: true, message: 'Vui lòng nhập email!' },
                                {
                                    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                    message: 'Email không đúng định dạng!'
                                }
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
                            <Select options={[
                                { value: 'CUSTOMER', label: 'Khách hàng' },
                                { value: 'ADMIN', label: 'Quản trị viên' }
                            ]} />                        </Form.Item>
                        <Form.Item name="gender" label="Giới tính" rules={[{ required: true }]}>
                            <Select options={[{ value: 'MALE', label: 'Nam' }, { value: 'FEMALE', label: 'Nữ' }, { value: 'OTHER', label: 'Khác' }]} />
                        </Form.Item>
                    </div>

                    {!editingUser && (
                        <Form.Item name="password" label="Mật khẩu" rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}>
                            <Input.Password placeholder="Nhập mật khẩu cho tài khoản mới" autoComplete="new-password" />
                        </Form.Item>
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
        </div>

    );
}