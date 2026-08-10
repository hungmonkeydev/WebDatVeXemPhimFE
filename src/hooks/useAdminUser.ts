import { useState, useCallback, useEffect } from 'react';
import { Form, message } from 'antd';
import { adminUserService } from '../services/adminUserService';

export interface UserType {
    userId: number;
    fullName: string;
    email: string;
    phone: string;
    role: string;
    gender: string;
    isActive: boolean;
    emailVerified: boolean;
    phoneVerified: boolean;
    birthDate?: string;
    membershipTierId?: number;
    deletedAt?: string;
}

export const useAdminUser = () => {
    const [users, setUsers] = useState<UserType[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalUsers, setTotalUsers] = useState(0);

    // Forms
    const [form] = Form.useForm();
    const [banForm] = Form.useForm();
    const [resetPasswordForm] = Form.useForm();

    // Modals state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<UserType | null>(null);

    const [isBanModalOpen, setIsBanModalOpen] = useState(false);
    const [banningUser, setBanningUser] = useState<UserType | null>(null);

    const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] = useState(false);
    const [resettingUser, setResettingUser] = useState<UserType | null>(null);

    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [userDetail, setUserDetail] = useState<any>(null);
    const [isFetchingDetail, setIsFetchingDetail] = useState(false);

    // Actions
    const fetchUsers = useCallback(async (page: number, size: number) => {
        setIsLoading(true);
        try {
            const res = await adminUserService.getUsers(page, size);
            if (res && res.data) {
                setUsers(res.data.content);
                setTotalUsers(res.data.totalElements);
            }
        } catch (error) {
            message.error("Lỗi khi tải danh sách người dùng!");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUsers(currentPage, pageSize);
    }, [currentPage, pageSize, fetchUsers]);

    const handleTableChange = (pagination: any) => {
        setCurrentPage(pagination.current);
        setPageSize(pagination.pageSize);
    };

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

    const handleFormSubmit = async () => {
        try {
            const values = await form.validateFields();

            if (editingUser) {
                const updatePayload = {
                    fullName: values.fullName,
                    email: values.email,
                    phone: values.phone,
                    gender: values.gender,
                    birthDate: values.birthDate ? values.birthDate : null,
                    isActive: values.isActive ?? true,
                    emailVerified: values.emailVerified ?? false,
                    phoneVerified: values.phoneVerified ?? false,
                    membershipTierId: values.membershipTierId
                };

                await adminUserService.updateUser(editingUser.userId, updatePayload);

                if (values.role !== editingUser.role) {
                    try {
                        await adminUserService.updateUserRole(editingUser.userId, { role: values.role });
                    } catch (roleError) {
                        console.error("Lỗi cập nhật Role:", roleError);
                        message.warning("Đã cập nhật thông tin, nhưng lỗi khi đổi Vai trò!");
                    }
                }

                message.success("Cập nhật thông tin thành công!");
            } else {
                const createPayload = { ...values };
                if (!createPayload.birthDate) createPayload.birthDate = null;

                await adminUserService.createUser(createPayload);
                message.success("Thêm tài khoản mới thành công!");
            }

            setIsModalOpen(false);
            fetchUsers(currentPage, pageSize);

        } catch (error: any) {
            console.log("Chi tiết lỗi:", error);
            const responseData = error.response?.data;

            if (responseData?.data && typeof responseData.data === 'object' && !Array.isArray(responseData.data)) {
                const backendErrors = responseData.data;
                form.setFields(
                    Object.keys(backendErrors).map((field) => ({
                        name: field,
                        errors: [backendErrors[field]],
                    }))
                );
            } else if (responseData?.message) {
                message.error(responseData.message);
            } else if (error.errorFields) {
                message.warning("Vui lòng điền đầy đủ các thông tin bắt buộc!");
            } else {
                message.error("Không thể kết nối đến máy chủ!");
            }
        }
    };

    const handleDelete = async (userId: number) => {
        try {
            await adminUserService.deleteUser(userId);
            message.success("Đã xóa người dùng thành công!");
            fetchUsers(currentPage, pageSize);
        } catch (error) {
            message.error("Xóa thất bại!");
        }
    };

    const showBanModal = (record: UserType) => {
        setBanningUser(record);
        setIsBanModalOpen(true);
    };

    const handleBanSubmit = async () => {
        try {
            const values = await banForm.validateFields();
            if (banningUser) {
                await adminUserService.banUser(banningUser.userId, {
                    reason: values.reason,
                    lockDurationHours: values.lockDurationHours
                });
                message.success(`Đã khóa tài khoản ${banningUser.fullName} thành công!`);
                setIsBanModalOpen(false);
                fetchUsers(currentPage, pageSize);
            }
        } catch (error: any) {
            message.error(error.response?.data?.message || "Lỗi khi khóa tài khoản!");
        }
    };

    const handleUnban = async (userId: number) => {
        try {
            await adminUserService.unBanUser(userId);
            message.success("Đã mở khóa tài khoản thành công!");
            fetchUsers(currentPage, pageSize);
        } catch (error: any) {
            message.error(error.response?.data?.message || "Mở khóa thất bại!");
        }
    };

    const showResetPasswordModal = (user: UserType) => {
        setResettingUser(user);
        setIsResetPasswordModalOpen(true);
        resetPasswordForm.resetFields();
    };

    const handleResetPassword = async () => {
        try {
            const values = await resetPasswordForm.validateFields();
            if (!resettingUser) return;
            await adminUserService.resetPassword(resettingUser.userId, { newPassword: values.newPassword });
            message.success('Đã reset mật khẩu thành công!');
            setIsResetPasswordModalOpen(false);
        } catch (error: any) {
            console.error('Lỗi khi reset mật khẩu:', error);
            message.error(error.response?.data?.message || 'Không thể reset mật khẩu lúc này! Đảm bảo mật khẩu đáp ứng yêu cầu.');
        }
    };

    const handleRestoreUser = async (userId: number) => {
        try {
            await adminUserService.restoreUser(userId);
            message.success('Đã khôi phục tài khoản thành công!');
            fetchUsers(currentPage, pageSize);
        } catch (error: any) {
            console.error('Lỗi khi khôi phục tài khoản:', error);
            message.error(error.response?.data?.message || 'Không thể khôi phục tài khoản!');
        }
    };

    const showDetailModal = async (userId: number) => {
        setIsDetailModalOpen(true);
        setIsFetchingDetail(true);
        try {
            const res = await adminUserService.getUserDetail(userId);
            setUserDetail(res.data.data);
        } catch (error) {
            message.error("Không thể lấy thông tin chi tiết!");
            setIsDetailModalOpen(false);
        } finally {
            setIsFetchingDetail(false);
        }
    };

    return {
        users, isLoading, currentPage, pageSize, totalUsers,
        form, banForm, resetPasswordForm,
        isModalOpen, setIsModalOpen, editingUser,
        isBanModalOpen, setIsBanModalOpen, banningUser,
        isResetPasswordModalOpen, setIsResetPasswordModalOpen, resettingUser,
        isDetailModalOpen, setIsDetailModalOpen, userDetail, isFetchingDetail,
        handleTableChange, showModal, handleFormSubmit, handleDelete,
        showBanModal, handleBanSubmit, handleUnban,
        showResetPasswordModal, handleResetPassword, handleRestoreUser, showDetailModal
    };
};
