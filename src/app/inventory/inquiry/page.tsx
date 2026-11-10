'use client';

import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import {
  AlertCircle,
  Search,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Package,
  Layers,
  ChevronDown,
  ChevronUp,
  RefreshCw,
} from 'lucide-react';
import { formatDate } from '@/lib/formatters';

export default function InventoryInquiryPage() {
  const [filter, setFilter] = useState<'all' | 'low_stock' | 'near_expiry' | 'expired'>('all');
  const [keyword, setKeyword] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [expandedProduct, setExpandedProduct] = useState<string | null>(null);

  // Stats across whole inventory
  const [stats, setStats] = useState({
    totalItems: 0,
    lowStockCount: 0,
    nearExpiryCount: 0,
    expiredCount: 0,
  });

  const fetchStats = async () => {
    try {
      const [resAll, resLow, resNear, resExp] = await Promise.all([
        fetch('/api/inventory/inquiry?filter=all'),
        fetch('/api/inventory/inquiry?filter=low_stock'),
        fetch('/api/inventory/inquiry?filter=near_expiry'),
        fetch('/api/inventory/inquiry?filter=expired'),
      ]);

      const [dataAll, dataLow, dataNear, dataExp] = await Promise.all([
        resAll.json(),
        resLow.json(),
        resNear.json(),
        resExp.json(),
      ]);

      setStats({
        totalItems: dataAll.results?.length || 0,
        lowStockCount: dataLow.results?.length || 0,
        nearExpiryCount: dataNear.results?.length || 0,
        expiredCount: dataExp.results?.length || 0,
      });
    } catch {}
  };

  const fetchInquiry = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const params = new URLSearchParams();
      params.set('filter', filter);
      if (keyword.trim()) {
        params.set('keyword', keyword.trim());
      }

      const res = await fetch(`/api/inventory/inquiry?${params.toString()}`);
      const data = await res.json();

      if (!res.ok) {
        // UC4.3 5b.1: Không thể tải dữ liệu tồn kho
        setErrorMsg(data.error || 'Không thể tải dữ liệu tồn kho');
        setResults([]);
      } else {
        setResults(data.results || []);
      }
    } catch (err: any) {
      setErrorMsg('Không thể tải dữ liệu tồn kho');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    fetchInquiry();
  }, [filter]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchInquiry();
  };

  const toggleExpand = (maSP: string) => {
    setExpandedProduct(expandedProduct === maSP ? null : maSP);
  };

  return (
    <AppLayout>
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <AlertCircle className="w-7 h-7 text-emerald-600" />
              Tra cứu tồn kho & Cảnh báo
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              UC4.3: Theo dõi số lượng tồn kho thực tế, cảnh báo mức tồn tối thiểu và hạn sử dụng của từng lô hàng
            </p>
          </div>
          <button
            onClick={() => {
              fetchStats();
              fetchInquiry();
            }}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition shadow-sm"
          >
            <RefreshCw className="w-4 h-4 text-slate-500" />
            Làm mới
          </button>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <p className="text-sm font-medium">{errorMsg}</p>
          </div>
        )}

        {/* Summary Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div
            onClick={() => setFilter('all')}
            className={`p-4 rounded-xl border transition cursor-pointer ${
              filter === 'all'
                ? 'bg-slate-900 text-white border-slate-900 shadow'
                : 'bg-white text-slate-800 border-slate-200 hover:border-slate-300 shadow-sm'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className={`text-xs font-semibold uppercase ${filter === 'all' ? 'text-slate-300' : 'text-slate-500'}`}>
                Tổng mặt hàng
              </span>
              <Package className={`w-5 h-5 ${filter === 'all' ? 'text-slate-300' : 'text-slate-400'}`} />
            </div>
            <div className="text-2xl font-bold mt-2">{stats.totalItems}</div>
            <p className={`text-xs mt-1 ${filter === 'all' ? 'text-slate-400' : 'text-slate-500'}`}>
              Đang quản lý trong hệ thống
            </p>
          </div>

          <div
            onClick={() => setFilter('low_stock')}
            className={`p-4 rounded-xl border transition cursor-pointer ${
              filter === 'low_stock'
                ? 'bg-amber-600 text-white border-amber-600 shadow'
                : 'bg-white text-slate-800 border-amber-200 hover:border-amber-300 shadow-sm'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className={`text-xs font-semibold uppercase ${filter === 'low_stock' ? 'text-amber-100' : 'text-amber-700'}`}>
                Dưới mức cảnh báo
              </span>
              <AlertTriangle className={`w-5 h-5 ${filter === 'low_stock' ? 'text-amber-200' : 'text-amber-500'}`} />
            </div>
            <div className={`text-2xl font-bold mt-2 ${filter === 'low_stock' ? 'text-white' : 'text-amber-700'}`}>
              {stats.lowStockCount}
            </div>
            <p className={`text-xs mt-1 ${filter === 'low_stock' ? 'text-amber-100' : 'text-amber-600'}`}>
              Tồn kho ≤ mức tồn tối thiểu
            </p>
          </div>

          <div
            onClick={() => setFilter('near_expiry')}
            className={`p-4 rounded-xl border transition cursor-pointer ${
              filter === 'near_expiry'
                ? 'bg-orange-600 text-white border-orange-600 shadow'
                : 'bg-white text-slate-800 border-orange-200 hover:border-orange-300 shadow-sm'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className={`text-xs font-semibold uppercase ${filter === 'near_expiry' ? 'text-orange-100' : 'text-orange-700'}`}>
                Sắp hết hạn
              </span>
              <Clock className={`w-5 h-5 ${filter === 'near_expiry' ? 'text-orange-200' : 'text-orange-500'}`} />
            </div>
            <div className={`text-2xl font-bold mt-2 ${filter === 'near_expiry' ? 'text-white' : 'text-orange-700'}`}>
              {stats.nearExpiryCount}
            </div>
            <p className={`text-xs mt-1 ${filter === 'near_expiry' ? 'text-orange-100' : 'text-orange-600'}`}>
              Lô hàng còn hạn ≤ 30 ngày
            </p>
          </div>

          <div
            onClick={() => setFilter('expired')}
            className={`p-4 rounded-xl border transition cursor-pointer ${
              filter === 'expired'
                ? 'bg-rose-600 text-white border-rose-600 shadow'
                : 'bg-white text-slate-800 border-rose-200 hover:border-rose-300 shadow-sm'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className={`text-xs font-semibold uppercase ${filter === 'expired' ? 'text-rose-100' : 'text-rose-700'}`}>
                Đã hết hạn
              </span>
              <AlertCircle className={`w-5 h-5 ${filter === 'expired' ? 'text-rose-200' : 'text-rose-500'}`} />
            </div>
            <div className={`text-2xl font-bold mt-2 ${filter === 'expired' ? 'text-white' : 'text-rose-700'}`}>
              {stats.expiredCount}
            </div>
            <p className={`text-xs mt-1 ${filter === 'expired' ? 'text-rose-100' : 'text-rose-600'}`}>
              Không tính vào lượng được bán
            </p>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-medium text-slate-500">Phân loại:</span>
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                filter === 'all'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Tất cả
            </button>
            <button
              onClick={() => setFilter('low_stock')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                filter === 'low_stock'
                  ? 'bg-amber-600 text-white'
                  : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
              }`}
            >
              Dưới mức cảnh báo tồn kho
            </button>
            <button
              onClick={() => setFilter('near_expiry')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                filter === 'near_expiry'
                  ? 'bg-orange-600 text-white'
                  : 'bg-orange-50 text-orange-700 hover:bg-orange-100'
              }`}
            >
              Sắp hết hạn
            </button>
            <button
              onClick={() => setFilter('expired')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                filter === 'expired'
                  ? 'bg-rose-600 text-white'
                  : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
              }`}
            >
              Đã hết hạn
            </button>
          </div>

          <form onSubmit={handleSearch} className="flex gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-72">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Tìm mã SP, tên sản phẩm..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <button
              type="submit"
              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-lg transition"
            >
              Tìm
            </button>
          </form>
        </div>

        {/* Results List */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-slate-500">
              <div className="inline-block animate-spin w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full mb-3" />
              <p className="text-sm">Đang tải dữ liệu tồn kho...</p>
            </div>
          ) : results.length === 0 ? (
            <div className="p-12 text-center text-slate-500 space-y-2">
              <Package className="w-10 h-10 mx-auto text-slate-300" />
              <p className="text-base font-medium">Không tìm thấy sản phẩm phù hợp</p>
              <p className="text-xs text-slate-400">Hãy thử đổi bộ lọc hoặc từ khóa tìm kiếm</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600 uppercase">
                    <th className="py-3 px-4">Mã SP</th>
                    <th className="py-3 px-4">Tên sản phẩm</th>
                    <th className="py-3 px-4">Đơn vị</th>
                    {filter === 'expired' || filter === 'near_expiry' ? (
                      <>
                        <th className="py-3 px-4">Mã phiếu nhập</th>
                        <th className="py-3 px-4">Hạn sử dụng</th>
                        <th className="py-3 px-4 text-right">Số lượng còn</th>
                        <th className="py-3 px-4 text-center">Trạng thái</th>
                      </>
                    ) : (
                      <>
                        <th className="py-3 px-4 text-right">Tồn hiện tại</th>
                        <th className="py-3 px-4 text-right">Mức tối thiểu</th>
                        <th className="py-3 px-4 text-center">Trạng thái cảnh báo</th>
                        <th className="py-3 px-4 text-center">Lô hàng</th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {results.map((row, idx) => {
                    const isExpanded = expandedProduct === row.maSanPham;

                    if (filter === 'expired' || filter === 'near_expiry') {
                      return (
                        <tr key={idx} className="hover:bg-slate-50 transition">
                          <td className="py-3 px-4 font-mono font-bold text-slate-800">{row.maSanPham}</td>
                          <td className="py-3 px-4 font-semibold text-slate-800">{row.tenSanPham}</td>
                          <td className="py-3 px-4 text-slate-600">{row.donViTinh}</td>
                          <td className="py-3 px-4 font-mono text-emerald-700 font-semibold">{row.maPhieuNhap}</td>
                          <td className="py-3 px-4 font-medium text-slate-800">
                            {row.hanSuDung ? formatDate(row.hanSuDung) : '—'}
                          </td>
                          <td className="py-3 px-4 text-right font-bold text-slate-800">{row.soLuongCon}</td>
                          <td className="py-3 px-4 text-center">
                            <span
                              className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${
                                row.trangThai === 'Đã hết hạn'
                                  ? 'bg-rose-100 text-rose-800 border border-rose-200'
                                  : 'bg-orange-100 text-orange-800 border border-orange-200'
                              }`}
                            >
                              {row.trangThai}
                            </span>
                          </td>
                        </tr>
                      );
                    }

                    // all or low_stock
                    const isLow = row.soLuongTon <= row.mucTonToiThieu;

                    return (
                      <React.Fragment key={idx}>
                        <tr className="hover:bg-slate-50 transition">
                          <td className="py-3 px-4 font-mono font-bold text-slate-800">{row.maSanPham}</td>
                          <td className="py-3 px-4 font-semibold text-slate-800">{row.tenSanPham}</td>
                          <td className="py-3 px-4 text-slate-600">{row.donViTinh}</td>
                          <td className="py-3 px-4 text-right font-bold text-slate-800">{row.soLuongTon}</td>
                          <td className="py-3 px-4 text-right text-slate-600">{row.mucTonToiThieu}</td>
                          <td className="py-3 px-4 text-center">
                            <span
                              className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${
                                row.trangThai === 'Dưới mức cảnh báo tồn kho'
                                  ? 'bg-amber-100 text-amber-800 border border-amber-200'
                                  : row.trangThai === 'Đã hết hạn'
                                  ? 'bg-rose-100 text-rose-800 border border-rose-200'
                                  : row.trangThai === 'Sắp hết hạn'
                                  ? 'bg-orange-100 text-orange-800 border border-orange-200'
                                  : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                              }`}
                            >
                              {row.trangThai}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center">
                            {row.chiTiet && row.chiTiet.length > 0 ? (
                              <button
                                onClick={() => toggleExpand(row.maSanPham)}
                                className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:text-emerald-900 bg-emerald-50 px-2 py-1 rounded border border-emerald-200"
                              >
                                <Layers className="w-3.5 h-3.5" />
                                <span>{row.chiTiet.length} lô</span>
                                {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                              </button>
                            ) : (
                              <span className="text-xs text-slate-400">Chưa có lô</span>
                            )}
                          </td>
                        </tr>

                        {/* Expandable Lot Details */}
                        {isExpanded && row.chiTiet && row.chiTiet.length > 0 && (
                          <tr className="bg-slate-50/70">
                            <td colSpan={7} className="p-4 pl-12 border-b border-slate-200">
                              <div className="bg-white rounded-lg border border-slate-200 p-3 shadow-inner">
                                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                  <Layers className="w-3.5 h-3.5 text-emerald-600" />
                                  Chi tiết các lô nhập hàng của sản phẩm {row.maSanPham} - {row.tenSanPham}
                                </h4>
                                <table className="w-full text-xs">
                                  <thead>
                                    <tr className="border-b border-slate-200 text-slate-500 font-semibold">
                                      <th className="py-1.5 px-2 text-left">Mã chi tiết</th>
                                      <th className="py-1.5 px-2 text-left">Mã phiếu nhập</th>
                                      <th className="py-1.5 px-2 text-left">Hạn sử dụng</th>
                                      <th className="py-1.5 px-2 text-right">SL nhập (Gốc)</th>
                                      <th className="py-1.5 px-2 text-right">SL còn lại</th>
                                      <th className="py-1.5 px-2 text-center">Trạng thái lô</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-slate-100">
                                    {row.chiTiet.map((lot: any, lIdx: number) => {
                                      const today = new Date();
                                      today.setHours(0, 0, 0, 0);
                                      const thirtyDays = new Date(today.getTime() + 30 * 86400000);

                                      let lotStatus = 'Bình thường';
                                      let lotClass = 'bg-slate-100 text-slate-700';

                                      if (lot.hanSuDung) {
                                        const exp = new Date(lot.hanSuDung);
                                        if (exp < today) {
                                          lotStatus = 'Đã hết hạn';
                                          lotClass = 'bg-rose-100 text-rose-800 font-bold';
                                        } else if (exp <= thirtyDays) {
                                          lotStatus = 'Sắp hết hạn';
                                          lotClass = 'bg-orange-100 text-orange-800 font-bold';
                                        }
                                      }

                                      return (
                                        <tr key={lIdx} className="hover:bg-slate-50">
                                          <td className="py-1.5 px-2 font-mono text-slate-600">{lot.maChiTietNhap}</td>
                                          <td className="py-1.5 px-2 font-mono font-semibold text-emerald-700">
                                            {lot.maPhieuNhap}
                                          </td>
                                          <td className="py-1.5 px-2 text-slate-700">
                                            {lot.hanSuDung ? formatDate(lot.hanSuDung) : 'Không quản lý hạn'}
                                          </td>
                                          <td className="py-1.5 px-2 text-right text-slate-600">
                                            {lot.soLuongNhap * (lot.tyLeQuyDoi || 1)} {row.donViTinh}
                                          </td>
                                          <td className="py-1.5 px-2 text-right font-bold text-slate-800">
                                            {lot.soLuongCon} {row.donViTinh}
                                          </td>
                                          <td className="py-1.5 px-2 text-center">
                                            <span className={`px-2 py-0.5 rounded text-[11px] ${lotClass}`}>
                                              {lotStatus}
                                            </span>
                                          </td>
                                        </tr>
                                      );
                                    })}
                                  </tbody>
                                </table>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
