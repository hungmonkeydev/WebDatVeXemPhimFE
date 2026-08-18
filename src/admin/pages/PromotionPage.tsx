import React, { useState, useEffect } from 'react';
import {
    Table, Button, Space, Input, Form, Modal, Popconfirm,
    message, Tooltip, InputNumber, Switch, Select, DatePicker, Row, Col, Tag
} from 'antd';
import { SearchOutlined, EditOutlined, DeleteOutlined, PlusOutlined, UndoOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { useAdminPromotions } from '../../Hooks/useAdminPromotion';
import { movieService } from '../../services/movieService';

const { Option } = Select;

export default function PromotionManage() {
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [keyword, setKeyword] = useState('');
    const [discountTypeFilter, setDiscountTypeFilter] = useState<string | undefined>(undefined);

    const [movieOptions, setMovieOptions] = useState<any[]>([]);

    // Gọi Hook
    const {
        promotions, totalPromotions, isLoading,
        fetchPromotions, createPromotion, updatePromotion, deletePromotion, restorePromotion, togglePromotionActive
    } = useAdminPromotions();

    // State Modal Add/Edit
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPromotion, setEditingPromotion] = useState<any | null>(null);
    const [form] = Form.useForm();
    const currentDiscountType = Form.useWatch('discountType', form);

    // State Modal Restore
    const [isRestoreModalOpen, setIsRestoreModalOpen] = useState(false);
    const [restoreId, setRestoreId] = useState<number | null>(null);

    // Load Movies for dropdown
    useEffect(() => {
        const fetchMoviesForDropdown = async () => {
            try {
                const [nowRes, soonRes] = await Promise.all([
                    movieService.getNowShowing(0, 50),
                    movieService.getComingSoon(0, 50)
                ]);
                const nowArr = nowRes.data?.data?.content || nowRes.data?.data || [];
                const soonArr = soonRes.data?.data?.content || soonRes.data?.data || [];
                const combinedMovies = [...nowArr, ...soonArr].map((m: any) => ({
                    value: m.movieId,
                    label: m.title
                }));
                const uniqueMovies = Array.from(
                    new Map(combinedMovies.map(item => [item.value, item])).values()
                );
                setMovieOptions(uniqueMovies);
            } catch (error) {
                console.error("Lỗi lấy danh sách phim cho Dropdown:", error);
            }
        };
        fetchMoviesForDropdown();
    }, []);

    // Load data
    useEffect(() => {
        fetchPromotions(currentPage, pageSize, {
            keyword: keyword || undefined,
            discountType: discountTypeFilter || undefined
        });
    }, [currentPage, pageSize, keyword, discountTypeFilter, fetchPromotions]);

    const handleTableChange = (pagination: any) => {
        setCurrentPage(pagination.current);
        setPageSize(pagination.pageSize);
    };

    // Mở Modal Thêm/Sửa
    const showModal = (record?: any) => {
        if (record) {
            setEditingPromotion(record);
            form.setFieldsValue({
                ...record,
                startDate: record.startDate ? dayjs(record.startDate) : null,
                endDate: record.endDate ? dayjs(record.endDate) : null,
            });
        } else {
            setEditingPromotion(null);
            form.resetFields();
            form.setFieldsValue({ isActive: true, discountType: 'PERCENT' });
        }
        setIsModalOpen(true);
    };

    // Submit Form (Thêm/Sửa)
    const handleFormSubmit = async () => {
        try {
            const values = await form.validateFields();
            const payload = {
                ...values,
                startDate: values.startDate ? values.startDate.format('YYYY-MM-DDTHH:mm:ss') : null,
                endDate: values.endDate ? values.endDate.format('YYYY-MM-DDTHH:mm:ss') : null,
            };

            let result;
            if (editingPromotion) {
                result = await updatePromotion(editingPromotion.id, payload);
            } else {
                result = await createPromotion(payload);
            }

            if (result.success) {
                message.success(result.message);
                setIsModalOpen(false);
                fetchPromotions(currentPage, pageSize, {
                    keyword: keyword || undefined,
                    discountType: discountTypeFilter || undefined
                });
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
        } catch (error) {
            console.log("Validation Failed:", error);
        }
    };

    const handleDelete = async (id: number) => {
        const result = await deletePromotion(id);
        if (result.success) {
            message.success(result.message);
            fetchPromotions(currentPage, pageSize, {
                keyword: keyword || undefined,
                discountType: discountTypeFilter || undefined
            });
        } else {
            message.error(result.message);
        }
    };

    const handleRestoreSubmit = async () => {
        if (!restoreId) {
            message.warning("Vui lòng nhập ID hợp lệ");
            return;
        }
        const result = await restorePromotion(restoreId);
        if (result.success) {
            message.success(result.message);
            setIsRestoreModalOpen(false);
            setRestoreId(null);
            fetchPromotions(currentPage, pageSize, {
                keyword: keyword || undefined,
                discountType: discountTypeFilter || undefined
            });
        } else {
            message.error(result.message);
        }
    };

    const handleToggleActive = async (record: any) => {
        const id = record.id;
        const currentState = record.isActive !== undefined ? record.isActive : record.active;
        const result = await togglePromotionActive(id);
        if (result.success) {
            message.success(`Đã ${currentState ? 'tắt' : 'bật'} trạng thái thành công!`);
            fetchPromotions(currentPage, pageSize, {
                keyword: keyword || undefined,
                discountType: discountTypeFilter || undefined
            });
        } else {
            message.error(result.message);
        }
    };

    const columns = [
        { title: 'ID', dataIndex: 'id', key: 'id', width: 60 },
        {
            title: 'Mã & Mô tả',
            key: 'code',
            render: (_: any, record: any) => (
                <div>
                    <div className="font-bold text-blue-600">{record.code}</div>
                    <div className="text-xs text-gray-500 line-clamp-2">{record.description}</div>
                </div>
            )
        },
        {
            title: 'Khuyến mãi',
            key: 'discount',
            render: (_: any, record: any) => (
                <div>
                    {record.discountType === 'PERCENT' ? (
                        <Tag color="cyan">{record.discountValue}%</Tag>
                    ) : (
                        <Tag color="green">{record.discountValue?.toLocaleString('vi-VN')} đ</Tag>
                    )}
                    {record.maxDiscount > 0 && <div className="text-[10px] text-gray-400 mt-1">Tối đa: {record.maxDiscount?.toLocaleString('vi-VN')} đ</div>}
                </div>
            )
        },
        {
            title: 'Điều kiện',
            key: 'conditions',
            render: (_: any, record: any) => (
                <div className="text-xs">
                    <div>Đơn tối thiểu: {record.minOrderValue?.toLocaleString('vi-VN')} đ</div>
                    <div>Đã dùng: <span className="font-bold text-blue-500">{record.currentUsage || 0}</span> / {record.maxUsage || '∞'}</div>
                </div>
            )
        },
        {
            title: 'Thời gian',
            key: 'time',
            render: (_: any, record: any) => (
                <div className="text-xs text-gray-600">
                    <div>Từ: {record.startDate ? dayjs(record.startDate).format('DD/MM/YYYY HH:mm') : '--'}</div>
                    <div>Đến: {record.endDate ? dayjs(record.endDate).format('DD/MM/YYYY HH:mm') : '--'}</div>
                </div>
            )
        },
        {
            title: 'Trạng thái',
            key: 'status',
            render: (_: any, record: any) => {
                const checked = record.isActive !== undefined ? record.isActive : record.active;
                return (
                    <Switch
                        checked={checked}
                        onChange={() => handleToggleActive(record)}
                        checkedChildren="Bật"
                        unCheckedChildren="Tắt"
                    />
                );
            },
        },
        {
            title: 'Hành động', key: 'action', width: 120,
            render: (_: any, record: any) => (
                <Space size="middle">
                    <Tooltip title="Chỉnh sửa">
                        <Button type="text" icon={<EditOutlined className="text-blue-500" />} onClick={() => showModal(record)} />
                    </Tooltip>
                    <Popconfirm
                        title="Xóa khuyến mãi này?"
                        description={`Chắc chắn muốn xóa mã "${record.code}"?`}
                        onConfirm={() => handleDelete(record.id)}
                        okText="Xóa" cancelText="Hủy" okButtonProps={{ danger: true }}
                    >
                        <Tooltip title="Xóa">
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
                    <h2 className="text-xl font-bold text-gray-800">Quản lý Khuyến mãi (Promotion)</h2>
                    <p className="text-gray-500 text-sm">Tạo mã giảm giá, thiết lập điều kiện áp dụng</p>
                </div>
                <div className="flex gap-4">
                    <Input
                        placeholder="Tìm mã hoặc mô tả..."
                        prefix={<SearchOutlined />}
                        className="w-56"
                        allowClear
                        onChange={(e) => setKeyword(e.target.value)}
                    />
                    <Select
                        placeholder="Loại giảm giá"
                        allowClear
                        className="w-48"
                        popupMatchSelectWidth={false}
                        onChange={(val) => setDiscountTypeFilter(val)}
                    >
                        <Option value="PERCENT">Theo phần trăm (%)</Option>
                        <Option value="AMOUNT">Theo số tiền (VNĐ)</Option>
                    </Select>
                    <Button type="default" icon={<UndoOutlined />} onClick={() => { setRestoreId(null); setIsRestoreModalOpen(true); }} className="border-gray-300">
                        Khôi Phục Theo ID
                    </Button>
                    <Button type="primary" icon={<PlusOutlined />} onClick={() => showModal()} className="bg-blue-600">
                        Thêm Mã KM
                    </Button>
                </div>
            </div>

            <Table
                columns={columns} dataSource={promotions} rowKey="id" loading={isLoading}
                onChange={handleTableChange}
                pagination={{
                    current: currentPage, pageSize: pageSize, total: totalPromotions,
                    showSizeChanger: true, showTotal: (total) => `Tổng ${total} mã KM`,
                }}
                bordered
            />

            {/* Modal Thêm/Sửa Promotion */}
            <Modal
                title={editingPromotion ? "Chỉnh Sửa Khuyến Mãi" : "Thêm Khuyến Mãi Mới"}
                open={isModalOpen}
                onOk={handleFormSubmit}
                onCancel={() => setIsModalOpen(false)}
                okText="Lưu" cancelText="Hủy"
                width={800}
                confirmLoading={isLoading}
            >
                <Form form={form} layout="vertical" className="mt-4">
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="code" label="Mã khuyến mãi (Code)" rules={[{ required: true, message: 'Nhập mã KM!' }]}>
                                <Input placeholder="VD: SUMMER2026" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="isActive" label="Trạng thái hoạt động" valuePropName="checked">
                                <Switch checkedChildren="Bật" unCheckedChildren="Tắt" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item name="description" label="Mô tả">
                        <Input.TextArea rows={2} placeholder="Nhập mô tả chi tiết chương trình..." />
                    </Form.Item>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="discountType" label="Loại giảm giá" rules={[{ required: true }]}>
                                <Select onChange={() => form.validateFields(['discountValue'])}>
                                    <Option value="PERCENT">Giảm theo phần trăm (%)</Option>
                                    <Option value="AMOUNT">Giảm theo số tiền (VNĐ)</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="discountValue"
                                label="Trị giá giảm"
                                rules={[
                                    { required: true, message: 'Nhập trị giá!' },
                                    ({ getFieldValue }) => ({
                                        validator(_, value) {
                                            if (value && getFieldValue('discountType') === 'PERCENT' && value > 100) {
                                                return Promise.reject(new Error('Phần trăm không được vượt quá 100%'));
                                            }
                                            return Promise.resolve();
                                        },
                                    })
                                ]}
                            >
                                <InputNumber style={{ width: '100%' }} min={1} placeholder="VD: 10 (nếu là %), 50000 (nếu là VNĐ)" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="startDate" label="Thời gian bắt đầu" rules={[{ required: true, message: 'Vui lòng chọn thời gian bắt đầu!' }]}>
                                <DatePicker
                                    showTime
                                    format="YYYY-MM-DD HH:mm:ss"
                                    className="w-full"
                                    disabledDate={(current) => current && current < dayjs().startOf('day')}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="endDate" label="Thời gian kết thúc" rules={[{ required: true, message: 'Vui lòng chọn thời gian kết thúc!' }]}>
                                <DatePicker
                                    showTime
                                    format="YYYY-MM-DD HH:mm:ss"
                                    className="w-full"
                                    disabledDate={(current) => current && current < dayjs().startOf('day')}
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={8}>
                            <Form.Item name="minOrderValue" label="Đơn hàng tối thiểu (VNĐ)">
                                <InputNumber style={{ width: '100%' }} min={0} step={10000} />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item name="maxDiscount" label="Giảm tối đa (VNĐ)">
                                <InputNumber
                                    style={{ width: '100%' }}
                                    min={0}
                                    step={5000}
                                    placeholder="Chỉ dùng cho %"
                                    disabled={currentDiscountType !== 'PERCENT'}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item name="maxUsage" label="Tổng lượt sử dụng tối đa">
                                <InputNumber style={{ width: '100%' }} min={1} placeholder="Bỏ trống = Vô cực" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={8}>
                            <Form.Item name="maxUsagePerUser" label="Lượt dùng tối đa/User">
                                <InputNumber style={{ width: '100%' }} min={1} placeholder="Bỏ trống = Vô cực" />
                            </Form.Item>
                        </Col>
                        <Col span={16}>
                            <Form.Item name="applicableDays" label="Các ngày áp dụng trong tuần">
                                <Select mode="multiple" allowClear placeholder="Tất cả các ngày">
                                    <Option value="Mon">Thứ 2</Option>
                                    <Option value="Tue">Thứ 3</Option>
                                    <Option value="Wed">Thứ 4</Option>
                                    <Option value="Thu">Thứ 5</Option>
                                    <Option value="Fri">Thứ 6</Option>
                                    <Option value="Sat">Thứ 7</Option>
                                    <Option value="Sun">Chủ Nhật</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item name="applicableMovies" label="Áp dụng cho Phim cụ thể">
                        <Select
                            mode="multiple"
                            allowClear
                            placeholder="Áp dụng cho tất cả phim (Nếu để trống)"
                            options={movieOptions}
                            filterOption={(input, option) =>
                                (option?.label ?? '').toString().toLowerCase().includes(input.toLowerCase())
                            }
                        />
                    </Form.Item>

                </Form>
            </Modal>

            {/* Modal Restore */}
            <Modal
                title="Khôi Phục Khuyến Mãi Đã Xóa"
                open={isRestoreModalOpen}
                onOk={handleRestoreSubmit}
                onCancel={() => setIsRestoreModalOpen(false)}
                okText="Khôi phục"
                cancelText="Đóng"
                confirmLoading={isLoading}
            >
                <p className="mb-4 text-gray-600">Nhập ID của khuyến mãi bạn muốn khôi phục từ thùng rác.</p>
                <InputNumber
                    className="w-full"
                    style={{ width: '100%' }}
                    placeholder="Nhập Promotion ID..."
                    value={restoreId}
                    onChange={(val) => setRestoreId(val)}
                    min={1}
                />
            </Modal>
        </div>
    );
}
