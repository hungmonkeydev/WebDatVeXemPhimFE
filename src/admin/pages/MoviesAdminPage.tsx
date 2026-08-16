import React, { useState, useEffect } from 'react';
import {
  Table, Button, Space, Tag, Input, Form, Modal, Popconfirm,
  message, Tooltip, DatePicker, InputNumber, Select
} from 'antd';
import { SearchOutlined, EditOutlined, DeleteOutlined, PlusOutlined, UndoOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { useAdminMovies } from '../../Hooks/useAdminMovie';
export default function MovieManage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const {
    movies, totalMovies, isLoading,
    fetchMovies, createMovie, updateMovie, deleteMovie, fetchCastAndCrew, actors, directors, genres, restoreMovie
  } = useAdminMovies();

  // State Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMovie, setEditingMovie] = useState<any | null>(null);
  const [form] = Form.useForm();
  
  // State Restore Modal
  const [isRestoreModalOpen, setIsRestoreModalOpen] = useState(false);
  const [restoreId, setRestoreId] = useState<number | null>(null);

  // Search Filters
  const [keyword, setKeyword] = useState('');
  const [selectedGenreIds, setSelectedGenreIds] = useState<number[]>([]);
  const [selectedAgeRating, setSelectedAgeRating] = useState<string | null>(null);

  // Load data
  useEffect(() => {
    fetchMovies(currentPage, pageSize, { keyword, genreIds: selectedGenreIds, ageRating: selectedAgeRating });
    fetchCastAndCrew();
  }, [currentPage, pageSize, fetchMovies, fetchCastAndCrew, keyword, selectedGenreIds, selectedAgeRating]);


  const handleTableChange = (pagination: any) => {
    setCurrentPage(pagination.current);
    setPageSize(pagination.pageSize);
  };

  const showModal = (record?: any) => {
    if (record) {
      setEditingMovie(record);
      form.setFieldsValue({
        ...record,
        releaseDate: record.releaseDate ? dayjs(record.releaseDate) : null,
        endDate: record.endDate ? dayjs(record.endDate) : null,
        directorIds: record.directors?.map((d: any) => d.directorId || d.id) || [],
        actorIds: record.actors?.map((a: any) => a.actorId || a.id) || [],
        genreIds: record.genres?.map((g: any) => g.genreId || g.id) || [],
      });
    } else {
      setEditingMovie(null);
      form.resetFields();
    }
    setIsModalOpen(true);
  };

  // Xử lý Submit
  const handleFormSubmit = async () => {
    try {
      const values = await form.validateFields();

      const payload = {
        ...values,
        releaseDate: values.releaseDate ? values.releaseDate.format('YYYY-MM-DD') : null,
        endDate: values.endDate ? values.endDate.format('YYYY-MM-DD') : null,
      };

      let result;
      if (editingMovie) {
        result = await updateMovie(editingMovie.movieId, payload);
      } else {
        result = await createMovie(payload);
      }

      if (result.success) {
        message.success(result.message);
        setIsModalOpen(false);
        fetchMovies(currentPage, pageSize, { keyword, genreIds: selectedGenreIds, ageRating: selectedAgeRating });
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

  const handleDelete = async (movieId: number) => {
    const result = await deleteMovie(movieId);
    if (result.success) {
      message.success(result.message);
      fetchMovies(currentPage, pageSize, { keyword, genreIds: selectedGenreIds, ageRating: selectedAgeRating });
    } else {
      message.error(result.message);
    }
  };

  const handleRestore = async (movieId: number) => {
    const result = await restoreMovie(movieId);
    if (result.success) {
      message.success(result.message);
      fetchMovies(currentPage, pageSize, { keyword, genreIds: selectedGenreIds, ageRating: selectedAgeRating });
    } else {
      message.error(result.message);
    }
  };

  const columns = [
    { title: 'ID', dataIndex: 'movieId', key: 'movieId', width: 70 },
    {
      title: 'Tên Phim',
      dataIndex: 'title',
      key: 'title',
      render: (text: string) => <div className="font-semibold text-gray-800">{text}</div>,
    },
    {
      title: 'Đạo diễn',
      dataIndex: 'directors',
      key: 'directors',
      render: (directors: any[]) => {
        if (!directors || directors.length === 0) return <span className="text-gray-400">Chưa có</span>;
        return directors.map(d => d.name).join(', ');
      }
    },
    {
      title: 'Thể loại',
      dataIndex: 'genres',
      key: 'genres',
      render: (genres: any[]) => {
        if (!genres || genres.length === 0) return <span className="text-gray-400">Chưa có</span>;
        return (
          <div className="flex flex-wrap gap-1">
            {genres.map(g => <Tag color="blue" key={g.genreId || g.id}>{g.name}</Tag>)}
          </div>
        );
      }
    },
    {
      title: 'Độ tuổi',
      dataIndex: 'ageRating',
      key: 'ageRating',
      width: 90,
      render: (rating: string) => {
        if (!rating) return <span className="text-gray-400">N/A</span>;
        return <Tag color={rating === 'P' ? 'green' : rating === 'C13' ? 'orange' : 'red'}>{rating}</Tag>;
      }
    },
    {
      title: 'Thời lượng',
      dataIndex: 'duration',
      key: 'duration',
      render: (duration: number) => `${duration} phút`,
    },
    {
      title: 'Ngày khởi chiếu',
      dataIndex: 'releaseDate',
      key: 'releaseDate',
      render: (date: string) => <div className="text-blue-600 font-medium">{date ? dayjs(date).format('DD/MM/YYYY') : 'Đang cập nhật'}</div>,
    },
    {
      title: 'Hành động', key: 'action', width: 120,
      render: (_: any, record: any) => (
        <Space size="middle">
          <Tooltip title="Chỉnh sửa">
            <Button type="text" icon={<EditOutlined className="text-blue-500" />} onClick={() => showModal(record)} />
          </Tooltip>
          <Popconfirm
            title="Xóa phim này?"
            description={`Bạn có chắc chắn muốn xóa "${record.title}"?`}
            onConfirm={() => handleDelete(record.movieId)}
            okText="Xóa" cancelText="Hủy" okButtonProps={{ danger: true }}
          >
            <Tooltip title="Xóa phim">
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
          <h2 className="text-xl font-bold text-gray-800">Quản lý Phim</h2>
          <p className="text-gray-500 text-sm">Thêm, sửa, xóa danh sách phim trên hệ thống</p>
        </div>
        <div className="flex gap-4">
          <Input.Search 
            placeholder="Tìm tên phim..." 
            className="w-48" 
            allowClear 
            onSearch={(val) => setKeyword(val)}
          />
          <Select 
            mode="multiple" 
            allowClear 
            placeholder="Lọc thể loại" 
            className="w-64"
            popupMatchSelectWidth={false}
            value={selectedGenreIds}
            onChange={(val) => setSelectedGenreIds(val)}
            options={(genres || []).map((g: any) => ({ value: g.genreId || g.id, label: g.name }))}
            maxTagCount="responsive"
          />
          <Select 
            allowClear 
            placeholder="Độ tuổi" 
            className="w-32"
            popupMatchSelectWidth={false}
            value={selectedAgeRating}
            onChange={(val) => setSelectedAgeRating(val)}
            options={[
              { value: 'P', label: 'Phim mọi lứa tuổi' },
              { value: 'C13', label: 'Phim từ 13+' },
              { value: 'C16', label: 'Phim từ 16+' },
              { value: 'C18', label: 'Phim từ 18+' },
            ]}
          />
          <Button icon={<UndoOutlined />} onClick={() => setIsRestoreModalOpen(true)} className="border-green-500 text-green-500 hover:text-green-600 hover:border-green-600">
            Khôi Phục Bằng ID
          </Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => showModal()} className="bg-blue-600">
            Thêm Phim Mới
          </Button>
        </div>
      </div>

      <Table
        columns={columns} dataSource={movies} rowKey="movieId" loading={isLoading}
        onChange={handleTableChange}
        pagination={{
          current: currentPage, pageSize: pageSize, total: totalMovies,
          showSizeChanger: true, showTotal: (total) => `Tổng ${total} bộ phim`,
        }}
        bordered
      />

      <Modal
        title={editingMovie ? "Cập nhật thông tin phim" : "Thêm phim mới"}
        open={isModalOpen} onOk={handleFormSubmit} onCancel={() => setIsModalOpen(false)}
        okText={editingMovie ? "Cập nhật" : "Tạo mới"} cancelText="Hủy bỏ" destroyOnHidden
        confirmLoading={isLoading}
        width={700}
      >
        <Form form={form} layout="vertical" className="mt-4">
          <Form.Item name="title" label="Tên phim" rules={[{ required: true, message: 'Vui lòng nhập tên phim!' }]}>
            <Input placeholder="Nhập tên phim..." />
          </Form.Item>

          {/* DÒNG 1: Đạo diễn & Diễn viên */}
          <div className="grid grid-cols-2 gap-4">
            <Form.Item name="directorIds" label="Đạo diễn" rules={[{ required: true, message: 'Vui lòng chọn đạo diễn!' }]}>
              <Select mode="multiple" allowClear showSearch placeholder="Chọn các đạo diễn..."
                options={(directors || []).map((d: any) => ({ value: d.directorId || d.id, label: d.name }))}
                filterOption={(input: string, option: any) => String(option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
              />
            </Form.Item>

            <Form.Item name="actorIds" label="Diễn viên">
              <Select mode="multiple" allowClear showSearch placeholder="Chọn các diễn viên..."
                options={(actors || []).map((a: any) => ({ value: a.actorId || a.id, label: a.name }))}
                filterOption={(input: string, option: any) => String(option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
              />
            </Form.Item>
          </div>

          {/* DÒNG 2: Thể loại & Nhà sản xuất */}
          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              name="genreIds"
              label="Thể loại"
              rules={[{ required: true, message: 'Vui lòng chọn thể loại!' }]}
            >
              <Select
                mode="multiple" allowClear showSearch placeholder="Chọn các thể loại..."
                options={(genres || []).map((g: any) => ({
                  value: g.genreId,
                  label: g.name
                }))}
                filterOption={(input: string, option: any) =>
                  String(option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                }
              />
            </Form.Item>

            <Form.Item name="producer" label="Nhà sản xuất">
              <Input placeholder="Ví dụ: Marvel Studios, Trấn Thành Town..." />
            </Form.Item>
          </div>

          {/* DÒNG 3: Thời lượng & Trạng thái */}
          <div className="grid grid-cols-2 gap-4">
            <Form.Item name="duration" label="Thời lượng (Phút)" rules={[{ required: true, message: 'Vui lòng nhập thời lượng!' }]}>
              <InputNumber className="w-full" min={1} placeholder="Ví dụ: 120" />
            </Form.Item>

            <Form.Item name="status" label="Trạng thái" rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}>
              <Select placeholder="Chọn trạng thái...">
                <Select.Option value="COMING_SOON">Sắp chiếu</Select.Option>
                <Select.Option value="NOW_SHOWING">Đang chiếu</Select.Option>
                <Select.Option value="ENDED">Ngưng chiếu</Select.Option>
              </Select>
            </Form.Item>
          </div>

          {/* DÒNG 4: Ngày chiếu & Ngày kết thúc */}
          <div className="grid grid-cols-2 gap-4">
            <Form.Item name="releaseDate" label="Ngày khởi chiếu" rules={[{ required: true, message: 'Vui lòng chọn ngày chiếu!' }]}>
              <DatePicker 
                format="YYYY-MM-DD" 
                className="w-full" 
                placeholder="Chọn ngày khởi chiếu" 
                //disabledDate={(current) => current && current < dayjs().startOf('day')}
              />
            </Form.Item>

            <Form.Item name="endDate" label="Ngày kết thúc chiếu" rules={[{ required: true, message: 'Vui lòng chọn ngày kết thúc!' }]}>
              <DatePicker 
                format="YYYY-MM-DD" 
                className="w-full" 
                placeholder="Chọn ngày kết thúc" 
                //disabledDate={(current) => current && current < dayjs().startOf('day')}
              />
            </Form.Item>
          </div>

          {/* DÒNG 5: Phân loại tuổi & Ngôn ngữ */}
          <div className="grid grid-cols-2 gap-4">
            <Form.Item name="ageRating" label="Phân loại tuổi" rules={[{ required: true, message: 'Chọn phân loại!' }]}>
              <Select placeholder="Chọn độ tuổi...">
                <Select.Option value="P">P - Phổ biến, mọi lứa tuổi</Select.Option>
                <Select.Option value="C13">C13 - Từ 13 tuổi trở lên</Select.Option>
                <Select.Option value="C16">C16 - Từ 16 tuổi trở lên</Select.Option>
                <Select.Option value="C18">C18 - Từ 18 tuổi trở lên</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item name="language" label="Ngôn ngữ gốc">
              <Input placeholder="Ví dụ: Tiếng Anh, Tiếng Hàn..." />
            </Form.Item>
          </div>

          {/* DÒNG 6: Phụ đề & Trailer */}
          <div className="grid grid-cols-2 gap-4">
            <Form.Item name="subtitle" label="Phụ đề / Lồng tiếng">
              <Input placeholder="Ví dụ: Phụ đề Tiếng Việt" />
            </Form.Item>

            <Form.Item name="trailerUrl" label="Link Trailer (Youtube)">
              <Input placeholder="Nhập đường dẫn Youtube..." />
            </Form.Item>
          </div>

          {/* DÒNG 7: Poster & Banner */}
          <div className="grid grid-cols-2 gap-4">
            <Form.Item name="posterUrl" label="Link Poster (Ảnh dọc)">
              <Input placeholder="Nhập đường dẫn ảnh poster..." />
            </Form.Item>

            <Form.Item name="bannerUrl" label="Link Banner (Ảnh ngang)">
              <Input placeholder="Nhập đường dẫn ảnh banner..." />
            </Form.Item>
          </div>

          <Form.Item name="description" label="Nội dung mô tả">
            <Input.TextArea rows={4} placeholder="Tóm tắt nội dung phim..." />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Khôi phục phim bằng ID"
        open={isRestoreModalOpen}
        onOk={async () => {
          if (!restoreId) {
            message.warning("Vui lòng nhập ID phim cần khôi phục!");
            return;
          }
          await handleRestore(restoreId);
          setIsRestoreModalOpen(false);
          setRestoreId(null);
        }}
        onCancel={() => {
          setIsRestoreModalOpen(false);
          setRestoreId(null);
        }}
        okText="Khôi phục"
        cancelText="Hủy bỏ"
        okButtonProps={{ className: 'bg-green-500 hover:bg-green-600 border-none' }}
        destroyOnClose
      >
        <p className="mb-2 text-gray-600">Nhập ID của bộ phim đã xóa để khôi phục lại lên hệ thống:</p>
        <InputNumber 
          className="w-full mt-2" 
          placeholder="Ví dụ: 1" 
          value={restoreId}
          onChange={(val) => setRestoreId(val as number)}
          min={1}
          autoFocus
        />
      </Modal>
    </div>
  );
}