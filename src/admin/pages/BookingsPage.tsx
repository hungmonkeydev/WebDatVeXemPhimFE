import React, { useState, useEffect } from 'react';
import {
  Table, Button, Space, Input, Select, Modal, Popconfirm,
  message, Tooltip, Tag, DatePicker
} from 'antd';
import { SearchOutlined, EyeOutlined, SyncOutlined, StopOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { useAdminBookings } from '../../Hooks/useAdminBooking';

const { Option } = Select;
const { RangePicker } = DatePicker;

export default function BookingsPage() {
  // Lưu số trang hiện tại và số dòng trên 1 trang
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Lưu giá trị Admin gõ vào ô tìm kiếm hoặc chọn ngày/trạng thái
  const [bookingCode, setBookingCode] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [customerKeyword, setCustomerKeyword] = useState('');
  const [fromDate, setFromDate] = useState<string | null>(null);
  const [toDate, setToDate] = useState<string | null>(null);

  // Biến cờ bật tắt xem chi tiết
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [detailBooking, setDetailBooking] = useState<any | null>(null);

  // Hàm lấy dữ liệu dòng vừa bấm
  const showDetailModal = (record: any) => {
    setDetailBooking(record);
    setIsDetailModalOpen(true);
  };

  // Gọi Hook lấy danh 
  const {
    bookings, totalBookings, isLoading,
    fetchBookings, updateBookingStatus, cancelBooking
  } = useAdminBookings();

  // State đổi trạng thái
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<any | null>(null);
  const [newStatus, setNewStatus] = useState('');

  // Load data
  useEffect(() => {
    fetchBookings(currentPage, pageSize, {
      bookingCode: bookingCode || undefined,
      status: statusFilter || undefined,
      fromDate: fromDate || undefined,
      toDate: toDate || undefined
    });
  }, [currentPage, pageSize, bookingCode, statusFilter, fromDate, toDate, fetchBookings]);

  // tự động chạy khi admin bấm sang trang
  const handleTableChange = (pagination: any) => {
    setCurrentPage(pagination.current);
    setPageSize(pagination.pageSize);
  };

  // Mở modal đổi trạng thái
  const showStatusModal = (record: any) => {
    setSelectedBooking(record);
    setNewStatus(record.status);
    setIsStatusModalOpen(true);
  };

  //  Admin bấm nút "Lưu thay đổi" 
  const handleStatusSubmit = async () => {
    if (selectedBooking && newStatus !== selectedBooking.status) {
      const result = await updateBookingStatus(selectedBooking.bookingId, newStatus);

      if (result.success) {
        message.success(result.message);
        setIsStatusModalOpen(false);
        fetchBookings(currentPage, pageSize, { bookingCode, status: statusFilter });
      } else {
        message.error(result.message);
      }
    } else {
      setIsStatusModalOpen(false); 
    }
  };

  const handleCancel = async (id: number) => {
    const result = await cancelBooking(id);
    if (result.success) {
      message.success(result.message);
      fetchBookings(currentPage, pageSize, { bookingCode, status: statusFilter });
    } else {
      message.error(result.message);
    }
  };

  const renderStatus = (status: string) => {
    switch (status) {
      case 'PAID': return <Tag color="green">Đã thanh toán</Tag>;
      case 'PENDING': return <Tag color="gold">Chờ thanh toán</Tag>;
      case 'CANCELLED': return <Tag color="red">Đã hủy</Tag>;
      default: return <Tag>{status}</Tag>;
    }
  };

  const columns = [
    { title: 'ID', dataIndex: 'bookingId', key: 'bookingId', width: 70 },
    {
      title: 'Mã Đơn',
      dataIndex: 'bookingCode',
      key: 'bookingCode',
      render: (text: string) => <div className="font-semibold text-blue-600">{text}</div>,
    },
    {
      title: 'Khách hàng',
      key: 'customer',
      render: (_: any, record: any) => (
        <div className="flex flex-col">
          <span className="font-bold text-gray-800">{record.customerName || 'Khách vãng lai'}</span>
          <span className="text-xs text-gray-500">{record.customerEmail}</span>
        </div>
      ),
    },
    {
      title: 'Phim & Rạp',
      key: 'movieInfo',
      render: (_: any, record: any) => (
        <div className="flex flex-col">
          <span className="font-semibold text-gray-800 truncate max-w-[150px]" title={record.movieTitle}>
            {record.movieTitle}
          </span>
          <span className="text-xs text-gray-500">{record.cinemaName}</span>
        </div>
      ),
    },
    {
      title: 'Ngày đặt',
      dataIndex: 'bookedAt',
      key: 'bookedAt',
      render: (date: string) => <span>{date ? dayjs(date).format('HH:mm DD/MM/YYYY') : ''}</span>,
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'finalAmount',
      key: 'finalAmount',
      render: (price: number) => <span className="font-medium text-red-500">{price?.toLocaleString()} VNĐ</span>,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => renderStatus(status),
    },
    {
      title: 'Hành động', key: 'action', width: 150,
      render: (_: any, record: any) => (
        <Space size="small">
          <Tooltip title="Xem chi tiết">
            <Button type="text" icon={<EyeOutlined className="text-gray-500" />} onClick={() => showDetailModal(record)} />
          </Tooltip>
          <Tooltip title="Đổi trạng thái">
            <Button type="text" icon={<SyncOutlined className="text-blue-500" />} onClick={() => showStatusModal(record)} />
          </Tooltip>
          <Popconfirm
            title="Ép hủy đơn hàng?"
            description="Ghế sẽ tự động được giải phóng. Bạn có chắc chắn?"
            onConfirm={() => handleCancel(record.bookingId)} 
            okText="Hủy đơn" cancelText="Đóng" okButtonProps={{ danger: true }}
            disabled={record.status === 'CANCELLED'}
          >
            <Tooltip title="Ép hủy">
              <Button type="text" danger icon={<StopOutlined />} disabled={record.status === 'CANCELLED'} />
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
          <h2 className="text-xl font-bold text-gray-800">Quản lý Đơn hàng (Booking)</h2>
          <p className="text-gray-500 text-sm">Theo dõi và xử lý giao dịch đặt vé</p>
        </div>
        <div className="flex gap-4">
          <Input
            placeholder="Tìm mã đơn hàng..."
            prefix={<SearchOutlined />}
            className="w-48"
            allowClear
            onPressEnter={(e: any) => setBookingCode(e.target.value)}
            onChange={(e) => { if (!e.target.value) setBookingCode('') }}
          />
          <Input
            placeholder="Tìm tên, email (Trang HT)"
            prefix={<SearchOutlined />}
            className="w-56"
            allowClear
            onChange={(e) => setCustomerKeyword(e.target.value)}
          />
          <RangePicker
            className="w-64"
            format="DD/MM/YYYY"
            placeholder={['Từ ngày', 'Đến ngày']}
            onChange={(dates) => {
              if (dates && dates.length === 2) {
                setFromDate(dates[0] ? dates[0].format('YYYY-MM-DD') : null);
                setToDate(dates[1] ? dates[1].format('YYYY-MM-DD') : null);
              } else {
                setFromDate(null);
                setToDate(null);
              }
            }}
          />
          <Select
            placeholder="Lọc trạng thái"
            style={{ width: 150 }}
            allowClear
            onChange={(value) => setStatusFilter(value)}
          >
            <Option value="PENDING">Chờ thanh toán</Option>
            <Option value="PAID">Đã thanh toán</Option>
            <Option value="CANCELLED">Đã hủy</Option>
          </Select>
        </div>
      </div>

      <Table
        columns={columns} 
        dataSource={bookings.filter((b: any) => {
          if (!customerKeyword) return true;
          const kw = customerKeyword.toLowerCase();
          return (
            (b.customerName && b.customerName.toLowerCase().includes(kw)) ||
            (b.customerEmail && b.customerEmail.toLowerCase().includes(kw))
          );
        })} 
        rowKey="bookingId" loading={isLoading}
        onChange={handleTableChange}
        pagination={{
          current: currentPage, pageSize: pageSize, total: totalBookings,
          showSizeChanger: true, showTotal: (total) => `Tổng ${total} đơn hàng`,
        }}
        bordered
      />

      {/* Modal Đổi Trạng Thái */}
      <Modal
        title="Cập nhật trạng thái đơn hàng"
        open={isStatusModalOpen}
        onOk={handleStatusSubmit}
        onCancel={() => setIsStatusModalOpen(false)}
        confirmLoading={isLoading}
        okText="Lưu thay đổi"
        cancelText="Hủy"
      >
        <p className="mb-2">Chọn trạng thái mới cho mã đơn: <strong>{selectedBooking?.bookingCode}</strong></p>
        <Select
          className="w-full"
          value={newStatus}
          onChange={(value) => setNewStatus(value)}
        >
          <Option value="PENDING">Chờ thanh toán (PENDING)</Option>
          <Option value="PAID">Đã thanh toán (PAID)</Option>
          <Option value="CANCELLED">Đã hủy (CANCELLED)</Option>
        </Select>
      </Modal>
      {/* Modal Xem Chi Tiết Đơn Hàng */}
      <Modal
        title={<span className="text-lg font-bold text-gray-800">Chi tiết đơn hàng {detailBooking?.bookingCode}</span>}
        open={isDetailModalOpen}
        onCancel={() => setIsDetailModalOpen(false)}
        footer={[
          <Button key="close" onClick={() => setIsDetailModalOpen(false)}>
            Đóng
          </Button>
        ]}
        width={600}
      >
        {detailBooking && (
          <div className="grid grid-cols-2 gap-4 mt-4 text-gray-700">
            <div>
              <p><strong>Mã đơn:</strong> <span className="text-blue-600">{detailBooking.bookingCode}</span></p>
              <p><strong>Ngày đặt:</strong> {dayjs(detailBooking.bookedAt).format('HH:mm DD/MM/YYYY')}</p>
              <p><strong>Trạng thái:</strong> {renderStatus(detailBooking.status)}</p>
              <p><strong>Tổng tiền:</strong> <span className="text-red-500 font-bold">{detailBooking.finalAmount?.toLocaleString()} VNĐ</span></p>
            </div>
            <div>
              <p><strong>Khách hàng:</strong> {detailBooking.customerName || 'N/A'}</p>
              <p><strong>Email:</strong> {detailBooking.customerEmail}</p>
              <p><strong>SĐT:</strong> {detailBooking.user?.phone || 'N/A'}</p>
            </div>
            <div className="col-span-2 border-t pt-4 mt-2">
              <h3 className="font-semibold mb-2">Thông tin phim & rạp</h3>
              <p><strong>Phim:</strong> {detailBooking.movieTitle}</p>
              <p><strong>Rạp:</strong> {detailBooking.cinemaName} - {detailBooking.roomName}</p>
              <p><strong>Thời gian chiếu:</strong> {dayjs(detailBooking.showtimeStart).format('HH:mm DD/MM/YYYY')}</p>
              <p><strong>Tổng số ghế:</strong> {detailBooking.totalSeats} ghế</p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}