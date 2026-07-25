import React, { useState, useEffect } from 'react';
import {
  Table, Button, Space, Tag, Input, Form, Modal, Select, Popconfirm,
  message, Tooltip, DatePicker, InputNumber
} from 'antd';
import { SearchOutlined, EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
// 👉 Dùng Hook AdminShowtime (Nhớ check lại đường dẫn nếu file có chữ 's' hay không nha)
import { useAdminShowtimes } from '../../Hooks/useAdminShowtime';
import { movieService } from '../../services/movieService';

interface ShowtimeType {
  showtimeId: number;
  movieName: string;
  movieId: number;
  cinemaName: string;
  roomId: number;
  roomName: string;
  startTime: string;
  endTime: string;
  isActive: boolean;
  basePrice: number;
}

export default function ShowtimeManage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // 👉 1. GỌI HOOK XỬ LÝ API CHO SUẤT CHIẾU
  const {
    showtimes, totalShowtimes, isLoading,
    fetchShowtimes, createShowtime, updateShowtime, deleteShowtime
  } = useAdminShowtimes();

  // 👉 2. KHAI BÁO CÁC STATE CHO MODAL & DROPDOWN
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingShowtime, setEditingShowtime] = useState<ShowtimeType | null>(null);
  const [form] = Form.useForm();

  const [movieOptions, setMovieOptions] = useState<any[]>([]);
  const [isMovieLoading, setIsMovieLoading] = useState(false);
  const [rooms, setRooms] = useState([
    { value: 1, label: 'Phòng 1 - Cinema Q10' },
    { value: 2, label: 'Phòng 2 - Cinema Q10' }
  ]);

  // 👉 3. LẤY DANH SÁCH PHIM ĐANG CHIẾU & SẮP CHIẾU ĐỔ VÀO DROPDOWN
  useEffect(() => {
    const fetchMoviesForDropdown = async () => {
      setIsMovieLoading(true);
      try {
        const [nowRes, soonRes] = await Promise.all([
          movieService.getNowShowing(0, 20),
          movieService.getComingSoon(0, 20)
        ]);

        const nowArr = nowRes.data?.data?.content || nowRes.data?.data || [];
        const soonArr = soonRes.data?.data?.content || soonRes.data?.data || [];

        const combinedMovies = [...nowArr, ...soonArr].map((m: any) => ({
          value: m.movieId,
          label: m.title
        }));

        // Lọc trùng lặp
        const uniqueMovies = Array.from(
          new Map(combinedMovies.map(item => [item.value, item])).values()
        );

        setMovieOptions(uniqueMovies);
      } catch (error) {
        console.error("Lỗi lấy danh sách phim cho Dropdown:", error);
      } finally {
        setIsMovieLoading(false);
      }
    };

    fetchMoviesForDropdown();
  }, []);
  useEffect(() => {
    const uniqueRooms = Array.from(
      new Map(
        showtimes.map((s: any) => [
          s.room.roomId,
          {
            value: s.room.roomId,
            label: `${s.cinema.name} - ${s.room.roomName}`,
          },
        ])
      ).values()
    );

    setRooms(uniqueRooms);
  }, [showtimes]);


  useEffect(() => {
    fetchShowtimes(currentPage, pageSize);
  }, [currentPage, pageSize, fetchShowtimes]);

  const handleTableChange = (pagination: any) => {
    setCurrentPage(pagination.current);
    setPageSize(pagination.pageSize);
  };

  // 👉 5. XỬ LÝ MỞ MODAL THÊM/SỬA
  const showModal = (record?: any) => {
    if (record) {
      setEditingShowtime(record);

      form.setFieldsValue({
        ...record,
        movieId: record.movie?.movieId,
        roomId: record.room?.roomId,
        startTime: record.startTime ? dayjs(record.startTime) : null,
        endTime: record.endTime ? dayjs(record.endTime) : null,
        isActive: record.isActive
      });
    } else {
      setEditingShowtime(null);
      form.resetFields();
      form.setFieldsValue({ isActive: true });
    }
    setIsModalOpen(true);
  };

  const handleFormSubmit = async () => {
    try {
      const values = await form.validateFields();
      const payload = {
        movieId: values.movieId,
        roomId: values.roomId,
        basePrice: values.basePrice,
        startTime: values.startTime ? values.startTime.format('YYYY-MM-DD HH:mm:ss') : null,
        endTime: values.endTime ? values.endTime.format('YYYY-MM-DD HH:mm:ss') : null,
        isActive: values.isActive ?? true,
      };

      let result;
      if (editingShowtime) {
        result = await updateShowtime(editingShowtime.showtimeId, payload);
      } else {
        result = await createShowtime(payload);
      }

      if (result.success) {
        message.success(result.message);
        setIsModalOpen(false);
        fetchShowtimes(currentPage, pageSize);
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
      console.log("Validation Failed Frontend:", error);
    }
  };

  const handleDelete = async (showtimeId: number) => {
    const result = await deleteShowtime(showtimeId);
    if (result.success) {
      message.success(result.message);
      fetchShowtimes(currentPage, pageSize);
    } else {
      message.error(result.message);
    }
  };

  const columns = [
    { title: 'ID', dataIndex: 'showtimeId', key: 'showtimeId', width: 70 },
    {
      title: 'Phim chiếu',
      key: 'movie',
      render: (_: any, record: any) => (
        <div className="font-semibold text-gray-800">
          {record.movie?.title || 'Đang cập nhật'}
        </div>
      ),
    },
    {
      title: 'Rạp / Phòng',
      key: 'room',
      render: (_: any, record: any) => (
        <div>
          <div className="text-[14px] font-medium">{record.cinema?.name || 'Đang cập nhật rạp'}</div>
          <div className="text-xs text-gray-500">
            {record.room?.roomName ? `Phòng: ${record.room.roomName}` : 'Chưa có thông tin phòng'}
          </div>
        </div>
      )
    },
    {
      title: 'Thời gian chiếu',
      key: 'time',
      render: (_: any, record: any) => (
        <div>
          <div className="text-blue-600 font-medium">
            {record.startTime ? dayjs(record.startTime).format('HH:mm - DD/MM/YYYY') : ''}
          </div>
          <div className="text-xs text-gray-400">
            Đến: {record.endTime ? dayjs(record.endTime).format('HH:mm') : ''}
          </div>
        </div>
      ),
    },
    {
      title: 'Trạng thái', dataIndex: 'isActive', key: 'isActive',
      render: (isActive: boolean) => (
        <Tag color={isActive ? 'success' : 'error'} className="font-bold">
          {isActive ? 'ĐANG MỞ' : 'VÔ HIỆU HÓA'}
        </Tag>
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
            title="Cảnh báo"
            description={`Bạn có chắc chắn muốn xóa suất chiếu này?`}
            onConfirm={() => handleDelete(record.showtimeId)}
            okText="Xóa" cancelText="Hủy" okButtonProps={{ danger: true }}
          >
            <Tooltip title="Xóa suất chiếu">
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
          <h2 className="text-xl font-bold text-gray-800">Quản lý Suất chiếu</h2>
          <p className="text-gray-500 text-sm">Điều phối lịch chiếu phim tại các rạp</p>
        </div>
        <div className="flex gap-4">
          <Input placeholder="Tìm theo tên phim..." prefix={<SearchOutlined />} className="w-64" allowClear />
          <Button type="primary" icon={<PlusOutlined />} onClick={() => showModal()} className="bg-blue-600">
            Thêm Suất Chiếu
          </Button>
        </div>
      </div>

      <Table
        columns={columns} dataSource={showtimes} rowKey="showtimeId" loading={isLoading}
        onChange={handleTableChange}
        pagination={{
          current: currentPage, pageSize: pageSize, total: totalShowtimes,
          showSizeChanger: true, showTotal: (total) => `Tổng ${total} suất chiếu`,
        }}
        bordered
      />

      <Modal
        title={editingShowtime ? "Cập nhật suất chiếu" : "Tạo suất chiếu mới"}
        open={isModalOpen} onOk={handleFormSubmit} onCancel={() => setIsModalOpen(false)}
        okText={editingShowtime ? "Cập nhật" : "Tạo mới"} cancelText="Hủy bỏ" destroyOnHidden
        confirmLoading={isLoading}
      >
        <Form form={form} layout="vertical" className="mt-4">
          <Form.Item name="movieId" label="Chọn Phim" rules={[{ required: true, message: 'Vui lòng chọn phim!' }]}>
            <Select
              showSearch
              placeholder="Chọn phim cần chiếu..."
              options={movieOptions}
              loading={isMovieLoading}
              filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
            />
          </Form.Item>

          <Form.Item name="roomId" label="Chọn Phòng chiếu" rules={[{ required: true, message: 'Vui lòng chọn phòng!' }]}>
            <Select
              showSearch
              placeholder="Chọn phòng..."
              options={rooms}
              filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
            />
          </Form.Item>
          <Form.Item name="basePrice" label="Giá vé cơ bản (VNĐ)" rules={[{ required: true, message: 'Vui lòng nhập giá vé!' }]}>
            <InputNumber
              className="w-full"
              placeholder="Ví dụ: 95000"
              min={0}
              step={1000}
              formatter={(value: any) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={(value: any) => value!.replace(/\$\s?|(,*)/g, '')}
            />
          </Form.Item>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item name="startTime" label="Giờ bắt đầu" rules={[{ required: true, message: 'Vui lòng chọn giờ bắt đầu!' }]}>
              <DatePicker showTime format="YYYY-MM-DD HH:mm" className="w-full" placeholder="Chọn ngày giờ" />
            </Form.Item>

            <Form.Item name="endTime" label="Giờ kết thúc" rules={[{ required: true, message: 'Vui lòng chọn giờ kết thúc!' }]}>
              <DatePicker showTime format="YYYY-MM-DD HH:mm" className="w-full" placeholder="Chọn ngày giờ" />
            </Form.Item>
          </div>

          <Form.Item name="isActive" label="Trạng thái" rules={[{ required: true }]}>
            <Select options={[{ value: true, label: 'Đang mở bán' }, { value: false, label: 'Vô hiệu hóa' }]} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}