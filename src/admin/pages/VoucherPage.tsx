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
        discountType: record.discountType || 'PERCENT',
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

      // Xử lý ngày tháng
      if (payload.validDates) {
        payload.expiresAt = payload.validDates[1].format('YYYY-MM-DD');
      }
      delete payload.validDates;
      delete payload.validFrom;

      if (!payload.code || payload.code.trim() === '') delete payload.code;
      if (!payload.description) delete payload.description;

      // Xử lý payload theo từng loại Voucher cụ thể
      if (payload.voucherType === 'GIFT_CARD') {
        payload.originalValue = Number(payload.originalValue);
        // Reset các trường không liên quan
        delete payload.discountValue;
        delete payload.discountType;
        delete payload.currentBalance;
        delete payload.redeemedComboId;
        delete payload.redeemedComboQuantity;
      } else if (payload.voucherType === 'COMBO_DISCOUNT') {
        payload.discountValue = Number(payload.discountValue);
        payload.redeemedComboId = Number(payload.redeemedComboId);
        payload.redeemedComboQuantity = Number(payload.redeemedComboQuantity);
        // Reset các trường không liên quan
        delete payload.originalValue;
        delete payload.currentBalance;
        delete payload.recipientName;
        delete payload.recipientEmail;
        delete payload.message;
      } else {
        // TICKET_DISCOUNT
        payload.discountValue = Number(payload.discountValue);
        delete payload.originalValue;
        delete payload.currentBalance;
        delete payload.redeemedComboId;
        delete payload.redeemedComboQuantity;
        delete payload.recipientName;
        delete payload.recipientEmail;
        delete payload.message;
      }

      console.log("Cục Payload gửi lên Backend:", payload);
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
    { title: 'ID', dataIndex: 'id', key: 'id', width: 60 },
    {
      title: 'Mã Voucher',
      dataIndex: 'code',
      key: 'code',
      render: (text: string) => <div className="font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded inline-block border border-orange-200">{text}</div>,
    },
    {
      title: 'Loại / Chi tiết',
      key: 'details',
      render: (_: any, record: any) => {
        return (
          <div className="flex flex-col gap-1">
            <div>
              {record.voucherType === 'GIFT_CARD' && <Tag color="purple">Thẻ quà tặng</Tag>}
              {record.voucherType === 'TICKET_DISCOUNT' && <Tag color="blue">Giảm giá vé</Tag>}
              {record.voucherType === 'COMBO_DISCOUNT' && <Tag color="cyan">Giảm giá Combo</Tag>}
            </div>
            {/*Hiển thị thêm chi tiết cho Combo */}
            {record.voucherType === 'COMBO_DISCOUNT' && record.redeemedComboId && (
              <span className="text-xs text-gray-500">
                Áp dụng Combo ID: {record.redeemedComboId} (SL: {record.redeemedComboQuantity})
              </span>
            )}
          </div>
        );
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
        const isPercent = record.discountType === 'PERCENT';
        return (
          <span className="font-medium text-red-500">
            {record.discountValue?.toLocaleString()}{isPercent ? '%' : 'đ'}
          </span>
        );
      }
    },
    {
      title: 'Chủ sở hữu / Người nhận',
      key: 'owner',
      render: (_: any, record: any) => {
        return (
          <div className="text-sm">
            {record.ownerEmail ? (
              <>
                <div className="text-xs text-gray-400">Người mua:</div>
                <div className="font-medium text-gray-800">{record.ownerFullName || 'Unknown'}</div>
              </>
            ) : <span className="text-gray-400 italic">Chưa có người mua</span>}

            {/*Hiển thị người nhận cho Gift Card */}
            {record.voucherType === 'GIFT_CARD' && record.recipientEmail && (
              <div className="mt-1 pt-1 border-t border-dashed border-gray-200">
                <div className="text-xs text-gray-400">Gửi đến:</div>
                <div className="font-medium text-blue-600">{record.recipientName}</div>
                <div className="text-xs text-gray-500">{record.recipientEmail}</div>
              </div>
            )}
          </div>
        );
      }
    },
    {
      title: 'Hạn sử dụng',
      key: 'expiresAt',
      render: (_: any, record: any) => (
        <div className="text-xs text-gray-600">
          Tới: {record.expiresAt ? dayjs(record.expiresAt).format('DD/MM/YYYY') : '---'}
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
      title: 'Hành động', key: 'action', width: 100,
      render: (_: any, record: any) => {
        const isLocked = record.status === 'LOCKED';
        return (
          <Space size="middle">
            <Tooltip title="Chỉnh sửa">
              <Button type="text" icon={<EditOutlined className="text-blue-500" />} onClick={() => showModal(record)} />
            </Tooltip>
            <Popconfirm
              title={isLocked ? "Mở khóa voucher này?" : "Khóa voucher này?"}
              description={isLocked ? "Voucher sẽ trở lại bình thường." : "Khách sẽ không thể dùng voucher này."}
              onConfirm={() => handleToggleLock(record)}
              okText="Đồng ý" cancelText="Hủy"
              okButtonProps={isLocked ? { type: 'primary' } : { danger: true }}
            >
              <Tooltip title={isLocked ? "Mở khóa" : "Khóa"}>
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
        okText={editingVoucher ? "Lưu" : "Tạo mới"} cancelText="Hủy" destroyOnHidden
        confirmLoading={isLoading}
        width={750}
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
            {/* LOGIC ĐỘNG: Render các field tùy theo loại Voucher */}
            {selectedType === 'GIFT_CARD' ? (
              <Form.Item name="originalValue" label="Mệnh giá thẻ quà tặng (VNĐ)" rules={[{ required: true, message: 'Vui lòng nhập mệnh giá!' }]}>
                <InputNumber className="w-full" min={1} placeholder="Ví dụ: 500000" disabled={!!editingVoucher} />
              </Form.Item>
            ) : (
              <Form.Item label="Mức giảm giá" required>
                <Space.Compact style={{ width: '100%' }}>
                  <Form.Item name="discountValue" noStyle rules={[{ required: true, message: 'Nhập mức giảm!' }]}>
                    <InputNumber style={{ width: '70%' }} min={1} placeholder="Ví dụ: 50" />
                  </Form.Item>
                  <Form.Item name="discountType" noStyle initialValue="PERCENT">
                    <Select style={{ width: '30%' }}>
                      <Option value="PERCENT">%</Option>
                      <Option value="FIXED_AMOUNT">VNĐ</Option>
                      <Option value="AMOUNT">VNĐ</Option>
                    </Select>
                  </Form.Item>
                </Space.Compact>
              </Form.Item>
            )}

            <Form.Item name="validDates" label="Thời gian áp dụng" rules={[{ required: true, message: 'Vui lòng chọn thời gian!' }]}>
              <RangePicker showTime format="YYYY-MM-DD HH:mm:ss" className="w-full" />
            </Form.Item>
          </div>

          {/*Các ô nhập ĐỘNG cho COMBO_DISCOUNT */}
          {selectedType === 'COMBO_DISCOUNT' && (
            <div className="grid grid-cols-2 gap-4 bg-cyan-50 p-4 rounded-lg mb-4 border border-cyan-100">
              <Form.Item name="redeemedComboId" label="ID Combo được giảm" rules={[{ required: true, message: 'Nhập ID Combo!' }]}>
                <InputNumber className="w-full" min={1} placeholder="Nhập ID của combo" />
              </Form.Item>
              <Form.Item name="redeemedComboQuantity" label="Số lượng Combo" rules={[{ required: true, message: 'Nhập số lượng!' }]}>
                <InputNumber className="w-full" min={1} placeholder="Nhập số lượng" />
              </Form.Item>
            </div>
          )}

          {/*Các ô nhập ĐỘNG cho GIFT_CARD */}
          {selectedType === 'GIFT_CARD' && (
            <div className="bg-purple-50 p-4 rounded-lg mb-4 border border-purple-100">
              <div className="grid grid-cols-2 gap-4">
                <Form.Item name="recipientName" label="Tên người nhận (Tùy chọn)">
                  <Input placeholder="Nhập tên người nhận..." />
                </Form.Item>
                <Form.Item name="recipientEmail" label="Email người nhận (Tùy chọn)" rules={[{ type: 'email', message: 'Email không hợp lệ!' }]}>
                  <Input placeholder="Nhập email người nhận..." />
                </Form.Item>
              </div>
              <Form.Item name="message" label="Lời chúc (Tùy chọn)" className="mb-0">
                <Input.TextArea rows={2} placeholder="Nhập lời chúc đính kèm..." />
              </Form.Item>
            </div>
          )}

          <Form.Item name="description" label="Ghi chú hệ thống (Tùy chọn)" className="mt-4">
            <Input.TextArea rows={2} placeholder="Ghi chú nội bộ cho admin..." />
          </Form.Item>

        </Form>
      </Modal>
    </div>
  );
}