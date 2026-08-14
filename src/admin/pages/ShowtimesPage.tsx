import React, { useState, useEffect } from 'react';
import {
  Table, Button, Space, Tag, Input, Form, Modal, Select, Popconfirm,
  message, Tooltip, DatePicker, InputNumber, Radio
} from 'antd';
import { SearchOutlined, EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
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

const getShowtimeStatus = (record: any) => {
  if (!record.isActive) return 'DISABLED';
  const now = dayjs();
  const startTime = dayjs(record.startTime);
  if (startTime.isBefore(now)) return 'PAST';
  if (startTime.diff(now, 'day') <= 1) return 'UPCOMING';
  return 'OPEN';
};

export default function ShowtimeManage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [viewMode, setViewMode] = useState<'table' | 'weekly'>('table'); // Thêm state chuyển đổi giao diện

  const {
    showtimes = [], totalShowtimes, isLoading,
    fetchShowtimes, createShowtime, updateShowtime, deleteShowtime
  } = useAdminShowtimes();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingShowtime, setEditingShowtime] = useState<ShowtimeType | null>(null);
  const [form] = Form.useForm();

  const [movieOptions, setMovieOptions] = useState<any[]>([]);
  const [isMovieLoading, setIsMovieLoading] = useState(false);
  const [rooms, setRooms] = useState([
    { value: 1, label: 'Phòng 1 - Cinema Q10' },
    { value: 2, label: 'Phòng 2 - Cinema Q10' }
  ]);

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
    if (showtimes && showtimes.length > 0) {
      const uniqueRooms = Array.from(
        new Map(
          showtimes
            .filter((s: any) => s.room && s.cinema) // Đảm bảo không bị lỗi nếu thiếu data
            .map((s: any) => [
              s.room.roomId,
              {
                value: s.room.roomId,
                label: `${s.cinema.name} - ${s.room.roomName}`,
              },
            ])
        ).values()
      );
      if (uniqueRooms.length > 0) {
        setRooms(uniqueRooms);
      }
    }
  }, [showtimes]);


  const [filterDate, setFilterDate] = useState<string | null>(null);
  const [filterMovieId, setFilterMovieId] = useState<number | null>(null);
  const [filterStatus, setFilterStatus] = useState<string | null>(null); // State mới cho bộ lọc trạng thái

  useEffect(() => {
    fetchShowtimes(currentPage, pageSize, { date: filterDate, movieId: filterMovieId });
  }, [currentPage, pageSize, fetchShowtimes, filterDate, filterMovieId]);

  // Client-side filtering cho Trạng thái
  const filteredShowtimes = showtimes.filter((item: any) => {
    if (!filterStatus) return true;
    return getShowtimeStatus(item) === filterStatus;
  });

  const handleTableChange = (pagination: any) => {
    setCurrentPage(pagination.current);
    setPageSize(pagination.pageSize);
  };

  // XỬ LÝ MỞ MODAL THÊM/SỬA
  const showModal = (record?: any) => {
    if (record) {
      setEditingShowtime(record);

      form.setFieldsValue({
        ...record,
        movieId: record.movie?.movieId,
        roomId: record.room?.roomId,
        startTime: record.startTime ? dayjs(record.startTime) : null,
        endTime: record.endTime ? dayjs(record.endTime) : null,
        status: getShowtimeStatus(record)
      });
    } else {
      setEditingShowtime(null);
      form.resetFields();
      form.setFieldsValue({ status: 'OPEN' });
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
        isActive: values.status !== 'DISABLED',
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
        fetchShowtimes(currentPage, pageSize, { date: filterDate, movieId: filterMovieId });
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
      fetchShowtimes(currentPage, pageSize, { date: filterDate, movieId: filterMovieId });
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
      render: (_: any, record: any) => {
        const status = getShowtimeStatus(record);
        if (status === 'DISABLED') return <Tag color="error" className="font-bold">VÔ HIỆU HÓA</Tag>;
        if (status === 'PAST') return <Tag color="default" className="font-bold">ĐÃ CHIẾU</Tag>;
        if (status === 'UPCOMING') return <Tag color="warning" className="font-bold">SẮP CHIẾU</Tag>;
        return <Tag color="success" className="font-bold">ĐANG MỞ</Tag>;
      },
    },
    {
      title: 'Hành động', key: 'action', width: 120,
      render: (_: any, record: any) => {
        const isPast = dayjs().isAfter(dayjs(record.startTime));
        return (
          <Space size="middle">
            <Tooltip title={isPast ? "Không thể sửa suất chiếu trong quá khứ" : "Chỉnh sửa"}>
              <Button type="text" icon={<EditOutlined className={isPast ? "text-gray-400" : "text-blue-500"} />} onClick={() => showModal(record)} disabled={isPast} />
            </Tooltip>

            <Popconfirm
              title="Cảnh báo"
              description={`Bạn có chắc chắn muốn xóa suất chiếu này?`}
              onConfirm={() => handleDelete(record.showtimeId)}
              okText="Xóa" cancelText="Hủy" okButtonProps={{ danger: true }}
              disabled={isPast}
            >
              <Tooltip title={isPast ? "Không thể xóa suất chiếu trong quá khứ" : "Xóa suất chiếu"}>
                <Button type="text" danger icon={<DeleteOutlined />} disabled={isPast} />
              </Tooltip>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  // ==========================================
  // XỬ LÝ NHÓM DỮ LIỆU VÀ VẼ LỊCH CỘT
  // ==========================================
  const groupedShowtimes = filteredShowtimes.reduce((group: any, showtime: any) => {
    if (!showtime.startTime) return group;
    const dateKey = dayjs(showtime.startTime).format('YYYY-MM-DD');
    if (!group[dateKey]) {
      group[dateKey] = [];
    }
    group[dateKey].push(showtime);
    return group;
  }, {});

  const sortedDates = Object.keys(groupedShowtimes).sort();

  const renderWeeklyView = () => (
    <div className="flex gap-4 overflow-x-auto pb-4 snap-x">
      {sortedDates.length === 0 ? (
        <div className="text-center w-full py-10 text-gray-500 border-2 border-dashed rounded-lg">
          Không có dữ liệu suất chiếu. (Thử tăng số dòng hiển thị để lấy thêm dữ liệu)
        </div>
      ) : (
        sortedDates.map((date) => (
          <div key={date} className="min-w-[280px] bg-gray-50/50 border border-gray-200 rounded-xl p-4 snap-start shrink-0">
            {/* Tiêu đề Cột Ngày */}
            <div className="font-extrabold text-[16px] text-blue-700 mb-4 border-b-2 border-blue-200 pb-2 flex justify-between items-center">
              {/* Dùng mảng để dịch số (0-6) sang thứ trong tiếng Việt */}
              <span>
                {['Chủ Nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'][dayjs(date).day()]},{' '}
                {dayjs(date).format('DD/MM/YYYY')}
              </span>
              <Tag color="blue">{groupedShowtimes[date].length} suất</Tag>
            </div>

            {/* Danh sách suất chiếu trong ngày */}
            <div className="flex flex-col gap-3 max-h-[600px] overflow-y-auto scrollbar-hide pr-1">
              {groupedShowtimes[date].map((item: any) => (
                <div
                  key={item.showtimeId}
                  className={`relative group bg-white p-3 rounded-lg shadow-sm border-l-4 transition-all hover:shadow-md ${item.isActive ? 'border-green-500' : 'border-red-400 opacity-60'}`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <p className="font-bold text-gray-800 text-[15px]">
                      {dayjs(item.startTime).format('HH:mm')} - {dayjs(item.endTime).format('HH:mm')}
                    </p>
                  </div>

                  <p className="text-[14px] font-semibold text-blue-600 line-clamp-1">{item.movie?.title}</p>
                  <p className="text-[12px] text-gray-500 mt-1 flex items-center gap-1">
                    {item.cinema?.name} - {item.room?.roomName}
                  </p>

                  {/* Trạng thái trong lịch */}
                  {!item.isActive ? (
                    <span className="text-[10px] text-red-500 font-bold mt-1 block">VÔ HIỆU HÓA</span>
                  ) : dayjs(item.startTime).isBefore(dayjs()) ? (
                    <span className="text-[10px] text-gray-500 font-bold mt-1 block">ĐÃ CHIẾU</span>
                  ) : dayjs(item.startTime).diff(dayjs(), 'day') <= 1 ? (
                    <span className="text-[10px] text-orange-500 font-bold mt-1 block">SẮP CHIẾU</span>
                  ) : (
                    <span className="text-[10px] text-green-500 font-bold mt-1 block">ĐANG MỞ</span>
                  )}

                  {/* NÚT CRUD - Chỉ hiện khi hover */}
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2 bg-white/90 px-1 rounded shadow-sm">
                    {!dayjs(item.startTime).isBefore(dayjs()) ? (
                      <>
                        <Tooltip title="Sửa">
                          <EditOutlined className="text-blue-500 cursor-pointer text-lg hover:scale-110" onClick={() => showModal(item)} />
                        </Tooltip>
                        <Popconfirm title="Xóa suất chiếu này?" onConfirm={() => handleDelete(item.showtimeId)} okButtonProps={{ danger: true }}>
                          <Tooltip title="Xóa">
                            <DeleteOutlined className="text-red-500 cursor-pointer text-lg hover:scale-110" />
                          </Tooltip>
                        </Popconfirm>
                      </>
                    ) : (
                      <Tooltip title="Đã chiếu, không thể sửa xóa">
                        <EditOutlined className="text-gray-300 cursor-not-allowed text-lg" />
                      </Tooltip>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Quản lý Suất chiếu</h2>
          <p className="text-gray-500 text-sm">Điều phối lịch chiếu phim tại các rạp</p>
        </div>
        <div className="flex gap-4 items-center">

          {/* NÚT CHUYỂN ĐỔI CHẾ ĐỘ XEM */}
          <Radio.Group
            value={viewMode}
            onChange={(e) => setViewMode(e.target.value)}
            buttonStyle="solid"
            className="whitespace-nowrap shrink-0"
          >
            <Radio.Button value="table">Dạng Bảng</Radio.Button>
            <Radio.Button value="weekly">Dạng Lịch</Radio.Button>
          </Radio.Group>

          <DatePicker 
            placeholder="Lọc theo ngày" 
            format="DD/MM/YYYY" 
            className="w-40"
            onChange={(val) => setFilterDate(val ? val.format('YYYY-MM-DD') : null)} 
          />
          <Select
            placeholder="Lọc theo phim"
            allowClear
            showSearch
            popupMatchSelectWidth={false}
            className="w-48"
            options={movieOptions}
            onChange={(val) => setFilterMovieId(val)}
            filterOption={(input, option) =>
              (option?.label ?? '').toString().toLowerCase().includes(input.toLowerCase())
            }
          />
          <Select
            placeholder="Trạng thái"
            allowClear
            className="w-32"
            onChange={(val) => setFilterStatus(val)}
            options={[
              { value: 'OPEN', label: 'Đang mở' },
              { value: 'UPCOMING', label: 'Sắp chiếu' },
              { value: 'PAST', label: 'Đã chiếu' },
              { value: 'DISABLED', label: 'Vô hiệu hóa' },
            ]}
          />
          <Button type="primary" icon={<PlusOutlined />} onClick={() => showModal()} className="bg-blue-600">
            Thêm Suất Chiếu
          </Button>
        </div>
      </div>

      {/* RENDER DỰA THEO CHẾ ĐỘ XEM */}
      {viewMode === 'table' ? (
        <Table
          columns={columns} dataSource={filteredShowtimes} rowKey="showtimeId" loading={isLoading}
          onChange={handleTableChange}
          pagination={{
            current: currentPage, pageSize: pageSize, total: filteredShowtimes.length,
            showSizeChanger: true, showTotal: (total) => `Tổng ${total} suất chiếu`,
          }}
          bordered
        />
      ) : (
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          {renderWeeklyView()}

          {/* Thêm thanh phân trang cho Lịch để có thể lật trang dữ liệu */}
          <div className="mt-4 flex justify-end">
            <Table
              pagination={{
                current: currentPage, pageSize: pageSize, total: filteredShowtimes.length,
                showSizeChanger: true, showTotal: (total) => `Tổng ${total} suất chiếu`,
                onChange: (page, size) => handleTableChange({ current: page, pageSize: size })
              }}
              dataSource={[]} // Ẩn dữ liệu bảng đi, chỉ lấy cái thanh pagination
              className="[&_.ant-table]:hidden" // Class ẩn cái bảng
            />
          </div>
        </div>
      )}

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

            <Form.Item name="endTime" label="Giờ kết thúc">
              <DatePicker showTime format="YYYY-MM-DD HH:mm" className="w-full" placeholder="Để trống sẽ tự tính (Phim + 15p)" />
            </Form.Item>
          </div>

          <Form.Item name="status" label="Trạng thái" rules={[{ required: true }]}>
            <Select options={[
              { value: 'OPEN', label: 'Đang mở' },
              { value: 'UPCOMING', label: 'Sắp chiếu' },
              { value: 'PAST', label: 'Đã chiếu' },
              { value: 'DISABLED', label: 'Vô hiệu hóa' }
            ]} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}