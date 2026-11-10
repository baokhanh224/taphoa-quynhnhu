'use client';

import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import {
  Boxes,
  Calendar,
  FileSpreadsheet,
  FileText,
  AlertTriangle,
  Package,
  Layers,
  ArrowDownLeft,
  ArrowUpRight,
  Sliders,
} from 'lucide-react';
import { formatVND, formatDate } from '@/lib/formatters';

export default function InventoryReportPage() {
  const todayStr = new Date().toISOString().slice(0, 10);
  const thirtyDaysAgoStr = new Date(Date.now() - 30 * 86400000).toISOString().slice(0, 10);

  const [fromDate, setFromDate] = useState(thirtyDaysAgoStr);
  const [toDate, setToDate] = useState(todayStr);

  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [noDataMsg, setNoDataMsg] = useState('');

  const fetchReport = async () => {
    setErrorMsg('');
    setNoDataMsg('');

    // BR-UC3-01
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    const f = new Date(fromDate);
    const t = new Date(toDate);

    if (f > t || t > today) {
      // UC3.2 5a.2
      setErrorMsg('Khoảng thời gian hoặc tiêu chí lọc không hợp lệ');
      return;
    }

    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (fromDate) params.set('fromDate', fromDate);
      if (toDate) params.set('toDate', toDate);

      const res = await fetch(`/api/reports/inventory?${params.toString()}`);
      const data = await res.json();

      if (!res.ok) {
        // UC3.2 6a.2: Không thể tải báo cáo. Vui lòng thử lại
        setErrorMsg(data.error || 'Không thể tải báo cáo. Vui lòng thử lại');
        setItems([]);
      } else {
        setItems(data.items || []);
        if (!data.hasData || data.message) {
          setNoDataMsg('Không có dữ liệu phù hợp');
        }
      }
    } catch {
      setErrorMsg('Không thể tải báo cáo. Vui lòng thử lại');
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, []);

  const handleFilterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchReport();
  };

  // Calculations for summary & totals
  const totalTonDau = items.reduce((acc, it) => acc + (it.tonDauKy || 0), 0);
  const totalNhap = items.reduce((acc, it) => acc + (it.nhap || 0), 0);
  const totalXuat = items.reduce((acc, it) => acc + (it.xuat || 0), 0);
  const totalTonCuoi = items.reduce((acc, it) => acc + (it.tonCuoiKy || 0), 0);
  const totalGiaTriTon = items.reduce((acc, it) => acc + (it.giaTriTon || 0), 0);

  // Export Excel
  const handleExportExcel = async () => {
    if (!items || items.length === 0) return;
    setExporting(true);
    try {
      const columns = [
        { header: 'Mã SP', key: 'maSanPham', width: 14 },
        { header: 'Tên sản phẩm', key: 'tenSanPham', width: 28 },
        { header: 'ĐVT', key: 'donViTinh', width: 12 },
        { header: 'Tồn đầu kỳ', key: 'tonDauKy', width: 14 },
        { header: 'Nhập trong kỳ', key: 'nhap', width: 14 },
        { header: 'Xuất trong kỳ', key: 'xuat', width: 14 },
        { header: 'Điều chỉnh tăng', key: 'dieuChinhTang', width: 16 },
        { header: 'Điều chỉnh giảm', key: 'dieuChinhGiam', width: 16 },
        { header: 'Tồn cuối kỳ', key: 'tonCuoiKy', width: 14 },
        { header: 'Giá vốn BQ', key: 'giaNhapBinhQuan', width: 18 },
        { header: 'Giá trị tồn', key: 'giaTriTon', width: 22 },
      ];

      const rows = items.map((it) => ({
        maSanPham: it.maSanPham,
        tenSanPham: it.tenSanPham,
        donViTinh: it.donViTinh,
        tonDauKy: it.tonDauKy,
        nhap: it.nhap,
        xuat: it.xuat,
        dieuChinhTang: it.dieuChinhTang,
        dieuChinhGiam: it.dieuChinhGiam,
        tonCuoiKy: it.tonCuoiKy,
        giaNhapBinhQuan: formatVND(it.giaNhapBinhQuan),
        giaTriTon: formatVND(it.giaTriTon),
      }));

      const res = await fetch('/api/export/excel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'BÁO CÁO XUẤT - NHẬP - TỒN',
          reportType: 'Báo cáo biến động kho hàng',
          filters: {
            'Từ ngày': formatDate(fromDate),
            'Đến ngày': formatDate(toDate),
          },
          columns,
          rows,
          totals: {
            maSanPham: 'Tổng cộng',
            tonDauKy: totalTonDau,
            nhap: totalNhap,
            xuat: totalXuat,
            tonCuoiKy: totalTonCuoi,
            giaTriTon: formatVND(totalGiaTriTon),
          },
        }),
      });

      if (!res.ok) {
        setErrorMsg('Xuất báo cáo không thành công, vui lòng thử lại');
        return;
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `BaoCao_XuatNhapTon_${fromDate}_${toDate}.xlsx`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch {
      setErrorMsg('Xuất báo cáo không thành công, vui lòng thử lại');
    } finally {
      setExporting(false);
    }
  };

  // Export PDF
  const handleExportPDF = async () => {
    if (!items || items.length === 0) return;
    setExporting(true);
    try {
      const headers = ['Mã SP', 'Tên sản phẩm', 'ĐVT', 'Tồn đầu', 'Nhập', 'Xuất', 'Tồn cuối', 'Giá trị tồn'];
      const data = items.map((it) => [
        it.maSanPham,
        it.tenSanPham,
        it.donViTinh,
        it.tonDauKy,
        it.nhap,
        it.xuat,
        it.tonCuoiKy,
        formatVND(it.giaTriTon),
      ]);

      const res = await fetch('/api/export/pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'BÁO CÁO XUẤT - NHẬP - TỒN',
          reportType: 'Báo cáo biến động kho hàng',
          filters: {
            'Từ ngày': formatDate(fromDate),
            'Đến ngày': formatDate(toDate),
          },
          headers,
          data,
          totals: ['Tổng cộng', '', '', totalTonDau, totalNhap, totalXuat, totalTonCuoi, formatVND(totalGiaTriTon)],
        }),
      });

      if (!res.ok) {
        setErrorMsg('Xuất báo cáo không thành công, vui lòng thử lại');
        return;
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `BaoCao_XuatNhapTon_${fromDate}_${toDate}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch {
      setErrorMsg('Xuất báo cáo không thành công, vui lòng thử lại');
    } finally {
      setExporting(false);
    }
  };

  return (
    <AppLayout>
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <Boxes className="w-7 h-7 text-emerald-600" />
              Báo cáo xuất – nhập – tồn
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              UC3.2: Thống kê số lượng tồn đầu kỳ, nhập, xuất, điều chỉnh kho và giá trị tồn cuối kỳ
            </p>
          </div>

          {/* Export Actions (UC3.3) */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportExcel}
              disabled={exporting || items.length === 0 || !!noDataMsg}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition disabled:opacity-50"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              Xuất Excel
            </button>
            <button
              onClick={handleExportPDF}
              disabled={exporting || items.length === 0 || !!noDataMsg}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition disabled:opacity-50"
            >
              <FileText className="w-4 h-4 text-rose-600" />
              Xuất PDF
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <p className="text-sm font-medium">{errorMsg}</p>
          </div>
        )}

        {/* Filter Toolbar */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <form onSubmit={handleFilterSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Từ ngày</label>
              <div className="relative">
                <Calendar className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Đến ngày</label>
              <div className="relative">
                <Calendar className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-lg transition shadow-sm disabled:opacity-60"
              >
                {loading ? 'Đang tính toán...' : 'Xem báo cáo'}
              </button>
            </div>
          </form>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase">
              <span>Tổng giá trị tồn kho</span>
              <Boxes className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-bold text-slate-900 mt-2">
              {formatVND(totalGiaTriTon)}
            </div>
            <p className="text-xs text-slate-500 mt-1">Tính theo giá vốn bình quân</p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase">
              <span>Tổng nhập trong kỳ</span>
              <ArrowDownLeft className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-slate-900 mt-2">{totalNhap}</div>
            <p className="text-xs text-slate-500 mt-1">Đơn vị cơ sở (gồm hàng trả lại)</p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase">
              <span>Tổng xuất trong kỳ</span>
              <ArrowUpRight className="w-4 h-4 text-orange-600" />
            </div>
            <div className="text-2xl font-bold text-slate-900 mt-2">{totalXuat}</div>
            <p className="text-xs text-slate-500 mt-1">Đơn vị cơ sở (bán & hàng đổi)</p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase">
              <span>Tổng tồn cuối kỳ</span>
              <Package className="w-4 h-4 text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-slate-900 mt-2">{totalTonCuoi}</div>
            <p className="text-xs text-slate-500 mt-1">Tổng cộng các mặt hàng</p>
          </div>
        </div>

        {/* Empty / No Data Message */}
        {noDataMsg ? (
          <div className="bg-white p-12 rounded-xl border border-slate-200 shadow-sm text-center space-y-2">
            <Package className="w-12 h-12 mx-auto text-slate-300" />
            <p className="text-base font-semibold text-slate-700">{noDataMsg}</p>
            <p className="text-xs text-slate-400">Không có biến động kho nào phát sinh trong khoảng thời gian đã chọn</p>
          </div>
        ) : (
          /* Inventory Table */
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase">
                    <th className="py-3 px-3">Mã SP</th>
                    <th className="py-3 px-3">Tên sản phẩm</th>
                    <th className="py-3 px-3">ĐVT</th>
                    <th className="py-3 px-3 text-right">Tồn đầu</th>
                    <th className="py-3 px-3 text-right">Nhập</th>
                    <th className="py-3 px-3 text-right">Xuất</th>
                    <th className="py-3 px-3 text-right">Đ/c tăng</th>
                    <th className="py-3 px-3 text-right">Đ/c giảm</th>
                    <th className="py-3 px-3 text-right">Tồn cuối</th>
                    <th className="py-3 px-3 text-right">Giá vốn BQ</th>
                    <th className="py-3 px-3 text-right">Giá trị tồn</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {items.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 transition">
                      <td className="py-2.5 px-3 font-mono font-medium text-slate-700">{row.maSanPham}</td>
                      <td className="py-2.5 px-3 font-semibold text-slate-800">{row.tenSanPham}</td>
                      <td className="py-2.5 px-3 text-slate-600">{row.donViTinh}</td>
                      <td className="py-2.5 px-3 text-right text-slate-700 font-medium">{row.tonDauKy}</td>
                      <td className="py-2.5 px-3 text-right text-emerald-700 font-medium">+{row.nhap}</td>
                      <td className="py-2.5 px-3 text-right text-rose-700 font-medium">-{row.xuat}</td>
                      <td className="py-2.5 px-3 text-right text-blue-700">+{row.dieuChinhTang}</td>
                      <td className="py-2.5 px-3 text-right text-amber-700">-{row.dieuChinhGiam}</td>
                      <td className="py-2.5 px-3 text-right font-bold text-slate-900">{row.tonCuoiKy}</td>
                      <td className="py-2.5 px-3 text-right text-slate-600">{formatVND(row.giaNhapBinhQuan)}</td>
                      <td className="py-2.5 px-3 text-right font-bold text-emerald-700">
                        {formatVND(row.giaTriTon)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-slate-100 font-bold text-slate-900 border-t border-slate-300">
                    <td colSpan={3} className="py-3 px-3 text-right">
                      Tổng cộng:
                    </td>
                    <td className="py-3 px-3 text-right">{totalTonDau}</td>
                    <td className="py-3 px-3 text-right text-emerald-700">+{totalNhap}</td>
                    <td className="py-3 px-3 text-right text-rose-700">-{totalXuat}</td>
                    <td className="py-3 px-3 text-right text-blue-700">
                      +{items.reduce((acc, it) => acc + (it.dieuChinhTang || 0), 0)}
                    </td>
                    <td className="py-3 px-3 text-right text-amber-700">
                      -{items.reduce((acc, it) => acc + (it.dieuChinhGiam || 0), 0)}
                    </td>
                    <td className="py-3 px-3 text-right">{totalTonCuoi}</td>
                    <td className="py-3 px-3 text-right">—</td>
                    <td className="py-3 px-3 text-right text-emerald-700 text-sm">{formatVND(totalGiaTriTon)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
