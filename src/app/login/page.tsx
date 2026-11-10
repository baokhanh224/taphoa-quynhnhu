'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Store, Lock, User, AlertCircle, KeyRound } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [tenDangNhap, setTenDangNhap] = useState('');
  const [matKhau, setMatKhau] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!tenDangNhap || !matKhau) {
      setError('Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu!');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tenDangNhap, matKhau }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Đăng nhập không thành công');
      } else {
        // Requirement 3.1: Đăng nhập xong mở "Tạo giao dịch bán hàng"
        router.push('/pos');
      }
    } catch {
      setError('Lỗi kết nối máy chủ, vui lòng thử lại');
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemo = () => {
    setTenDangNhap('chucuahang');
    setMatKhau('QuynhNhu@2026');
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-slate-50 to-emerald-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200/80 max-w-md w-full p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-emerald-600 rounded-2xl flex items-center justify-center text-white mx-auto shadow-lg shadow-emerald-200">
            <Store className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
            TẠP HÓA QUỲNH NHƯ
          </h2>
          <p className="text-sm text-slate-500">
            Hệ thống quản lý bán hàng & kiểm soát kho hàng
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center space-x-2 text-red-700 text-sm">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              Tên đăng nhập
            </label>
            <div className="relative">
              <User className="w-5 h-5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={tenDangNhap}
                onChange={(e) => setTenDangNhap(e.target.value)}
                placeholder="Nhập tên đăng nhập"
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              Mật khẩu
            </label>
            <div className="relative">
              <Lock className="w-5 h-5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="password"
                value={matKhau}
                onChange={(e) => setMatKhau(e.target.value)}
                placeholder="Nhập mật khẩu"
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-sm shadow-md shadow-emerald-200 transition-all"
          >
            {loading ? 'Đang xác thực...' : 'Đăng nhập vào hệ thống'}
          </button>
        </form>

        {/* Test account info */}
        <div className="pt-4 border-t border-slate-100 bg-slate-50 -mx-8 -mb-8 p-6 rounded-b-2xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-600 flex items-center space-x-1">
              <KeyRound className="w-3.5 h-3.5 text-emerald-600" />
              <span>Tài khoản kiểm tra (Đánh giá & Chấm điểm):</span>
            </span>
            <button
              type="button"
              onClick={handleFillDemo}
              className="text-xs text-emerald-600 hover:text-emerald-700 font-semibold underline"
            >
              Điền nhanh
            </button>
          </div>
          <div className="bg-white p-2.5 rounded-lg border border-slate-200 text-xs text-slate-600 font-mono space-y-1">
            <p>
              Tên đăng nhập: <strong className="text-slate-800">chucuahang</strong>
            </p>
            <p>
              Mật khẩu: <strong className="text-slate-800">QuynhNhu@2026</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
