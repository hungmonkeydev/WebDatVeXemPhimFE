import React from 'react';
import { Spin, Empty, Tag } from 'antd';
import { useLoyaltyHistory } from '../../Hooks/useLoyaltyHistory';

export default function LoyaltyHistory() {
    const { historyData, isLoading } = useLoyaltyHistory();

    if (isLoading) {
        return <div className="text-center py-10"><Spin tip="Đang tải lịch sử giao dịch..." /></div>;
    }

    if (!historyData || historyData.length === 0) {
        return <Empty description="Bạn chưa có lịch sử biến động điểm nào" className="py-10" />;
    }

    return (
        <div className="space-y-4">
            {historyData.map((item: any, index: number) => {
                const isEarn = item.pointsChange > 0 || item.pointsType === 'EARN';

                return (
                    <div key={index} className="bg-white border border-gray-100 rounded-lg p-4 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
                        <div className="flex flex-col gap-1">
                            <h4 className="font-semibold text-gray-800 text-[15px]">
                                {item.description || 'Giao dịch hệ thống'}
                            </h4>
                            <p className="text-[13px] text-gray-500">
                                {item.createdAt ? new Date(item.createdAt).toLocaleString('vi-VN') : 'Đang cập nhật'}
                            </p>
                        </div>

                        <div className={`text-lg font-bold flex items-center gap-1 ${isEarn ? 'text-green-600' : 'text-red-500'}`}>
                            {isEarn ? '+' : ''}{item.pointsChange}
                            <span className="text-[12px] font-normal text-gray-500 ml-1">Stars</span>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}