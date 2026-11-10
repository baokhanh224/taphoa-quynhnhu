'use client';

import React, { useState, useEffect } from 'react';
import { AlertTriangle, X, Check, Bug } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onUpdated?: () => void;
}

export default function DemoSwitchModal({ isOpen, onClose, onUpdated }: Props) {
  const [switches, setSwitches] = useState({
    errorSave: false,
    errorLoad: false,
    errorPrinter: false,
  });
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetch('/api/system/demo-switches')
        .then((res) => res.json())
        .then((data) => setSwitches(data))
        .catch(() => {});
    }
  }, [isOpen]);

  const handleToggle = (key: keyof typeof switches) => {
    setSwitches((prev) => ({ ...prev, [key]: !prev[key] }));
    setSaved(false);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await fetch('/api/system/demo-switches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(switches),
      });
      setSaved(true);
      if (onUpdated) onUpdated();
      setTimeout(() => {
        onClose();
      }, 600);
    } catch {
      alert('Không thể lưu cài đặt công tắc demo');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200">
        <div className="bg-amber-600 px-6 py-4 flex items-center justify-between text-white">
          <div className="flex items-center space-x-2">
            <Bug className="w-6 h-6" />
            <h3 className="font-semibold text-lg">Công tắc mô phỏng lỗi demo</h3>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <p className="text-sm text-slate-600">
            Dùng để trình diễn và kiểm thử các kịch bản ngoại lệ cho giảng viên và người đánh giá
            theo đúng đặc tả yêu cầu:
          </p>

          <div className="space-y-3">
            {/* Lỗi lưu CSDL */}
            <label className="flex items-start space-x-3 p-3 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer">
              <input
                type="checkbox"
                checked={switches.errorSave}
                onChange={() => handleToggle('errorSave')}
                className="mt-1 w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
              />
              <div className="flex-1">
                <span className="font-medium text-slate-800 text-sm block">
                  1. Giả lập lỗi lưu CSDL (DB Save Error)
                </span>
                <span className="text-xs text-slate-500">
                  Kích hoạt ngoại lệ lưu thất bại: UC4.1 (8a: "Không thể lưu phiếu nhập"), UC4.2 (8a:
                  "Không thể lưu phiếu điều chỉnh"), UC6.1 (10a: "Không thể lưu giao dịch. Hãy thử
                  lại"), UC6.3 (7a: "Không thể hủy hóa đơn"), UC6.5 (10a: "Không thể lưu phiếu
                  đổi/trả").
                </span>
              </div>
            </label>

            {/* Lỗi tải dữ liệu */}
            <label className="flex items-start space-x-3 p-3 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer">
              <input
                type="checkbox"
                checked={switches.errorLoad}
                onChange={() => handleToggle('errorLoad')}
                className="mt-1 w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
              />
              <div className="flex-1">
                <span className="font-medium text-slate-800 text-sm block">
                  2. Giả lập lỗi tải dữ liệu (Data Load Error)
                </span>
                <span className="text-xs text-slate-500">
                  Kích hoạt ngoại lệ tải thất bại: UC3.1/3.2 ("Không thể tải báo cáo. Vui lòng thử
                  lại"), UC4.3 ("Không thể tải dữ liệu tồn kho"), UC4.4 ("Không thể tải lịch sử nhập
                  hàng"), UC6.4 ("Không thể tải lịch sử bán hàng").
                </span>
              </div>
            </label>

            {/* Lỗi máy in */}
            <label className="flex items-start space-x-3 p-3 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer">
              <input
                type="checkbox"
                checked={switches.errorPrinter}
                onChange={() => handleToggle('errorPrinter')}
                className="mt-1 w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
              />
              <div className="flex-1">
                <span className="font-medium text-slate-800 text-sm block">
                  3. Giả lập lỗi máy in hóa đơn (Printer Error)
                </span>
                <span className="text-xs text-slate-500">
                  Kích hoạt ngoại lệ UC6.2 (5a: "Không thể kết nối hoặc gửi yêu cầu đến máy in").
                </span>
              </div>
            </label>
          </div>

          {saved && (
            <div className="p-2 bg-emerald-50 border border-emerald-200 rounded text-emerald-700 text-xs flex items-center space-x-1">
              <Check className="w-4 h-4" />
              <span>Đã lưu trạng thái công tắc demo thành công!</span>
            </div>
          )}
        </div>

        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-slate-300 rounded-lg text-sm text-slate-700 hover:bg-slate-100"
          >
            Đóng
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={loading}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium shadow-sm"
          >
            {loading ? 'Đang lưu...' : 'Áp dụng'}
          </button>
        </div>
      </div>
    </div>
  );
}
