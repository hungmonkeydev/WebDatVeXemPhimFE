import React, { useState, useEffect } from 'react';
import {
    Table, Button, Space, Input, Form, Modal, Popconfirm,
    message, Tooltip, InputNumber, Switch
} from 'antd';
import { SearchOutlined, EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { useAdminCombos } from '../../Hooks/useAdminCombo';

export default function ComboManage() {
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [searchText, setSearchText] = useState('');

    // Gọi Hook
    const {
        combos, totalCombos, isLoading,
        fetchCombos, createCombo, updateCombo, deleteCombo, toggleComboActive
    } = useAdminCombos();

    // State Modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCombo, setEditingCombo] = useState<any | null>(null);
    const [form] = Form.useForm();

    // Load data
    useEffect(() => {
        fetchCombos(currentPage, pageSize, searchText);
    }, [currentPage, pageSize, searchText, fetchCombos]);

    const handleTableChange = (pagination: any) => {
        setCurrentPage(pagination.current);
        setPageSize(pagination.pageSize);
    };

    // Mở Modal
    const showModal = (record?: any) => {
        if (record) {
            setEditingCombo(record);
            form.setFieldsValue({
                ...record,
            });
        } else {
            setEditingCombo(null);
            form.resetFields();
        }
        setIsModalOpen(true);
    };

    // Xử lý Submit
    const handleFormSubmit = async () => {
        try {
            const values = await form.validateFields();

            let result;
            if (editingCombo) {
                result = await updateCombo(editingCombo.id, values);
            } else {
                result = await createCombo(values);
            }

            if (result.success) {
                message.success(result.message);
                setIsModalOpen(false);
                fetchCombos(currentPage, pageSize, searchText);
            } else {
                if (result.fieldErrors && typeof result.fieldErrors === 'object') {
                    const formErrors = Object.keys(result.fieldErrors).map((field) => ({
                        name: field,
                        errors: [result.fieldErrors[field]],
                    }));
                    form.setFields(formErrors);
                    message.warning("Vui lòng kiểm tra lại các dữ liệu màu đỏ!");
                } else {
                    message.error(result.message);
                }
            }
        } catch (error: any) {
            console.log("Validation Failed:", error);
        }
    };

    const handleDelete = async (id: number) => {
        const result = await deleteCombo(id);
        if (result.success) {
            message.success(result.message);
            fetchCombos(currentPage, pageSize, searchText);
        } else {
            message.error(result.message);
        }
    };

    const handleToggleActive = async (id: number) => {
        const result = await toggleComboActive(id);
        if (result.success) {
            message.success(result.message);
            fetchCombos(currentPage, pageSize, searchText);
        } else {
            message.error(result.message);
        }
    };

    const columns = [
        { title: 'ID', dataIndex: 'id', key: 'id', width: 70 },
        {
            title: 'Tên Combo',
            dataIndex: 'name', // Đổi field theo đúng API Backend
            key: 'name',
            render: (text: string) => <div className="font-semibold text-gray-800">{text}</div>,
        },
        {
            title: 'Giá tiền',
            dataIndex: 'price',
            key: 'price',
            render: (price: number) => <span className="font-medium text-red-500">{price?.toLocaleString()} VNĐ</span>,
        },
        {
            title: 'Trạng thái',
            dataIndex: 'isActive',
            key: 'isActive',
            render: (isActive: boolean, record: any) => (
                <Switch
                    checked={isActive}
                    onChange={() => handleToggleActive(record.id)}
                    checkedChildren="Hiện"
                    unCheckedChildren="Ẩn"
                />
            ),
        },
        {
            title: 'Hành động', key: 'action', width: 120,
            render: (_: any, record: any) => (
                <Space size="middle">
                    <Tooltip title="Chỉnh sửa">
                        <Button type="text" icon={<EditOutlined className="text-blue-500" />} onClick={() => showModal(record)} />
                    </Tooltip>
                    <Popconfirm
                        title="Xóa combo này?"
                        description={`Bạn có chắc chắn muốn xóa "${record.name}"?`}
                        onConfirm={() => handleDelete(record.id)}
                        okText="Xóa" cancelText="Hủy" okButtonProps={{ danger: true }}
                    >
                        <Tooltip title="Xóa combo">
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
                    <h2 className="text-xl font-bold text-gray-800">Quản lý Bắp Nước (Combo)</h2>
                    <p className="text-gray-500 text-sm">Thêm, sửa, xóa danh sách combo trên hệ thống</p>
                </div>
                <div className="flex gap-4">
                    <Input
                        placeholder="Tìm theo tên combo..."
                        prefix={<SearchOutlined />}
                        className="w-64"
                        allowClear
                        onChange={(e) => setSearchText(e.target.value)}
                        onPressEnter={(e: any) => setSearchText(e.target.value)}
                    />
                    <Button type="primary" icon={<PlusOutlined />} onClick={() => showModal()} className="bg-blue-600">
                        Thêm Combo
                    </Button>
                </div>
            </div>

            <Table
                columns={columns} dataSource={combos} rowKey="id" loading={isLoading}
                onChange={handleTableChange}
                pagination={{
                    current: currentPage, pageSize: pageSize, total: totalCombos,
                    showSizeChanger: true, showTotal: (total) => `Tổng ${total} combo`,
                }}
                bordered
            />

            <Modal
                title={editingCombo ? "Cập nhật combo" : "Thêm combo mới"}
                open={isModalOpen} onOk={handleFormSubmit} onCancel={() => setIsModalOpen(false)}
                okText={editingCombo ? "Cập nhật" : "Tạo mới"} cancelText="Hủy bỏ" destroyOnHidden
                confirmLoading={isLoading}
                width={600}
            >
                <Form form={form} layout="vertical" className="mt-4">
                    <Form.Item name="name" label="Tên Combo" rules={[{ required: true, message: 'Vui lòng nhập tên combo!' }]}>
                        <Input placeholder="Ví dụ: Combo 1 Bắp 2 Nước..." />
                    </Form.Item>

                    <Form.Item name="price" label="Giá tiền (VNĐ)" rules={[{ required: true, message: 'Vui lòng nhập giá!' }]}>
                        <InputNumber className="w-full" min={0} step={1000} placeholder="Ví dụ: 85000" />
                    </Form.Item>

                    <Form.Item name="imageUrl" label="Link hình ảnh (Tùy chọn)">
                        <Input placeholder="Nhập đường dẫn ảnh combo..." />
                    </Form.Item>

                    <Form.Item name="description" label="Nội dung mô tả (Tùy chọn)">
                        <Input.TextArea rows={3} placeholder="Mô tả chi tiết: 1 Bắp phô mai, 2 Nước ngọt cỡ lớn..." />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}