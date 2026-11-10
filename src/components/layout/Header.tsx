'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { RefreshCw, LogOut, Bug, Store, UserCheck, CheckCircle2, AlertTriangle } from 'lucide-react';
import DemoSwitchModal from './DemoSwitchModal';

export default function Header() {
  const router = useRouter();
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [activeDemoCount, setActiveDemoCount] = useState(0);
  const [resetSuccessMsg, setResetSuccessMsg] = useState(false);

  const checkDemoSwitches = () => {
    fetch('/api/system/demo-switches')
      .then((res) => res.json())
      .then((data) => {
        let count = 0;
        if (data.errorSave) count++;
        if (data.errorLoad) count++;
        if (data.errorPrinter) count++;
        setActiveDemoCount(count);
      })
      .catch(() => {});
  };

  useEffect(() => {
    checkDemoSwitches();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
    } catch {
      router.push('/login');
    }
  };

  const handleResetData = async () => {
    setResetting(true);
    try {
      const res = await fetch('/api/system/reset-data', { method: 'POST' });
      if (res.ok) {
        setShowResetConfirm(false);
        setResetSuccessMsg(true);
        setTimeout(() => {
          setResetSuccessMsg(false);
          window.location.reload();
        }, 1200);
      } else {
        alert('Khôi phục dữ liệu thất bại');
      }
    } catch {
      alert('Lỗi kết nối khi khôi phục dữ liệu mẫu');
    } finally {
      setResetting(false);
    }
  };

  return (
    <>
      <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-6 sticky top-0 z-30 shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-200">
            <Store className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-bold text-slate-800 text-lg leading-tight">
              TẠP HÓA QUỲNH NHƯ
            </h1>
            <p className="text-xs text-slate-500">Hệ thống quản lý bán hàng chuyên nghiệp</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {/* Demo Error Switch Button */}
          <button
            onClick={() => setShowDemoModal(true)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center space-x-1.5 border transition-all ${
              activeDemoCount > 0
                ? 'bg-amber-100 border-amber-300 text-amber-800 hover:bg-amber-200 animate-pulse'
                : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
            title="Công tắc kích hoạt các lỗi ngoại lệ để demo theo yêu cầu đặc tả"
          >
            <Bug className="w-4 h-4" />
            <span>Demo ngoại lệ</span>
            {activeDemoCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-amber-600 text-white flex items-center justify-center text-[10px] font-bold">
                {activeDemoCount}
              </span>
            )}
          </button>

          {/* Reset sample data button with confirmation dialog */}
          <button
            onClick={() => setShowResetConfirm(true)}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100 transition-all flex items-center space-x-1.5"
            title="Khôi phục lại toàn bộ dữ liệu mẫu ban đầu (sản phẩm, kho, khách hàng, hóa đơn)"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Khôi phục dữ liệu mẫu</span>
          </button>

          {/* User profile */}
          <div className="flex items-center space-x-2 pl-3 border-l border-slate-200">
            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-700">
              <UserCheck className="w-4 h-4" />
            </div>
            <div className="text-left hidden sm:block">
              <p className="text-xs font-semibold text-slate-800">Chủ cửa hàng</p>
              <p className="text-[10px] text-slate-500">chucuahang</p>
            </div>

            <button
              onClick={handleLogout}
              className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors ml-1"
              title="Đăng xuất khỏi hệ thống"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Confirmation Modal for Reset Sample Data */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6 space-y-4">
            <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="text-center">
              <h4 className="text-lg font-semibold text-slate-800">Khôi phục dữ liệu mẫu?</h4>
              <p className="text-sm text-slate-600 mt-1">
                Toàn bộ dữ liệu hiện tại sẽ được cài lại về trạng thái mẫu ban đầu (hạn sử dụng sẽ
                được tính lại từ thời điểm này). Bạn có chắc chắn muốn thực hiện?
              </p>
            </div>
            <div className="flex space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                disabled={resetting}
                className="flex-1 py-2 px-3 border border-slate-300 rounded-lg text-sm text-slate-700 hover:bg-slate-50 font-medium"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={handleResetData}
                disabled={resetting}
                className="flex-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium shadow-sm"
              >
                {resetting ? 'Đang khôi phục...' : 'Xác nhận'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reset success toast */}
      {resetSuccessMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white px-4 py-3 rounded-xl shadow-lg flex items-center space-x-2 animate-bounce">
          <CheckCircle2 className="w-5 h-5" />
          <span className="text-sm font-medium">Khôi phục dữ liệu mẫu thành công!</span>
        </div>
      )}

      {/* Demo Switch Modal */}
      <DemoSwitchModal
        isOpen={showDemoModal}
        onClose={() => setShowDemoModal(false)}
        onUpdated={checkDemoSwitches}
      />
    </>
  );
}
