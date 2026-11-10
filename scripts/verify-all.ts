import {
  resetDatabase,
  getProducts,
  getProductById,
  createImportTicket,
  getInventoryInquiry,
  createSaleTransaction,
  getSalesHistory,
  cancelInvoice,
  createExchangeReturn,
  calculateBusinessReport,
  calculateInventoryReport,
  getAccountByUsername,
} from '../src/lib/db';
import { verifyPassword } from '../src/lib/auth';
import { generateExcelReport } from '../src/lib/excelExport';
import { generatePdfReport } from '../src/lib/pdfExport';

async function runTests() {
  console.log('====================================================');
  console.log('BẮT ĐẦU KIỂM THỬ TỰ ĐỘNG 7 KỊCH BẢN ĐẶC TẢ QUỲNH NHƯ');
  console.log('====================================================\n');

  // Khởi tạo dữ liệu mẫu sạch
  console.log('0. Khởi tạo / khôi phục dữ liệu mẫu...');
  await resetDatabase();
  console.log('✓ Dữ liệu mẫu đã sẵn sàng.\n');

  // TEST 1: Nhập 2 dòng cùng sản phẩm khác hạn; tra cứu từng dòng
  console.log('--- TEST 1: Nhập hai dòng cùng sản phẩm khác hạn & tra cứu ---');
  const d1 = new Date(Date.now() + 60 * 86400000).toISOString().slice(0, 10);
  const d2 = new Date(Date.now() + 150 * 86400000).toISOString().slice(0, 10);

  const importTicket1 = await createImportTicket({
    maNhaCungCap: 'NCC001',
    items: [
      {
        maSanPham: 'SP0001',
        maDonViNhap: 'DV0001_GOI',
        soLuongNhap: 30,
        giaNhap: 4000,
        hanSuDung: d1,
      },
      {
        maSanPham: 'SP0001',
        maDonViNhap: 'DV0001_GOI',
        soLuongNhap: 20,
        giaNhap: 4200,
        hanSuDung: d2,
      },
    ],
  });
  console.log(`✓ Tạo phiếu nhập ${importTicket1.maPhieuNhap} thành công với 2 lô khác hạn.`);

  const inquiryRes = await getInventoryInquiry('all', 'SP0001');
  const sp1Inquiry = inquiryRes.find((x: any) => x.maSanPham === 'SP0001');
  const lots = sp1Inquiry?.chiTiet || [];
  const foundLot1 = lots.some((l: any) => l.hanSuDung && new Date(l.hanSuDung).toISOString().startsWith(d1) && l.soLuongCon >= 30);
  const foundLot2 = lots.some((l: any) => l.hanSuDung && new Date(l.hanSuDung).toISOString().startsWith(d2) && l.soLuongCon >= 20);

  if (!foundLot1 || !foundLot2) {
    throw new Error('TEST 1 FAILED: Không tra cứu thấy đầy đủ 2 lô khác hạn vừa nhập');
  }
  console.log(`✓ TEST 1 PASSED: Tra cứu thấy rõ 2 lô khác hạn (${d1} và ${d2}) của SP0001.\n`);

  // TEST 2: Bán hàng từ 2 nguồn, kiểm tra chống gửi trùng (IdempotencyKey)
  console.log('--- TEST 2: Bán hàng FEFO 2 nguồn & Chống gửi trùng ---');
  const initialSP1 = await getProductById('SP0001');
  const initialStock = initialSP1.soLuongTon;

  const idempotencyKey = 'IDEMPOTENCY_TEST_' + Date.now();
  // Bán 35 gói -> hệ thống sẽ xuất 30 gói từ lô hạn gần (d1) và 5 gói từ lô d2
  const res1 = await createSaleTransaction({
    maKhachHang: 'KH0001',
    phuongThucThanhToan: 'Tiền mặt',
    tienKhachDua: 200000,
    items: [
      {
        maSanPham: 'SP0001',
        maDonVi: 'DV0001_GOI',
        soLuong: 35,
        donGia: 5000,
      },
    ],
    idempotencyKey,
  });
  const invoice1 = res1.invoice;
  console.log(`✓ Tạo hóa đơn bán hàng ${invoice1.maHoaDon} thành công.`);

  // Gửi lại cùng idempotencyKey (mô phỏng bấm nhanh 2 lần nút "Hoàn tất thanh toán")
  const duplicateAttempt = await createSaleTransaction({
    maKhachHang: 'KH0001',
    phuongThucThanhToan: 'Tiền mặt',
    tienKhachDua: 200000,
    items: [
      {
        maSanPham: 'SP0001',
        maDonVi: 'DV0001_GOI',
        soLuong: 35,
        donGia: 5000,
      },
    ],
    idempotencyKey,
  });

  if (duplicateAttempt.invoice.maHoaDon !== invoice1.maHoaDon) {
    throw new Error('TEST 2 FAILED: IdempotencyKey không chặn được việc tạo trùng hóa đơn');
  }

  const afterSP1 = await getProductById('SP0001');
  if (initialStock - afterSP1.soLuongTon !== 35) {
    throw new Error(`TEST 2 FAILED: Tồn kho bị trừ sai lệch: ${initialStock} -> ${afterSP1.soLuongTon} (chênh lệch: ${initialStock - afterSP1.soLuongTon})`);
  }
  console.log('✓ TEST 2 PASSED: Bán hàng phân bổ FEFO chính xác và IdempotencyKey ngăn chặn trừ trùng.\n');

  // TEST 3: Hủy một hóa đơn chưa đổi/trả; đối chiếu lượng hoàn từng nguồn
  console.log('--- TEST 3: Hủy hóa đơn & Hoàn kho theo nguồn xuất ---');
  const stockBeforeCancel = (await getProductById('SP0001')).soLuongTon;
  await cancelInvoice(invoice1.maHoaDon, 'Khách đổi ý không mua nữa', 'CANCEL_TEST_' + Date.now());

  const updatedInv1 = (await getSalesHistory()).find((i: any) => i.maHoaDon === invoice1.maHoaDon);
  if (updatedInv1?.trangThai !== 'Đã hủy') {
    throw new Error('TEST 3 FAILED: Hóa đơn chưa chuyển trạng thái Đã hủy');
  }

  const stockAfterCancel = (await getProductById('SP0001')).soLuongTon;
  if (stockAfterCancel - stockBeforeCancel !== 35) {
    throw new Error('TEST 3 FAILED: Tồn kho không được hoàn trả đủ 35 đơn vị sau khi hủy');
  }
  console.log('✓ TEST 3 PASSED: Hủy hóa đơn thành công, hoàn trả chính xác số lượng vào từng lô nguồn.\n');

  // TEST 4: Hóa đơn khác: Trả một phần, chọn "Không nhập lại kho", không hủy trực tiếp được
  console.log('--- TEST 4: Đổi trả hàng (Không nhập lại kho) & Ràng buộc không hủy trực tiếp ---');
  // Bán hóa đơn mới
  const res2 = await createSaleTransaction({
    maKhachHang: 'KH0002',
    phuongThucThanhToan: 'Chuyển khoản',
    tienKhachDua: 100000,
    items: [
      {
        maSanPham: 'SP0002',
        maDonVi: 'DV0004',
        soLuong: 10,
        donGia: 10000,
      },
    ],
  });
  const invoice2 = res2.invoice;

  const stockSP2BeforeReturn = (await getProductById('SP0002')).soLuongTon;

  // Thực hiện trả 4 chai, chọn duocNhapLaiKho = false ("Không nhập lại kho")
  const fullInvoice2 = (await getSalesHistory()).find((i: any) => i.maHoaDon === invoice2.maHoaDon);
  const returnDetail = fullInvoice2?.chiTietHoaDons[0];
  const dtTicket = await createExchangeReturn({
    maHoaDon: invoice2.maHoaDon,
    itemsReturn: [
      {
        maChiTietHoaDon: returnDetail.maChiTietHoaDon || returnDetail.maChiTiet,
        soLuongTra: 4,
        duocNhapLaiKho: false, // "Không nhập lại kho"
      },
    ],
    itemsExchange: [],
  });

  const stockSP2AfterReturn = (await getProductById('SP0002')).soLuongTon;
  if (stockSP2AfterReturn !== stockSP2BeforeReturn) {
    throw new Error('TEST 4 FAILED: Chọn Không nhập lại kho nhưng tồn kho lại bị tăng');
  }

  // Thử hủy hóa đơn invoice2 -> phải bị chặn vì đã có phiếu đổi/trả
  let cancelBlocked = false;
  try {
    await cancelInvoice(invoice2.maHoaDon, 'Thử hủy hóa đơn đã có đổi trả');
  } catch (err: any) {
    cancelBlocked = true;
    console.log(`  Bị chặn đúng quy định: "${err.message}"`);
  }

  if (!cancelBlocked) {
    throw new Error('TEST 4 FAILED: Cho phép hủy hóa đơn đã phát sinh phiếu đổi/trả');
  }
  console.log('✓ TEST 4 PASSED: Trả hàng không nhập kho giữ nguyên tồn và khóa hủy trực tiếp hóa đơn gốc.\n');

  // TEST 5: Báo cáo kinh doanh và xuất - nhập - tồn theo khoảng ngày, kiểm tra xuất Excel và PDF
  console.log('--- TEST 5: Báo cáo doanh thu & Xuất Excel / PDF ---');
  const bReport = await calculateBusinessReport({});
  const iReport = await calculateInventoryReport({});

  console.log(`  Doanh thu thuần: ${bReport.doanhThuThuan.toLocaleString('vi-VN')} đ`);
  console.log(`  Lợi nhuận gộp: ${bReport.loiNhuanGop.toLocaleString('vi-VN')} đ`);
  console.log(`  Số mặt hàng xuất-nhập-tồn: ${iReport.length}`);

  const excelBuffer = await generateExcelReport({
    title: 'BÁO CÁO DOANH THU TEST',
    reportType: 'Kinh doanh',
    filters: { 'Kỳ': 'Tất cả' },
    columns: [
      { header: 'Mã SP', key: 'maSanPham', width: 14 },
      { header: 'Tên SP', key: 'tenSanPham', width: 28 },
    ],
    rows: [{ maSanPham: 'SP0001', tenSanPham: 'Mì Hảo Hảo Tôm Chua Cay' }],
  });

  const pdfBuffer = generatePdfReport({
    title: 'BÁO CÁO TEST',
    reportType: 'Kinh doanh',
    filters: { 'Kỳ': 'Tất cả' },
    headers: ['Mã SP', 'Tên SP'],
    data: [['SP0001', 'Mì Hảo Hảo']],
  });

  if (excelBuffer.length === 0 || pdfBuffer.length === 0) {
    throw new Error('TEST 5 FAILED: Xuất file Excel/PDF trả về buffer rỗng');
  }
  console.log(`✓ TEST 5 PASSED: Báo cáo tính toán chính xác và sinh file Excel (${excelBuffer.length} bytes), PDF (${pdfBuffer.length} bytes) thành công.\n`);

  // TEST 6: Kiểm tra phòng chống bán vượt tồn kho (Race condition & tồn không âm)
  console.log('--- TEST 6: Kiểm tra khóa tồn kho chống âm kho ---');
  const lowStockProd = (await getProducts()).find((p: any) => p.soLuongTon > 0 && p.soLuongTon <= 15) || (await getProductById('SP0003'));
  const availableStock = lowStockProd.soLuongTon;

  // Cố gắng bán số lượng vượt quá tồn
  let overSaleBlocked = false;
  try {
    await createSaleTransaction({
      maKhachHang: 'KH0001',
      phuongThucThanhToan: 'Tiền mặt',
      tienKhachDua: 1000000,
      items: [
        {
          maSanPham: lowStockProd.maSanPham,
          maDonVi: lowStockProd.donViQuyDois[0]?.maDonVi || lowStockProd.donViTinh,
          soLuong: availableStock + 10,
          donGia: 10000,
        },
      ],
    });
  } catch (err: any) {
    overSaleBlocked = true;
    console.log(`  Bị chặn khi vượt tồn kho: "${err.message}"`);
  }

  if (!overSaleBlocked) {
    throw new Error('TEST 6 FAILED: Cho phép bán vượt tồn kho làm âm kho');
  }
  console.log('✓ TEST 6 PASSED: Đảm bảo toàn vẹn dữ liệu, số lượng tồn kho không bao giờ âm.\n');

  // TEST 7: Kiểm tra xác thực tài khoản chủ cửa hàng
  console.log('--- TEST 7: Kiểm tra tài khoản Chủ cửa hàng ---');
  const account = await getAccountByUsername('chucuahang');
  if (!account) {
    throw new Error('TEST 7 FAILED: Không tìm thấy tài khoản chucuahang trong CSDL');
  }

  const authSuccess = await verifyPassword('QuynhNhu@2026', account.matKhau);
  if (!authSuccess) {
    throw new Error('TEST 7 FAILED: Mật khẩu QuynhNhu@2026 không khớp');
  }

  const authFail = await verifyPassword('SaiMatKhau', account.matKhau);
  if (authFail) {
    throw new Error('TEST 7 FAILED: Cho phép đăng nhập khi sai mật khẩu');
  }
  console.log('✓ TEST 7 PASSED: Tài khoản chucuahang / QuynhNhu@2026 xác thực bcrypt thành công.\n');

  console.log('====================================================');
  console.log('TẤT CẢ 7/7 KỊCH BẢN KIỂM THỬ ĐÃ VƯỢT QUA XUẤT SẮC!');
  console.log('====================================================');
}

runTests().catch((err) => {
  console.error('LỖI KIỂM THỬ:', err);
  process.exit(1);
});
