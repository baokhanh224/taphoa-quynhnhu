'use client';

import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import {
  Search,
  Barcode,
  ShoppingCart,
  Trash2,
  UserPlus,
  UserCheck,
  CreditCard,
  Banknote,
  QrCode,
  AlertTriangle,
  CheckCircle2,
  Plus,
  Minus,
} from 'lucide-react';
import { formatVND } from '@/lib/formatters';
import CustomerSearchModal from '@/components/sales/CustomerSearchModal';
import QRPaymentModal from '@/components/sales/QRPaymentModal';
import ReceiptModal from '@/components/sales/ReceiptModal';

interface CartItem {
  maSanPham: string;
  tenSanPham: string;
  maDonViBan: string;
  tenDonVi: string;
  heSoQuyDoi: number;
  donGia: number;
  soLuong: number;
  thanhTien: number;
  availableStock: number; // in base units
}

export default function PosPage() {
  const [keyword, setKeyword] = useState('');
  const [barcodeInput, setBarcodeInput] = useState('');
  const [products, setProducts] = useState<any[]>([]);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);

  // Customer
  const [customer, setCustomer] = useState<any>(null);
  const [showCustomerModal, setShowCustomerModal] = useState(false);

  // Payment
  const [paymentMethod, setPaymentMethod] = useState<'Tiền mặt' | 'Chuyển khoản'>('Tiền mặt');
  const [tienKhachDua, setTienKhachDua] = useState<string>('');
  const [transferConfirmed, setTransferConfirmed] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);

  // Warnings & Success
  const [lowStockWarnings, setLowStockWarnings] = useState<string[]>([]);
  const [errorMsg, setErrorMsg] = useState('');
  const [successInvoice, setSuccessInvoice] = useState<any>(null);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Load products
  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      setProducts(data.products || []);
      setSearchResults(data.products || []);
    } catch {}
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Filter search
  useEffect(() => {
    if (!keyword.trim()) {
      setSearchResults(products);
      return;
    }
    const kw = keyword.toLowerCase().trim();
    const filtered = products.filter(
      (p) =>
        p.tenSanPham.toLowerCase().includes(kw) ||
        p.maSanPham.toLowerCase().includes(kw) ||
        (p.maVach && p.maVach.toLowerCase().includes(kw))
    );
    setSearchResults(filtered);
  }, [keyword, products]);

  // Handle barcode scanning
  const handleBarcodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!barcodeInput.trim()) return;

    const code = barcodeInput.trim();
    const found = products.find(
      (p) => p.maVach === code || p.maSanPham.toLowerCase() === code.toLowerCase()
    );

    if (found) {
      addToCart(found);
      setBarcodeInput('');
      setErrorMsg('');
    } else {
      // UC6.1 4a.1: Không tìm thấy sản phẩm
      setErrorMsg('Không tìm thấy sản phẩm');
    }
  };

  // Add product to cart
  const addToCart = (product: any, unitId?: string) => {
    setErrorMsg('');
    const unit = unitId
      ? product.donViQuyDois.find((u: any) => u.maDonVi === unitId)
      : product.donViQuyDois[0];

    if (!unit) return;

    // Check stock
    const existingIndex = cart.findIndex(
      (item) => item.maSanPham === product.maSanPham && item.maDonViBan === unit.maDonVi
    );

    const neededQty = existingIndex >= 0 ? cart[existingIndex].soLuong + 1 : 1;
    const totalBaseNeeded =
      cart
        .filter((item, idx) => item.maSanPham === product.maSanPham && idx !== existingIndex)
        .reduce((sum, item) => sum + item.soLuong * item.heSoQuyDoi, 0) +
      neededQty * unit.heSoQuyDoi;

    if (totalBaseNeeded > product.soLuongTon) {
      // UC6.1 6b.2: Không đủ số lượng hàng có thể bán
      setErrorMsg('Không đủ số lượng hàng có thể bán');
      return;
    }

    if (existingIndex >= 0) {
      setCart((prev) =>
        prev.map((item, idx) =>
          idx === existingIndex
            ? {
                ...item,
                soLuong: neededQty,
                thanhTien: neededQty * item.donGia,
              }
            : item
        )
      );
    } else {
      setCart((prev) => [
        ...prev,
        {
          maSanPham: product.maSanPham,
          tenSanPham: product.tenSanPham,
          maDonViBan: unit.maDonVi,
          tenDonVi: unit.tenDonVi,
          heSoQuyDoi: unit.heSoQuyDoi,
          donGia: Number(unit.giaBan),
          soLuong: 1,
          thanhTien: Number(unit.giaBan),
          availableStock: product.soLuongTon,
        },
      ]);
    }
  };

  const updateCartQty = (index: number, newQty: number) => {
    setErrorMsg('');
    if (newQty <= 0) {
      removeCartItem(index);
      return;
    }

    const item = cart[index];
    const product = products.find((p) => p.maSanPham === item.maSanPham);
    const available = product ? product.soLuongTon : item.availableStock;

    const totalBaseNeeded =
      cart
        .filter((_, idx) => idx !== index && cart[idx].maSanPham === item.maSanPham)
        .reduce((sum, it) => sum + it.soLuong * it.heSoQuyDoi, 0) +
      newQty * item.heSoQuyDoi;

    if (totalBaseNeeded > available) {
      setErrorMsg('Không đủ số lượng hàng có thể bán');
      return;
    }

    setCart((prev) =>
      prev.map((it, idx) =>
        idx === index
          ? {
              ...it,
              soLuong: newQty,
              thanhTien: newQty * it.donGia,
            }
          : it
      )
    );
  };

  const updateCartUnit = (index: number, newUnitId: string) => {
    setErrorMsg('');
    const item = cart[index];
    const product = products.find((p) => p.maSanPham === item.maSanPham);
    if (!product) return;

    const newUnit = product.donViQuyDois.find((u: any) => u.maDonVi === newUnitId);
    if (!newUnit) return;

    const newDonGia = Number(newUnit.giaBan);
    setCart((prev) =>
      prev.map((it, idx) =>
        idx === index
          ? {
              ...it,
              maDonViBan: newUnit.maDonVi,
              tenDonVi: newUnit.tenDonVi,
              heSoQuyDoi: newUnit.heSoQuyDoi,
              donGia: newDonGia,
              thanhTien: it.soLuong * newDonGia,
            }
          : it
      )
    );
  };

  const removeCartItem = (index: number) => {
    setCart((prev) => prev.filter((_, idx) => idx !== index));
  };

  const totalAmount = cart.reduce((sum, item) => sum + item.thanhTien, 0);
  const parsedCustomerCash = parseFloat(tienKhachDua) || 0;
  const changeAmount = Math.max(0, parsedCustomerCash - totalAmount);

  // Checkout submission
  const handleCheckout = async () => {
    setErrorMsg('');

    if (cart.length === 0) {
      setErrorMsg('Vui lòng chọn sản phẩm vào giỏ hàng');
      return;
    }

    if (paymentMethod === 'Tiền mặt') {
      if (parsedCustomerCash < totalAmount) {
        // UC6.1 8a.2a.2: Tiền khách đưa chưa đủ để thanh toán
        setErrorMsg('Tiền khách đưa chưa đủ để thanh toán');
        return;
      }
    } else {
      if (!transferConfirmed) {
        setErrorMsg('Vui lòng xác nhận đã nhận đủ tiền chuyển khoản');
        return;
      }
    }

    setSubmitting(true);
    try {
      const idempotencyKey = `sale_${Date.now()}_${Math.random().toString(36).substring(7)}`;

      const res = await fetch('/api/sales', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          maKhachHang: customer ? customer.maKhachHang : null,
          phuongThucThanhToan: paymentMethod,
          tienKhachDua: paymentMethod === 'Tiền mặt' ? parsedCustomerCash : totalAmount,
          tienThua: paymentMethod === 'Tiền mặt' ? changeAmount : 0,
          idempotencyKey,
          items: cart.map((item) => ({
            maSanPham: item.maSanPham,
            maDonViBan: item.maDonViBan,
            soLuong: item.soLuong,
            donGia: item.donGia,
            thanhTien: item.thanhTien,
          })),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || 'Không thể lưu giao dịch. Hãy thử lại');
      } else {
        // Step 11a.1: Low stock warning
        if (data.warningLowStockProducts && data.warningLowStockProducts.length > 0) {
          setLowStockWarnings(data.warningLowStockProducts);
        } else {
          setLowStockWarnings([]);
        }

        // Fetch fresh full invoice for preview/printing
        const invRes = await fetch(`/api/sales/${data.invoice.maHoaDon}`);
        const invData = await invRes.json();

        setSuccessInvoice(invData.invoice);
        setShowReceiptModal(true);

        // Reset cart
        setCart([]);
        setTienKhachDua('');
        setTransferConfirmed(false);
        setCustomer(null);
        fetchProducts(); // refresh inventory counts
      }
    } catch {
      setErrorMsg('Không thể lưu giao dịch. Hãy thử lại');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AppLayout>
      <div className="space-y-4">
        {/* Alerts & Warnings */}
        {errorMsg && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-semibold flex items-center space-x-2 shadow-sm animate-shake">
            <AlertTriangle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        {lowStockWarnings.length > 0 && (
          <div className="p-3 bg-amber-50 border border-amber-300 rounded-xl text-amber-800 text-xs flex items-center space-x-2 shadow-sm">
            <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600" />
            <span>
              Cảnh báo tồn kho: Sản phẩm [<strong>{lowStockWarnings.join(', ')}</strong>] đã xuống
              mức tồn tối thiểu sau khi bán!
            </span>
          </div>
        )}

        {/* Main 2-column POS interface */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left Column: Product Search & Catalog (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            {/* Barcode scanner & Name search */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 space-y-3">
              <form onSubmit={handleBarcodeSubmit} className="flex space-x-2">
                <div className="relative flex-1">
                  <Barcode className="w-5 h-5 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={barcodeInput}
                    onChange={(e) => setBarcodeInput(e.target.value)}
                    placeholder="Quét hoặc nhập mã vạch sản phẩm (Enter để thêm)..."
                    className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-semibold shadow-sm"
                >
                  Quét mã
                </button>
              </form>

              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="Tìm sản phẩm theo tên hoặc mã SP..."
                  className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-xs bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Product Catalog Grid */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Danh mục sản phẩm ({searchResults.length})
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 max-h-[500px] overflow-y-auto pr-1">
                {searchResults.map((prod) => {
                  const defaultUnit = prod.donViQuyDois?.[0];
                  const isOutOfStock = prod.soLuongTon <= 0;
                  const isLowStock = prod.soLuongTon <= prod.mucTonToiThieu;

                  return (
                    <div
                      key={prod.maSanPham}
                      onClick={() => !isOutOfStock && addToCart(prod)}
                      className={`p-3 rounded-xl border transition-all text-left flex flex-col justify-between ${
                        isOutOfStock
                          ? 'bg-slate-100 border-slate-200 opacity-60 cursor-not-allowed'
                          : 'bg-white border-slate-200 hover:border-emerald-500 hover:shadow-md cursor-pointer'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono font-bold text-slate-400">
                            {prod.maSanPham}
                          </span>
                          {isOutOfStock ? (
                            <span className="text-[10px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded font-bold">
                              Hết hàng
                            </span>
                          ) : isLowStock ? (
                            <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-bold">
                              Tồn thấp ({prod.soLuongTon})
                            </span>
                          ) : (
                            <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-bold">
                              Tồn: {prod.soLuongTon} {prod.donViTinh}
                            </span>
                          )}
                        </div>

                        <h4 className="text-xs font-semibold text-slate-800 line-clamp-2">
                          {prod.tenSanPham}
                        </h4>
                      </div>

                      <div className="pt-2 mt-2 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-xs font-bold text-emerald-700">
                          {defaultUnit ? formatVND(defaultUnit.giaBan) : '0 đ'}
                        </span>
                        <span className="text-[11px] text-slate-500">
                          /{defaultUnit?.tenDonVi || prod.donViTinh}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Shopping Cart & Checkout (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-full">
              {/* Header */}
              <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <ShoppingCart className="w-5 h-5 text-emerald-600" />
                  <h3 className="font-bold text-sm text-slate-800">GIỎ HÀNG BÁN</h3>
                  <span className="bg-emerald-100 text-emerald-800 text-xs px-2 py-0.5 rounded-full font-bold">
                    {cart.reduce((sum, item) => sum + item.soLuong, 0)}
                  </span>
                </div>

                {cart.length > 0 && (
                  <button
                    onClick={() => setCart([])}
                    className="text-xs text-red-600 hover:text-red-700 font-semibold"
                  >
                    Xóa tất cả
                  </button>
                )}
              </div>

              {/* Customer attachment bar */}
              <div className="px-4 py-2.5 bg-slate-100 border-b border-slate-200 flex items-center justify-between">
                {customer ? (
                  <div className="flex items-center space-x-2 text-xs">
                    <UserCheck className="w-4 h-4 text-emerald-600" />
                    <span className="text-slate-700">
                      Khách: <strong>{customer.tenKhachHang}</strong> ({customer.soDienThoai})
                    </span>
                    <button
                      onClick={() => setCustomer(null)}
                      className="text-red-500 hover:text-red-700 text-[10px] underline ml-1"
                    >
                      Bỏ chọn
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between w-full">
                    <span className="text-xs text-slate-500">Khách lẻ (Chưa gắn khách)</span>
                    <button
                      type="button"
                      onClick={() => setShowCustomerModal(true)}
                      className="px-2.5 py-1 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center space-x-1 shadow-2xs"
                    >
                      <UserPlus className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Gắn khách hàng</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Cart Table */}
              <div className="p-4 flex-1 overflow-y-auto max-h-[300px] space-y-2.5 divide-y divide-slate-100">
                {cart.length === 0 ? (
                  <div className="py-12 text-center text-slate-400 space-y-2">
                    <ShoppingCart className="w-10 h-10 mx-auto stroke-1" />
                    <p className="text-xs">Giỏ hàng đang trống. Quét mã hoặc chọn sản phẩm bên trái.</p>
                  </div>
                ) : (
                  cart.map((item, idx) => {
                    const prod = products.find((p) => p.maSanPham === item.maSanPham);
                    return (
                      <div key={idx} className="pt-2 first:pt-0 space-y-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="text-xs font-semibold text-slate-800 leading-snug">
                              {item.tenSanPham}
                            </h4>
                            <div className="flex items-center space-x-2 mt-1">
                              {/* Unit dropdown */}
                              <select
                                value={item.maDonViBan}
                                onChange={(e) => updateCartUnit(idx, e.target.value)}
                                className="px-2 py-0.5 border border-slate-200 rounded text-[11px] bg-slate-50 font-medium text-slate-700"
                              >
                                {prod?.donViQuyDois?.map((u: any) => (
                                  <option key={u.maDonVi} value={u.maDonVi}>
                                    {u.tenDonVi} ({formatVND(u.giaBan)})
                                  </option>
                                ))}
                              </select>
                              <span className="text-xs text-slate-500">
                                x {formatVND(item.donGia)}
                              </span>
                            </div>
                          </div>

                          <span className="text-xs font-bold text-emerald-700">
                            {formatVND(item.thanhTien)}
                          </span>
                        </div>

                        <div className="flex items-center justify-between pt-1">
                          {/* Quantity control */}
                          <div className="flex items-center space-x-1.5 border border-slate-200 rounded-lg p-0.5 bg-slate-50">
                            <button
                              onClick={() => updateCartQty(idx, item.soLuong - 1)}
                              className="p-1 hover:bg-slate-200 rounded text-slate-600"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <input
                              type="number"
                              min={1}
                              value={item.soLuong}
                              onChange={(e) =>
                                updateCartQty(idx, parseInt(e.target.value, 10) || 1)
                              }
                              className="w-10 text-center text-xs font-bold bg-transparent focus:outline-none"
                            />
                            <button
                              onClick={() => updateCartQty(idx, item.soLuong + 1)}
                              className="p-1 hover:bg-slate-200 rounded text-slate-600"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <button
                            onClick={() => removeCartItem(idx)}
                            className="p-1 text-slate-400 hover:text-red-600 transition"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Checkout Panel */}
              <div className="p-4 border-t border-slate-200 bg-slate-50 space-y-3">
                <div className="flex justify-between items-center text-sm font-bold text-slate-800">
                  <span>TỔNG TIỀN THANH TOÁN:</span>
                  <span className="text-xl text-emerald-700">{formatVND(totalAmount)}</span>
                </div>

                {/* Payment method selector */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('Tiền mặt')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center space-x-1.5 transition ${
                      paymentMethod === 'Tiền mặt'
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                        : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <Banknote className="w-4 h-4" />
                    <span>Tiền mặt</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setPaymentMethod('Chuyển khoản');
                      setShowQRModal(true);
                    }}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center space-x-1.5 transition ${
                      paymentMethod === 'Chuyển khoản'
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                        : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Chuyển khoản</span>
                  </button>
                </div>

                {/* Details based on payment method */}
                {paymentMethod === 'Tiền mặt' ? (
                  <div className="space-y-2 bg-white p-3 rounded-xl border border-slate-200">
                    <div className="flex items-center justify-between text-xs">
                      <label className="font-semibold text-slate-700">Tiền khách đưa:</label>
                      <input
                        type="number"
                        value={tienKhachDua}
                        onChange={(e) => setTienKhachDua(e.target.value)}
                        placeholder="Nhập số tiền..."
                        className="w-36 px-2.5 py-1 border border-slate-300 rounded-lg text-right font-bold text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      />
                    </div>
                    <div className="flex items-center justify-between text-xs border-t border-slate-100 pt-1.5">
                      <span className="text-slate-500">Tiền thừa trả khách:</span>
                      <span className="font-bold text-emerald-700 text-sm">
                        {formatVND(changeAmount)}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="bg-blue-50 border border-blue-200 p-3 rounded-xl space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-blue-900">Quét mã QR Ngân hàng:</span>
                      <button
                        type="button"
                        onClick={() => setShowQRModal(true)}
                        className="text-blue-700 hover:text-blue-800 font-bold underline flex items-center space-x-1"
                      >
                        <QrCode className="w-3.5 h-3.5" />
                        <span>Xem mã QR</span>
                      </button>
                    </div>
                    <label className="flex items-center space-x-2 cursor-pointer pt-1 border-t border-blue-200">
                      <input
                        type="checkbox"
                        checked={transferConfirmed}
                        onChange={(e) => setTransferConfirmed(e.target.checked)}
                        className="w-4 h-4 rounded text-blue-600"
                      />
                      <span className="font-medium text-slate-800">
                        Chủ cửa hàng xác nhận đã nhận đủ tiền chuyển khoản
                      </span>
                    </label>
                  </div>
                )}

                {/* Submit button */}
                <button
                  type="button"
                  disabled={submitting || cart.length === 0}
                  onClick={handleCheckout}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white rounded-xl text-sm font-bold shadow-md shadow-emerald-200 transition-all flex items-center justify-center space-x-2"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  <span>{submitting ? 'Đang xử lý...' : 'Hoàn tất thanh toán'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <CustomerSearchModal
        isOpen={showCustomerModal}
        onClose={() => setShowCustomerModal(false)}
        onSelectCustomer={(cust) => setCustomer(cust)}
      />

      <QRPaymentModal
        isOpen={showQRModal}
        onClose={() => setShowQRModal(false)}
        amount={totalAmount}
        onConfirmReceived={() => setTransferConfirmed(true)}
      />

      <ReceiptModal
        isOpen={showReceiptModal}
        onClose={() => setShowReceiptModal(false)}
        invoice={successInvoice}
      />
    </AppLayout>
  );
}
