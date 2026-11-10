'use client';

import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import {
  TrendingUp,
  Calendar,
  Filter,
  FileSpreadsheet,
  FileText,
  AlertTriangle,
  Receipt,
  DollarSign,
  TrendingDown,
  Package,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import { formatVND, formatDate } from '@/lib/formatters';

export default function BusinessReportPage() {
  const todayStr = new Date().toISOString().slice(0, 10);
  const thirtyDaysAgoStr = new Date(Date.now() - 30 * 86400000).toISOString().slice(0, 10);

  const [fromDate, setFromDate] = useState(thirtyDaysAgoStr);
  const [toDate, setToDate] = useState(todayStr);
  const [rankingBy, setRankingBy] = useState<'quantity' | 'revenue'>('quantity');

  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [noDataMsg, setNoDataMsg] = useState('');

  const fetchReport = async () => {
    setErrorMsg('');
    setNoDataMsg('');

    // BR-UC3-01: "Từ ngày" không lớn hơn "Đến ngày" và không vượt quá ngày hiện tại
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    const f = new Date(fromDate);
    const t = new Date(toDate);

    if (f > t || t > today) {
      // UC3.1 6a.2
      setErrorMsg('Khoảng thời gian hoặc tiêu chí lọc không hợp lệ');
      return;
    }

    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (fromDate) params.set('fromDate', fromDate);
      if (toDate) params.set('toDate', toDate);
      params.set('rankingBy', rankingBy);

      const res = await fetch(`/api/reports/business?${params.toString()}`);
      const data = await res.json();

      if (!res.ok) {
        // UC3.1 7a.2: Không thể tải báo cáo. Vui lòng thử lại
        setErrorMsg(data.error || 'Không thể tải báo cáo. Vui lòng thử lại');
        setReport(null);
      } else {
        setReport(data.report);
        if (!data.hasData || data.message) {
          setNoDataMsg('Không có dữ liệu phù hợp');
        }
      }
    } catch {
      setErrorMsg('Không thể tải báo cáo. Vui lòng thử lại');
      setReport(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [rankingBy]);

  const handleFilterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchReport();
  };

  // Export handlers
  const handleExportExcel = async () => {
    if (!report || !report.statList || report.statList.length === 0) return;
    setExporting(true);
    try {
      const columns = [
        { header: 'Mã SP', key: 'maSanPham', width: 14 },
        { header: 'Tên sản phẩm', key: 'tenSanPham', width: 28 },
        { header: 'Đơn vị tính', key: 'donViTinh', width: 14 },
        { header: 'Số lượng bán thuần', key: 'soLuongBanThuan', width: 18 },
        { header: 'Doanh thu thuần', key: 'doanhThuThuan', width: 20 },
        { header: 'Giá vốn', key: 'giaVon', width: 20 },
        { header: 'Lợi nhuận gộp', key: 'loiNhuan', width: 20 },
      ];

      const rows = report.statList.map((item: any) => ({
        maSanPham: item.maSanPham,
        tenSanPham: item.tenSanPham,
        donViTinh: item.donViTinh,
        soLuongBanThuan: item.soLuongBanThuan,
        doanhThuThuan: formatVND(item.doanhThuThuan),
        giaVon: formatVND(item.giaVon),
        loiNhuan: formatVND(item.doanhThuThuan - item.giaVon),
      }));

      const res = await fetch('/api/export/excel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'BÁO CÁO KINH DOANH',
          reportType: 'Báo cáo doanh thu & lợi nhuận',
          filters: {
            'Từ ngày': formatDate(fromDate),
            'Đến ngày': formatDate(toDate),
            'Tiêu chí xếp hạng': rankingBy === 'revenue' ? 'Theo doanh thu' : 'Theo số lượng',
          },
          columns,
          rows,
          totals: {
            maSanPham: 'Tổng cộng',
            doanhThuThuan: formatVND(report.doanhThuThuan),
            giaVon: formatVND(report.tongGiaVon),
            loiNhuan: formatVND(report.loiNhuanGop),
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
      a.download = `BaoCao_KinhDoanh_${fromDate}_${toDate}.xlsx`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch {
      setErrorMsg('Xuất báo cáo không thành công, vui lòng thử lại');
    } finally {
      setExporting(false);
    }
  };

  const handleExportPDF = async () => {
    if (!report || !report.statList || report.statList.length === 0) return;
    setExporting(true);
    try {
      const headers = ['Mã SP', 'Tên sản phẩm', 'ĐVT', 'SL bán', 'Doanh thu', 'Giá vốn', 'Lợi nhuận'];
      const data = report.statList.map((item: any) => [
        item.maSanPham,
        item.tenSanPham,
        item.donViTinh,
        item.soLuongBanThuan,
        formatVND(item.doanhThuThuan),
        formatVND(item.giaVon),
        formatVND(item.doanhThuThuan - item.giaVon),
      ]);

      const res = await fetch('/api/export/pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'BÁO CÁO KINH DOANH',
          reportType: 'Báo cáo doanh thu & lợi nhuận',
          filters: {
            'Từ ngày': formatDate(fromDate),
            'Đến ngày': formatDate(toDate),
            'Tiêu chí': rankingBy === 'revenue' ? 'Theo doanh thu' : 'Theo số lượng',
          },
          headers,
          data,
          totals: ['Tổng cộng', '', '', '', formatVND(report.doanhThuThuan), formatVND(report.tongGiaVon), formatVND(report.loiNhuanGop)],
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
      a.download = `BaoCao_KinhDoanh_${fromDate}_${toDate}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch {
      setErrorMsg('Xuất báo cáo không thành công, vui lòng thử lại');
    } finally {
      setExporting(false);
    }
  };

  const profitMargin =
    report && report.doanhThuThuan > 0
      ? ((report.loiNhuanGop / report.doanhThuThuan) * 100).toFixed(1)
      : '0.0';

  return (
    <AppLayout>
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <TrendingUp className="w-7 h-7 text-emerald-600" />
              Báo cáo kinh doanh
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              UC3.1: Thống kê doanh thu thuần, giá vốn hàng bán, lợi nhuận gộp và xếp hạng sản phẩm bán chạy/bán chậm
            </p>
          </div>

          {/* Export Actions (UC3.3) */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportExcel}
              disabled={exporting || !report || !!noDataMsg}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition disabled:opacity-50"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              Xuất Excel
            </button>
            <button
              onClick={handleExportPDF}
              disabled={exporting || !report || !!noDataMsg}
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

        {/* Filter Bar */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <form onSubmit={handleFilterSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
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
              <label className="block text-xs font-semibold text-slate-600 mb-1">Tiêu chí xếp hạng</label>
              <select
                value={rankingBy}
                onChange={(e) => setRankingBy(e.target.value as any)}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
              >
                <option value="quantity">Theo số lượng bán</option>
                <option value="revenue">Theo doanh thu bán</option>
              </select>
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

        {/* Empty / No Data Message */}
        {noDataMsg ? (
          <div className="bg-white p-12 rounded-xl border border-slate-200 shadow-sm text-center space-y-2">
            <Package className="w-12 h-12 mx-auto text-slate-300" />
            <p className="text-base font-semibold text-slate-700">{noDataMsg}</p>
            <p className="text-xs text-slate-400">Không có hóa đơn hoặc giao dịch phát sinh trong khoảng thời gian đã chọn</p>
          </div>
        ) : report ? (
          <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase">
                  <span>Doanh thu thuần</span>
                  <DollarSign className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-2xl font-bold text-slate-900 mt-2">
                  {formatVND(report.doanhThuThuan)}
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Đã trừ trả hàng & hủy ({report.soHoaDon} hóa đơn)
                </p>
              </div>

              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase">
                  <span>Giá vốn hàng bán</span>
                  <Receipt className="w-4 h-4 text-blue-600" />
                </div>
                <div className="text-2xl font-bold text-slate-900 mt-2">
                  {formatVND(report.tongGiaVon)}
                </div>
                <p className="text-xs text-slate-500 mt-1">Tính theo giá vốn bình quân</p>
              </div>

              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase">
                  <span>Lợi nhuận gộp</span>
                  <TrendingUp className="w-4 h-4 text-emerald-600" />
                </div>
                <div className={`text-2xl font-bold mt-2 ${report.loiNhuanGop >= 0 ? 'text-emerald-700' : 'text-rose-600'}`}>
                  {formatVND(report.loiNhuanGop)}
                </div>
                <p className="text-xs text-slate-500 mt-1">Doanh thu thuần - Giá vốn</p>
              </div>

              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase">
                  <span>Tỷ suất lợi nhuận</span>
                  <Layers className="w-4 h-4 text-purple-600" />
                </div>
                <div className="text-2xl font-bold text-slate-900 mt-2">{profitMargin}%</div>
                <p className="text-xs text-slate-500 mt-1">Lợi nhuận gộp / Doanh thu thuần</p>
              </div>
            </div>

            {/* Top Sellers & Slow Sellers Tables */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Top Sellers */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                <div className="p-4 bg-emerald-50/60 border-b border-emerald-100 flex items-center justify-between">
                  <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                    <ArrowUpRight className="w-4 h-4 text-emerald-600" />
                    Top sản phẩm bán chạy nhất
                  </h3>
                  <span className="text-xs font-medium text-emerald-700">
                    {rankingBy === 'revenue' ? 'Xếp theo doanh thu' : 'Xếp theo số lượng'}
                  </span>
                </div>
                <div className="overflow-x-auto flex-1">
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                        <th className="py-2.5 px-3">Mã SP</th>
                        <th className="py-2.5 px-3">Tên sản phẩm</th>
                        <th className="py-2.5 px-3 text-right">SL bán</th>
                        <th className="py-2.5 px-3 text-right">Doanh thu</th>
                        <th className="py-2.5 px-3 text-right">Lợi nhuận</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {report.topSellers && report.topSellers.length > 0 ? (
                        report.topSellers.map((item: any, idx: number) => (
                          <tr key={idx} className="hover:bg-slate-50">
                            <td className="py-2.5 px-3 font-mono font-medium text-slate-700">{item.maSanPham}</td>
                            <td className="py-2.5 px-3 font-semibold text-slate-800">{item.tenSanPham}</td>
                            <td className="py-2.5 px-3 text-right font-bold text-slate-900">
                              {item.soLuongBanThuan} {item.donViTinh}
                            </td>
                            <td className="py-2.5 px-3 text-right font-semibold text-emerald-700">
                              {formatVND(item.doanhThuThuan)}
                            </td>
                            <td className="py-2.5 px-3 text-right font-semibold text-slate-800">
                              {formatVND(item.doanhThuThuan - item.giaVon)}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="py-6 text-center text-slate-400">
                            Chưa có sản phẩm bán chạy trong kỳ
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Slow Sellers */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                <div className="p-4 bg-amber-50/60 border-b border-amber-100 flex items-center justify-between">
                  <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                    <ArrowDownRight className="w-4 h-4 text-amber-600" />
                    Top sản phẩm bán chậm (Cần lưu ý tồn)
                  </h3>
                  <span className="text-xs font-medium text-amber-700">Tồn kho {'>'} 0</span>
                </div>
                <div className="overflow-x-auto flex-1">
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                        <th className="py-2.5 px-3">Mã SP</th>
                        <th className="py-2.5 px-3">Tên sản phẩm</th>
                        <th className="py-2.5 px-3 text-right">Tồn hiện tại</th>
                        <th className="py-2.5 px-3 text-right">SL bán kỳ này</th>
                        <th className="py-2.5 px-3 text-right">Doanh thu</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {report.slowSellers && report.slowSellers.length > 0 ? (
                        report.slowSellers.map((item: any, idx: number) => (
                          <tr key={idx} className="hover:bg-slate-50">
                            <td className="py-2.5 px-3 font-mono font-medium text-slate-700">{item.maSanPham}</td>
                            <td className="py-2.5 px-3 font-semibold text-slate-800">{item.tenSanPham}</td>
                            <td className="py-2.5 px-3 text-right font-bold text-amber-700">
                              {item.soLuongTon} {item.donViTinh}
                            </td>
                            <td className="py-2.5 px-3 text-right text-slate-700">
                              {item.soLuongBanThuan} {item.donViTinh}
                            </td>
                            <td className="py-2.5 px-3 text-right font-medium text-slate-800">
                              {formatVND(item.doanhThuThuan)}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="py-6 text-center text-slate-400">
                            Không có sản phẩm bán chậm
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Complete Performance Table */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-slate-200">
                <h3 className="font-bold text-slate-800 text-sm">Bảng chi tiết hiệu quả tất cả mặt hàng trong kỳ</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                      <th className="py-3 px-4">Mã SP</th>
                      <th className="py-3 px-4">Tên sản phẩm</th>
                      <th className="py-3 px-4">Đơn vị</th>
                      <th className="py-3 px-4 text-right">SL bán thuần</th>
                      <th className="py-3 px-4 text-right">Doanh thu thuần</th>
                      <th className="py-3 px-4 text-right">Giá vốn</th>
                      <th className="py-3 px-4 text-right">Lợi nhuận gộp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {(report.statList || []).map((row: any, idx: number) => {
                      const profit = row.doanhThuThuan - row.giaVon;
                      return (
                        <tr key={idx} className="hover:bg-slate-50">
                          <td className="py-2.5 px-4 font-mono font-medium text-slate-700">{row.maSanPham}</td>
                          <td className="py-2.5 px-4 font-semibold text-slate-800">{row.tenSanPham}</td>
                          <td className="py-2.5 px-4 text-slate-600">{row.donViTinh}</td>
                          <td className="py-2.5 px-4 text-right font-bold text-slate-800">{row.soLuongBanThuan}</td>
                          <td className="py-2.5 px-4 text-right font-semibold text-emerald-700">
                            {formatVND(row.doanhThuThuan)}
                          </td>
                          <td className="py-2.5 px-4 text-right text-slate-700">{formatVND(row.giaVon)}</td>
                          <td className={`py-2.5 px-4 text-right font-bold ${profit >= 0 ? 'text-emerald-700' : 'text-rose-600'}`}>
                            {formatVND(profit)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot>
                    <tr className="bg-slate-100 font-bold text-slate-900 border-t border-slate-300">
                      <td colSpan={4} className="py-3 px-4 text-right">
                        Tổng cộng toàn bộ:
                      </td>
                      <td className="py-3 px-4 text-right text-emerald-700">{formatVND(report.doanhThuThuan)}</td>
                      <td className="py-3 px-4 text-right text-slate-800">{formatVND(report.tongGiaVon)}</td>
                      <td className={`py-3 px-4 text-right ${report.loiNhuanGop >= 0 ? 'text-emerald-700' : 'text-rose-600'}`}>
                        {formatVND(report.loiNhuanGop)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </AppLayout>
  );
}
