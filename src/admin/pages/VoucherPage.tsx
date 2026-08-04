import React, { useState, useEffect } from 'react';
import {
  Table, Button, Space, Tag, Input, Select, Form, Modal, Popconfirm,
  message, Tooltip, InputNumber, DatePicker
} from 'antd';
import {
  SearchOutlined, EditOutlined, PlusOutlined,
  LockOutlined, UnlockOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { useAdminVouchers } from '../../Hooks/useAdminVoucher';

const { Option } = Select;
const { RangePicker } = DatePicker;

export default function VoucherManage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [keyword, setKeyword] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const {
    vouchers, totalVouchers, isLoading,
    fetchVouchers, createVoucher, updateVoucher, lockVoucher, unlockVoucher
  } = useAdminVouchers();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVoucher, setEditingVoucher] = useState<any | null>(null);
  const [form] = Form.useForm();

  const selectedType = Form.useWatch('voucherType', form);

  useEffect(() => {
    fetchVouchers(currentPage, pageSize, {
      keyword: keyword || undefined,
      voucherType: typeFilter || undefined,
      status: statusFilter || undefined,
    });
  }, [currentPage, pageSize, keyword, typeFilter, statusFilter, fetchVouchers]);

  const handleTableChange = (pagination: any) => {
    setCurrentPage(pagination.current);
    setPageSize(pagination.pageSize);
  };

  const showModal = (record?: any) => {
    if (record) {
      setEditingVoucher(record);
      form.setFieldsValue({
        ...record,
        originalValue: record.voucherType === 'GIFT_CARD' ? (record.originalValue || record.currentBalance) : undefined,
        discountType: record.discountType || 'PERCENTAGE',
        validDates: record.validFrom && record.expiresAt
          ? [dayjs(record.validFrom), dayjs(record.expiresAt)]
          : null,
      });
    } else {
      setEditingVoucher(null);
      form.resetFields();
    }
    setIsModalOpen(true);
  };

  const handleFormSubmit = async () => {
    try {
      const values = await form.validateFields();
      const payload = { ...values };
      if (payload.validDates) {
        payload.expiresAt = payload.validDates[1].format('YYYY-MM-DD');
      }
      delete payload.validDates;
      delete payload.validFrom;
      if (!payload.code || payload.code.trim() === '') delete payload.code;
      if (!payload.description) delete payload.description;
      if (payload.voucherType === 'GIFT_CARD') {
        payload.originalValue = Number(payload.originalValue);
        delete payload.discountValue;
        delete payload.discountType;
        delete payload.currentBalance;
      } else {
        payload.discountValue = Number(payload.discountValue);
        delete payload.originalValue;
        delete payload.currentBalance;
      }

      console.log("Cục Payload trước khi gửi:", payload);
      let result;
      const idToUpdate = editingVoucher?.id || editingVoucher?.voucherId;

      if (editingVoucher) {
        result = await updateVoucher(idToUpdate, payload);
      } else {
        result = await createVoucher(payload);
      }

      if (result.success) {
        message.success(result.message);
        setIsModalOpen(false);
        fetchVouchers(currentPage, pageSize, { keyword, voucherType: typeFilter, status: statusFilter });
      } else {
        message.error(result.message);
      }
    } catch (error: any) {
      console.log("Validation Failed:", error);
    }
  };

  const handleToggleLock = async (record: any) => {
    const id = record.id || record.voucherId;
    let result;

    if (record.status === 'LOCKED') {
      result = await unlockVoucher(id);
    } else {
      result = await lockVoucher(id);
    }

    if (result.success) {
      message.success(result.message);
      fetchVouchers(currentPage, pageSize, { keyword, voucherType: typeFilter, status: statusFilter });
    } else {
      message.error(result.message);
    }
  };

  const renderStatus = (status: string) => {
    switch (status) {
      case 'ACTIVE': return <Tag color="green">Đang hoạt động</Tag>;
      case 'PENDING': return <Tag color="gold">Chờ kích hoạt</Tag>;
      case 'EXPIRED': return <Tag color="default">Đã hết hạn</Tag>;
      case 'LOCKED': return <Tag color="red">Đã khóa</Tag>;
      default: return <Tag>{status}</Tag>;
    }
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 70 },
    {
      title: 'Mã Voucher',
      dataIndex: 'code',
      key: 'code',
      render: (text: string) => <div className="font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded inline-block border border-orange-200">{text}</div>,
    },
    {
      title: 'Loại',
      dataIndex: 'voucherType',
      key: 'voucherType',
      render: (type: string) => {
        if (type === 'GIFT_CARD') return <Tag color="purple">Thẻ quà tặng</Tag>;
        if (type === 'TICKET_DISCOUNT') return <Tag color="blue">Giảm giá vé</Tag>;
        if (type === 'COMBO_DISCOUNT') return <Tag color="cyan">Giảm giá Combo</Tag>;
        return <Tag>{type}</Tag>;
      }
    },
    {
      title: 'Giá trị / Mức giảm',
      key: 'value',
      render: (_: any, record: any) => {
        if (record.voucherType === 'GIFT_CARD') {
          return (
            <div className="text-sm">
              <div className="font-medium text-green-600">Số dư: {record.currentBalance?.toLocaleString()}đ</div>
              <div className="text-xs text-gray-500">Gốc: {record.originalValue?.toLocaleString()}đ</div>
            </div>
          );
        }

        const isPercent = record.discountType === 'PERCENTAGE';
        return (
          <span className="font-medium text-red-500">
            {record.discountValue?.toLocaleString()}{isPercent ? '%' : 'đ'}
          </span>
        );
      }
    },
    {
      title: 'Chủ sở hữu',
      key: 'owner',
      render: (_: any, record: any) => {
        if (!record.ownerEmail) return <span className="text-gray-400 italic">Chưa sở hữu</span>;
        return (
          <div className="text-sm">
            <div className="font-medium text-gray-800">{record.ownerFullName}</div>
            <div className="text-xs text-gray-500">{record.ownerEmail}</div>
          </div>
        );
      }
    },
    {
      title: 'Hạn sử dụng',
      key: 'expiresAt',
      render: (_: any, record: any) => (
        <div className="text-xs text-gray-600">
          Từ: {record.validFrom ? dayjs(record.validFrom).format('DD/MM/YYYY') : '---'}<br />
          Đến: {record.expiresAt ? dayjs(record.expiresAt).format('DD/MM/YYYY') : '---'}
        </div>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => renderStatus(status),
    },
    {
      title: 'Hành động', key: 'action', width: 120,
      render: (_: any, record: any) => {
        const isLocked = record.status === 'LOCKED';
        return (
          <Space size="middle">
            <Tooltip title="Chỉnh sửa">
              <Button type="text" icon={<EditOutlined className="text-blue-500" />} onClick={() => showModal(record)} />
            </Tooltip>
            <Popconfirm
              title={isLocked ? "Mở khóa voucher này?" : "Khóa voucher này?"}
              description={isLocked ? "Voucher sẽ trở lại trạng thái bình thường." : "Khách hàng sẽ không thể dùng voucher này."}
              onConfirm={() => handleToggleLock(record)}
              okText="Đồng ý" cancelText="Hủy"
              okButtonProps={isLocked ? { type: 'primary' } : { danger: true }}
            >
              <Tooltip title={isLocked ? "Mở khóa" : "Khóa khẩn cấp"}>
                <Button type="text" danger={isLocked} className={!isLocked ? 'text-green-500' : ''} icon={isLocked ? <LockOutlined /> : <UnlockOutlined />} />
              </Tooltip>
            </Popconfirm>
          </Space>
        )
      },
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Quản lý Khuyến mãi (Voucher)</h2>
          <p className="text-gray-500 text-sm">Thêm mới, theo dõi và khóa các mã giảm giá</p>
        </div>

        <div className="flex gap-3">
          <Input
            placeholder="Tìm mã code hoặc email..."
            prefix={<SearchOutlined />}
            className="w-56"
            allowClear
            onPressEnter={(e: any) => setKeyword(e.target.value)}
            onChange={(e) => { if (!e.target.value) setKeyword('') }}
          />
          <Select placeholder="Loại Voucher" style={{ width: 160 }} allowClear onChange={(val) => setTypeFilter(val)}>
            <Option value="GIFT_CARD">Thẻ quà tặng</Option>
            <Option value="TICKET_DISCOUNT">Giảm giá vé</Option>
            <Option value="COMBO_DISCOUNT">Giảm giá Combo</Option>
          </Select>
          <Select placeholder="Trạng thái" style={{ width: 140 }} allowClear onChange={(val) => setStatusFilter(val)}>
            <Option value="PENDING">Chờ kích hoạt</Option>
            <Option value="ACTIVE">Đang hoạt động</Option>
            <Option value="EXPIRED">Đã hết hạn</Option>
            <Option value="LOCKED">Đã khóa</Option>
          </Select>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => showModal()} className="bg-blue-600">
            Tạo Voucher
          </Button>
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={vouchers}
        rowKey={(record) => record.id || record.voucherId}
        loading={isLoading}
        onChange={handleTableChange}
        pagination={{
          current: currentPage, pageSize: pageSize, total: totalVouchers,
          showSizeChanger: true, showTotal: (total) => `Tổng ${total} mã`,
        }}
        bordered
      />

      <Modal
        title={editingVoucher ? "Cập nhật Voucher" : "Tạo Voucher Mới"}
        open={isModalOpen} onOk={handleFormSubmit} onCancel={() => setIsModalOpen(false)}
        okText={editingVoucher ? "Cập nhật" : "Tạo mới"} cancelText="Hủy" destroyOnHidden
        confirmLoading={isLoading}
        width={700} // Nới rộng form ra xíu cho thoáng
      >
        <Form form={form} layout="vertical" className="mt-4">

          <div className="grid grid-cols-2 gap-4">
            <Form.Item name="code" label="Mã Voucher (Code)">
              <Input placeholder="Bỏ trống hệ thống tự sinh mã" disabled={!!editingVoucher} />
            </Form.Item>

            <Form.Item name="voucherType" label="Loại khuyến mãi" rules={[{ required: true, message: 'Chọn loại voucher!' }]}>
              <Select placeholder="Chọn loại..." disabled={!!editingVoucher}>
                <Option value="GIFT_CARD">Thẻ quà tặng (Gift Card)</Option>
                <Option value="TICKET_DISCOUNT">Giảm giá vé</Option>
                <Option value="COMBO_DISCOUNT">Giảm giá Combo</Option>
              </Select>
            </Form.Item>
          </div>

          <div className="grid grid-cols-2 gap-4">

            {/* LOGIC ĐỘNG: Hiển thị 1 Mệnh giá (Gift Card) HOẶC Form chọn %/VNĐ (Vé/Combo) */}
            {selectedType === 'GIFT_CARD' ? (
              <Form.Item
                name="originalValue"
                label="Mệnh giá thẻ quà tặng (VNĐ)"
                rules={[{ required: true, message: 'Vui lòng nhập mệnh giá thẻ!' }]}
              >
                <InputNumber className="w-full" min={1} placeholder="Ví dụ: 500000" disabled={!!editingVoucher} />
              </Form.Item>
            ) : (
              <Form.Item label="Mức giảm giá" required>
                <Space.Compact style={{ width: '100%' }}>
                  <Form.Item
                    name="discountValue"
                    noStyle
                    rules={[{ required: true, message: 'Vui lòng nhập mức giảm!' }]}
                  >
                    <InputNumber style={{ width: '70%' }} min={1} placeholder="Ví dụ: 50" />
                  </Form.Item>
                  <Form.Item
                    name="discountType"
                    noStyle
                    initialValue="PERCENTAGE"
                  >
                    <Select style={{ width: '30%' }}>
                      <Option value="PERCENTAGE">%</Option>
                      <Option value="FIXED_AMOUNT">VNĐ</Option>
                    </Select>
                  </Form.Item>
                </Space.Compact>
              </Form.Item>
            )}

            <Form.Item name="validDates" label="Thời gian áp dụng" rules={[{ required: true, message: 'Vui lòng chọn thời gian!' }]}>
              <RangePicker showTime format="YYYY-MM-DD HH:mm:ss" className="w-full" />
            </Form.Item>
          </div>

          <Form.Item name="description" label="Ghi chú (Tùy chọn)">
            <Input.TextArea rows={3} placeholder="Ví dụ: Áp dụng cho thành viên mới..." />
          </Form.Item>

        </Form>
      </Modal>
    </div>
  );
}