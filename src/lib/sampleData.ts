import bcrypt from 'bcryptjs';

export interface InitialData {
  accounts: any[];
  categories: any[];
  suppliers: any[];
  products: any[];
  units: any[];
  importTickets: any[];
  importDetails: any[];
  priceHistories: any[];
  customers: any[];
  invoices: any[];
  invoiceDetails: any[];
  allocations: any[];
  exchangeReturns: any[];
  exchangeReturnDetails: any[];
}

export function generateSampleData(): InitialData {
  const now = new Date();
  const d = (offsetDays: number) => new Date(now.getTime() + offsetDays * 86400000);

  // Mật khẩu băm cho 'QuynhNhu@2026'
  // $2a$10$w...
  const hashedPassword = bcrypt.hashSync('QuynhNhu@2026', 10);

  const accounts = [
    {
      maTaiKhoan: 'TK0001',
      tenDangNhap: 'chucuahang',
      matKhau: hashedPassword,
    },
  ];

  const categories = [
    { maDanhMuc: 'DM0001', tenDanhMuc: 'Mì & Thực phẩm ăn liền' },
    { maDanhMuc: 'DM0002', tenDanhMuc: 'Nước giải khát' },
    { maDanhMuc: 'DM0003', tenDanhMuc: 'Sữa & Sản phẩm từ sữa' },
    { maDanhMuc: 'DM0004', tenDanhMuc: 'Gia vị & Dầu ăn' },
    { maDanhMuc: 'DM0005', tenDanhMuc: 'Bánh kẹo & Ăn vặt' },
    { maDanhMuc: 'DM0006', tenDanhMuc: 'Hóa mỹ phẩm & Đồ gia dụng' },
  ];

  const suppliers = [
    {
      maNhaCungCap: 'NCC001',
      tenNhaCungCap: 'Công ty TNHH Phân phối Acecook Miền Trung',
      soDienThoai: '0905123456',
      email: 'acecook.mientrung@gmail.com',
      diaChi: '120 Điện Biên Phủ, Thanh Khê, Đà Nẵng',
      danhMuc: 'Mì & Thực phẩm ăn liền',
      trangThai: 'Đang hợp tác',
      moTa: 'Cung cấp mì gói, phở, bún ăn liền chính hãng',
    },
    {
      maNhaCungCap: 'NCC002',
      tenNhaCungCap: 'Đại lý Nước giải khát & Sữa Quỳnh Trang',
      soDienThoai: '0913987654',
      email: 'quynhtrang.beverage@gmail.com',
      diaChi: '45 Nguyễn Lương Bằng, Liên Chiểu, Đà Nẵng',
      danhMuc: 'Nước giải khát',
      trangThai: 'Đang hợp tác',
      moTa: 'Đại lý cấp 1 Coca-Cola, Pepsi, Vinamilk',
    },
    {
      maNhaCungCap: 'NCC003',
      tenNhaCungCap: 'Công ty Thực phẩm Gia vị An Lạc',
      soDienThoai: '0935555777',
      email: 'anlac.food@gmail.com',
      diaChi: '78 Trường Chinh, Cẩm Lệ, Đà Nẵng',
      danhMuc: 'Gia vị & Dầu ăn',
      trangThai: 'Ngừng hợp tác',
      moTa: 'Đã phát sinh phiếu nhập trước đây, hiện đã ngừng hợp tác',
    },
    {
      maNhaCungCap: 'NCC004',
      tenNhaCungCap: 'Tổng kho Gia dụng Hóa phẩm Mai Linh',
      soDienThoai: '0988666333',
      email: 'mailinh.store@gmail.com',
      diaChi: '234 Cách Mạng Tháng 8, Hải Châu, Đà Nẵng',
      danhMuc: 'Hóa mỹ phẩm & Đồ gia dụng',
      trangThai: 'Đang hợp tác',
      moTa: 'Nhà cung cấp mới, chưa có giao dịch nhập hàng (cho phép xóa test UC2.3)',
    },
  ];

  // Sản phẩm:
  // SP0001: Mì Hảo Hảo Tôm Chua Cay (Có quản lý hạn, đa đơn vị: Gói, Lốc 10, Thùng 30)
  // SP0002: Coca-Cola Lon 330ml (Có quản lý hạn, đa đơn vị: Lon, Lốc 6, Thùng 24)
  // SP0003: Sữa tươi Vinamilk có đường 180ml (Có quản lý hạn, có 2 chi tiết nhập khác hạn: 1 hạn gần sắp hết, 1 hạn xa)
  // SP0004: Sữa chua uống Fristi cam 80ml (Có quản lý hạn, có lô ĐÃ HẾT HẠN)
  // SP0005: Nước mắm Nam Ngư Đệ Nhị 900ml (Không hạn/hoặc có hạn, TỒN THẤP: tồn 3 chai, min 5)
  // SP0006: Dầu ăn Tường An Cooking Oil 1L (Không hạn, TỒN THẤP: tồn 2 chai, min 10)
  // SP0007: Nước xả vải Comfort Ban Mai 800ml (Không quản lý hạn, Hóa mỹ phẩm, chưa có giao dịch -> test xóa UC1.3)
  const products = [
    {
      maSanPham: 'SP0001',
      tenSanPham: 'Mì Hảo Hảo Tôm Chua Cay 75g',
      maDanhMuc: 'DM0001',
      maVach: '893456124001',
      donViTinh: 'Gói',
      giaNhapBinhQuan: 3800,
      soLuongTon: 150, // 150 gói (tương đương 5 thùng)
      mucTonToiThieu: 30,
      quanLyHanSuDung: true,
      trangThai: 'Đang kinh doanh',
      moTa: 'Mì gói Acecook tôm chua cay truyền thống',
    },
    {
      maSanPham: 'SP0002',
      tenSanPham: 'Nước ngọt Coca-Cola Sleek 330ml',
      maDanhMuc: 'DM0002',
      maVach: '893500110002',
      donViTinh: 'Lon',
      giaNhapBinhQuan: 8200,
      soLuongTon: 96, // 96 lon (4 thùng)
      mucTonToiThieu: 24,
      quanLyHanSuDung: true,
      trangThai: 'Đang kinh doanh',
      moTa: 'Nước giải khát có ga Coca-Cola chính hãng',
    },
    {
      maSanPham: 'SP0003',
      tenSanPham: 'Sữa tươi tiệt trùng Vinamilk có đường 180ml',
      maDanhMuc: 'DM0003',
      maVach: '893467310003',
      donViTinh: 'Hộp',
      giaNhapBinhQuan: 7000,
      soLuongTon: 80, // 30 hộp lô sắp hết hạn (12 ngày), 50 hộp lô hạn xa (180 ngày)
      mucTonToiThieu: 20,
      quanLyHanSuDung: true,
      trangThai: 'Đang kinh doanh',
      moTa: 'Sữa tươi 100% nguyên chất có đường',
    },
    {
      maSanPham: 'SP0004',
      tenSanPham: 'Sữa chua uống Fristi hương Dâu 80ml',
      maDanhMuc: 'DM0003',
      maVach: '893467390004',
      donViTinh: 'Chai',
      giaNhapBinhQuan: 4000,
      soLuongTon: 20, // 20 chai ĐÃ HẾT HẠN (hạn 5 ngày trước)
      mucTonToiThieu: 10,
      quanLyHanSuDung: true,
      trangThai: 'Đang kinh doanh',
      moTa: 'Sữa chua uống hương dâu cho trẻ em',
    },
    {
      maSanPham: 'SP0005',
      tenSanPham: 'Nước mắm Nam Ngư Đệ Nhị chai 900ml',
      maDanhMuc: 'DM0004',
      maVach: '893601736005',
      donViTinh: 'Chai',
      giaNhapBinhQuan: 22000,
      soLuongTon: 3, // Dưới mức tối thiểu 5
      mucTonToiThieu: 5,
      quanLyHanSuDung: false,
      trangThai: 'Đang kinh doanh',
      moTa: 'Nước mắm thơm ngon Đệ Nhị Masan',
    },
    {
      maSanPham: 'SP0006',
      tenSanPham: 'Dầu thực vật tinh luyện Tường An Cooking Oil 1L',
      maDanhMuc: 'DM0004',
      maVach: '893480402006',
      donViTinh: 'Chai',
      giaNhapBinhQuan: 42000,
      soLuongTon: 2, // Dưới mức tối thiểu 10
      mucTonToiThieu: 10,
      quanLyHanSuDung: false,
      trangThai: 'Đang kinh doanh',
      moTa: 'Dầu ăn dinh dưỡng cho gia đình',
    },
    {
      maSanPham: 'SP0007',
      tenSanPham: 'Nước xả vải Comfort Ban Mai túi 800ml',
      maDanhMuc: 'DM0006',
      maVach: '893486811007',
      donViTinh: 'Túi',
      giaNhapBinhQuan: 55000,
      soLuongTon: 0, // Không có tồn kho, không có giao dịch -> xóa được
      mucTonToiThieu: 5,
      quanLyHanSuDung: false,
      trangThai: 'Đang kinh doanh',
      moTa: 'Sản phẩm mẫu chưa nhập kho để kiểm thử chức năng Xóa sản phẩm (UC1.3)',
    },
  ];

  // Đơn vị quy đổi:
  const units = [
    // SP0001
    { maDonVi: 'DV0001', maSanPham: 'SP0001', tenDonVi: 'Gói', heSoQuyDoi: 1, giaBan: 4500 },
    { maDonVi: 'DV0002', maSanPham: 'SP0001', tenDonVi: 'Lốc (10 gói)', heSoQuyDoi: 10, giaBan: 43000 },
    { maDonVi: 'DV0003', maSanPham: 'SP0001', tenDonVi: 'Thùng (30 gói)', heSoQuyDoi: 30, giaBan: 125000 },
    // SP0002
    { maDonVi: 'DV0004', maSanPham: 'SP0002', tenDonVi: 'Lon', heSoQuyDoi: 1, giaBan: 10000 },
    { maDonVi: 'DV0005', maSanPham: 'SP0002', tenDonVi: 'Lốc (6 lon)', heSoQuyDoi: 6, giaBan: 58000 },
    { maDonVi: 'DV0006', maSanPham: 'SP0002', tenDonVi: 'Thùng (24 lon)', heSoQuyDoi: 24, giaBan: 230000 },
    // SP0003
    { maDonVi: 'DV0007', maSanPham: 'SP0003', tenDonVi: 'Hộp', heSoQuyDoi: 1, giaBan: 8500 },
    { maDonVi: 'DV0008', maSanPham: 'SP0003', tenDonVi: 'Lốc (4 hộp)', heSoQuyDoi: 4, giaBan: 33000 },
    { maDonVi: 'DV0009', maSanPham: 'SP0003', tenDonVi: 'Thùng (48 hộp)', heSoQuyDoi: 48, giaBan: 390000 },
    // SP0004
    { maDonVi: 'DV0010', maSanPham: 'SP0004', tenDonVi: 'Chai', heSoQuyDoi: 1, giaBan: 5000 },
    { maDonVi: 'DV0011', maSanPham: 'SP0004', tenDonVi: 'Lốc (6 chai)', heSoQuyDoi: 6, giaBan: 29000 },
    // SP0005
    { maDonVi: 'DV0012', maSanPham: 'SP0005', tenDonVi: 'Chai', heSoQuyDoi: 1, giaBan: 26000 },
    // SP0006
    { maDonVi: 'DV0013', maSanPham: 'SP0006', tenDonVi: 'Chai', heSoQuyDoi: 1, giaBan: 48000 },
    // SP0007
    { maDonVi: 'DV0014', maSanPham: 'SP0007', tenDonVi: 'Túi', heSoQuyDoi: 1, giaBan: 62000 },
  ];

  const priceHistories = [
    {
      maLichSu: 'LS0001',
      maDonVi: 'DV0001',
      giaCu: 4200,
      giaMoi: 4500,
      thoiDiemThayDoi: d(-10),
    },
    {
      maLichSu: 'LS0002',
      maDonVi: 'DV0004',
      giaCu: 9500,
      giaMoi: 10000,
      thoiDiemThayDoi: d(-15),
    },
  ];

  // Khách hàng:
  // KH0001: đã mua hàng
  // KH0002: chưa mua hàng ("Chưa có lịch sử mua hàng", xóa được UC5.3)
  // KH0003: đã mua hàng
  const customers = [
    {
      maKhachHang: 'KH0001',
      tenKhachHang: 'Nguyễn Văn An',
      soDienThoai: '0905123456',
      diaChi: '15 Lê Duẩn, Hải Châu, Đà Nẵng',
    },
    {
      maKhachHang: 'KH0002',
      tenKhachHang: 'Trần Thị Bích',
      soDienThoai: '0912345678',
      diaChi: '88 Hoàng Diệu, Hải Châu, Đà Nẵng',
    },
    {
      maKhachHang: 'KH0003',
      tenKhachHang: 'Lê Hoàng Nam',
      soDienThoai: '0987654321',
      diaChi: '24 Nguyễn Văn Linh, Thanh Khê, Đà Nẵng',
    },
  ];

  // Phiếu nhập hàng mẫu:
  // PN0001: Nhập SP0001 (180 gói, 6 thùng), SP0002 (120 lon, 5 thùng) từ NCC001, NCC002
  // PN0002: Nhập SP0003 Lô 1 (hạn gần: 12 ngày nữa, nhập 50 hộp), SP0004 (20 chai, hạn 5 ngày trước - HẾT HẠN)
  // PN0003: Nhập SP0003 Lô 2 (hạn xa: 180 ngày nữa, nhập 60 hộp), SP0005 (10 chai), SP0006 (10 chai)
  const importTickets = [
    {
      maPhieuNhap: 'PN0001',
      maNhaCungCap: 'NCC001',
      ngayNhap: d(-20),
      tongTien: 1668000,
    },
    {
      maPhieuNhap: 'PN0002',
      maNhaCungCap: 'NCC002',
      ngayNhap: d(-15),
      tongTien: 454000,
    },
    {
      maPhieuNhap: 'PN0003',
      maNhaCungCap: 'NCC002',
      ngayNhap: d(-7),
      tongTien: 1060000,
    },
  ];

  // Chi tiết nhập hàng:
  // Có soLuongCon tính theo đơn vị cơ sở
  const importDetails = [
    // PN0001
    {
      maChiTietNhap: 'CTN001',
      maPhieuNhap: 'PN0001',
      maSanPham: 'SP0001',
      maDonViNhap: 'DV0003', // Thùng (30 gói)
      tyLeQuyDoi: 30,
      soLuongNhap: 6, // 6 thùng = 180 gói
      soLuongCon: 150, // đã bán 30 gói, còn 150 gói
      giaNhap: 114000, // 3800 * 30
      thanhTien: 684000,
      hanSuDung: d(150),
    },
    {
      maChiTietNhap: 'CTN002',
      maPhieuNhap: 'PN0001',
      maSanPham: 'SP0002',
      maDonViNhap: 'DV0006', // Thùng (24 lon)
      tyLeQuyDoi: 24,
      soLuongNhap: 5, // 5 thùng = 120 lon
      soLuongCon: 96, // đã bán 24 lon, còn 96 lon
      giaNhap: 196800, // 8200 * 24
      thanhTien: 984000,
      hanSuDung: d(240),
    },
    // PN0002
    {
      maChiTietNhap: 'CTN003',
      maPhieuNhap: 'PN0002',
      maSanPham: 'SP0003',
      maDonViNhap: 'DV0007', // Hộp
      tyLeQuyDoi: 1,
      soLuongNhap: 50,
      soLuongCon: 30, // ĐÃ BÁN 20 hộp, còn 30 hộp SẮP HẾT HẠN (12 ngày)
      giaNhap: 7000,
      thanhTien: 350000,
      hanSuDung: d(12), // SẮP HẾT HẠN
    },
    {
      maChiTietNhap: 'CTN004',
      maPhieuNhap: 'PN0002',
      maSanPham: 'SP0004',
      maDonViNhap: 'DV0010', // Chai
      tyLeQuyDoi: 1,
      soLuongNhap: 26,
      soLuongCon: 20, // Đã bán 6 chai ở HD0001, còn 20 chai ĐÃ HẾT HẠN
      giaNhap: 4000,
      thanhTien: 104000,
      hanSuDung: d(-5), // ĐÃ HẾT HẠN
    },
    // PN0003
    {
      maChiTietNhap: 'CTN005',
      maPhieuNhap: 'PN0003',
      maSanPham: 'SP0003',
      maDonViNhap: 'DV0007', // Hộp (Lô 2 hạn xa)
      tyLeQuyDoi: 1,
      soLuongNhap: 60,
      soLuongCon: 50, // ĐÃ BÁN 10 hộp, còn 50 hộp
      giaNhap: 7000,
      thanhTien: 420000,
      hanSuDung: d(180), // HẠN XA
    },
    {
      maChiTietNhap: 'CTN006',
      maPhieuNhap: 'PN0003',
      maSanPham: 'SP0005',
      maDonViNhap: 'DV0012', // Chai
      tyLeQuyDoi: 1,
      soLuongNhap: 10,
      soLuongCon: 3, // đã bán 7, còn 3
      giaNhap: 22000,
      thanhTien: 220000,
      hanSuDung: null,
    },
    {
      maChiTietNhap: 'CTN007',
      maPhieuNhap: 'PN0003',
      maSanPham: 'SP0006',
      maDonViNhap: 'DV0013', // Chai
      tyLeQuyDoi: 1,
      soLuongNhap: 10,
      soLuongCon: 2, // đã bán 8, còn 2
      giaNhap: 42000,
      thanhTien: 420000,
      hanSuDung: null,
    },
  ];

  // Hóa đơn mẫu:
  // HD0001: Khách KH0001, đã thanh toán tiền mặt (có thể dùng để test đổi/trả hoặc hủy)
  // HD0002: Khách KH0003, ĐÃ HỦY (lý do "Khách đổi ý không lấy hàng nữa")
  // HD0003: Khách vãng lai (không gắn khách), ĐÃ CÓ PHIẾU ĐỔI TRẢ DT0001 (không được hủy trực tiếp)
  const invoices = [
    {
      maHoaDon: 'HD0001',
      maKhachHang: 'KH0001',
      ngayGioBan: d(-5),
      tongTien: 181000,
      phuongThucThanhToan: 'Tiền mặt',
      tienKhachDua: 200000,
      tienThua: 19000,
      trangThai: 'Đã thanh toán',
      lyDoHuy: null,
      thoiGianHuy: null,
    },
    {
      maHoaDon: 'HD0002',
      maKhachHang: 'KH0003',
      ngayGioBan: d(-3),
      tongTien: 125000,
      phuongThucThanhToan: 'Chuyển khoản',
      tienKhachDua: 125000,
      tienThua: 0,
      trangThai: 'Đã hủy',
      lyDoHuy: 'Khách đổi ý không lấy hàng nữa',
      thoiGianHuy: d(-3),
    },
    {
      maHoaDon: 'HD0003',
      maKhachHang: null, // Khách lẻ
      ngayGioBan: d(-2),
      tongTien: 288000,
      phuongThucThanhToan: 'Tiền mặt',
      tienKhachDua: 300000,
      tienThua: 12000,
      trangThai: 'Đã thanh toán',
      lyDoHuy: null,
      thoiGianHuy: null,
    },
  ];

  const invoiceDetails = [
    // HD0001: 1 Thùng Mì Hảo Hảo (125.000) + 1 Lốc Coca (58.000) -> tổng 183.000 hoặc chi tiết:
    {
      maChiTietHoaDon: 'CTH001',
      maHoaDon: 'HD0001',
      maSanPham: 'SP0001',
      maDonViBan: 'DV0002', // 2 Lốc (20 gói)
      tyLeQuyDoi: 10,
      soLuong: 2,
      donGia: 43000,
      giaVonBinhQuan: 3800,
      thanhTien: 86000,
    },
    {
      maChiTietHoaDon: 'CTH002',
      maHoaDon: 'HD0001',
      maSanPham: 'SP0003',
      maDonViBan: 'DV0008', // 2 Lốc sữa (8 hộp)
      tyLeQuyDoi: 4,
      soLuong: 2,
      donGia: 33000,
      giaVonBinhQuan: 7000,
      thanhTien: 66000,
    },
    {
      maChiTietHoaDon: 'CTH003',
      maHoaDon: 'HD0001',
      maSanPham: 'SP0004',
      maDonViBan: 'DV0011', // Lốc (chưa hết hạn lúc bán cách đây 5 ngày)
      tyLeQuyDoi: 6,
      soLuong: 1, // 6 chai
      donGia: 29000,
      giaVonBinhQuan: 4000,
      thanhTien: 29000,
    },
    // HD0002 (Đã hủy): 1 Thùng Mì Hảo Hảo
    {
      maChiTietHoaDon: 'CTH004',
      maHoaDon: 'HD0002',
      maSanPham: 'SP0001',
      maDonViBan: 'DV0003', // 1 Thùng
      tyLeQuyDoi: 30,
      soLuong: 1,
      donGia: 125000,
      giaVonBinhQuan: 3800,
      thanhTien: 125000,
    },
    // HD0003 (Có đổi trả DT0001): 1 Thùng Coca (230.000) + 1 Lốc Coca (58.000) = 288.000
    {
      maChiTietHoaDon: 'CTH005',
      maHoaDon: 'HD0003',
      maSanPham: 'SP0002',
      maDonViBan: 'DV0006', // 1 Thùng 24 lon
      tyLeQuyDoi: 24,
      soLuong: 1,
      donGia: 230000,
      giaVonBinhQuan: 8200,
      thanhTien: 230000,
    },
    {
      maChiTietHoaDon: 'CTH006',
      maHoaDon: 'HD0003',
      maSanPham: 'SP0002',
      maDonViBan: 'DV0005', // 1 Lốc 6 lon
      tyLeQuyDoi: 6,
      soLuong: 1,
      donGia: 58000,
      giaVonBinhQuan: 8200,
      thanhTien: 58000,
    },
  ];

  // Phân bổ xuất kho cho các hóa đơn:
  const allocations = [
    // HD0001
    {
      maPhanBo: 'PB0001',
      maChiTietNhap: 'CTN001',
      maChiTietHoaDon: 'CTH001',
      maChiTietDoiTra: null,
      soLuongXuat: 20, // 20 gói
    },
    {
      maPhanBo: 'PB0002',
      maChiTietNhap: 'CTN003', // Lô hạn gần
      maChiTietHoaDon: 'CTH002',
      maChiTietDoiTra: null,
      soLuongXuat: 8, // 8 hộp
    },
    {
      maPhanBo: 'PB0005',
      maChiTietNhap: 'CTN004',
      maChiTietHoaDon: 'CTH003',
      maChiTietDoiTra: null,
      soLuongXuat: 6, // 6 chai
    },
    // HD0003
    {
      maPhanBo: 'PB0003',
      maChiTietNhap: 'CTN002',
      maChiTietHoaDon: 'CTH005',
      maChiTietDoiTra: null,
      soLuongXuat: 24,
    },
    {
      maPhanBo: 'PB0004',
      maChiTietNhap: 'CTN002',
      maChiTietHoaDon: 'CTH006',
      maChiTietDoiTra: null,
      soLuongXuat: 6,
    },
  ];

  // Phiếu đổi trả mẫu:
  // DT0001 gắn với HD0003: Trả 1 Lốc Coca (58.000) nhập lại kho, Đổi 1 Thùng Mì Hảo Hảo (125.000), Chênh lệch thu thêm 67.000
  const exchangeReturns = [
    {
      maPhieuDoiTra: 'DT0001',
      maHoaDon: 'HD0003',
      ngayGioDoiTra: d(-1),
      tongTienHangTra: 58000,
      tongTienHangDoi: 125000,
      tienChenhLech: 67000,
      trangThai: 'Hoàn tất',
    },
  ];

  const exchangeReturnDetails = [
    {
      maChiTiet: 'CTD001',
      maPhieuDoiTra: 'DT0001',
      maChiTietHoaDon: 'CTH006',
      maDonVi: 'DV0005', // Lốc
      maSanPham: 'SP0002',
      maPhanBo: 'PB0004',
      loaiDong: 'Hàng trả',
      tyLeQuyDoi: 6,
      soLuong: 1,
      donGia: 58000,
      giaVonBinhQuan: 8200,
      thanhTien: 58000,
      duocNhapLaiKho: true,
    },
    {
      maChiTiet: 'CTD002',
      maPhieuDoiTra: 'DT0001',
      maChiTietHoaDon: null,
      maDonVi: 'DV0003', // Thùng
      maSanPham: 'SP0001',
      maPhanBo: null,
      loaiDong: 'Hàng đổi',
      tyLeQuyDoi: 30,
      soLuong: 1,
      donGia: 125000,
      giaVonBinhQuan: 3800,
      thanhTien: 125000,
      duocNhapLaiKho: false,
    },
  ];

  return {
    accounts,
    categories,
    suppliers,
    products,
    units,
    priceHistories,
    customers,
    importTickets,
    importDetails,
    invoices,
    invoiceDetails,
    allocations,
    exchangeReturns,
    exchangeReturnDetails,
  };
}
