# Hệ Thống Quản Lý Bán Hàng Tạp Hóa Quỳnh Như (Quỳnh Như POS)

Website quản lý bán hàng và tồn kho chuyên nghiệp dành cho cửa hàng tạp hóa Quỳnh Như, đáp ứng toàn diện và chuẩn xác **25 Use Cases** theo tài liệu đặc tả nghiệp vụ và thiết kế giao diện Figma.

---

## 1. Thông Tin Tài Khoản Kiểm Tra & Đăng Nhập

| Mục | Thông tin đăng nhập |
| :--- | :--- |
| **Vai trò** | Chủ cửa hàng (Toàn quyền quản trị tất cả phân hệ) |
| **Tên đăng nhập** | `chucuahang` |
| **Mật khẩu** | `QuynhNhu@2026` |
| **Cơ chế xác thực** | Mật khẩu băm an toàn bằng `bcryptjs`, quản lý phiên làm việc qua Cookie `httpOnly`, nút Đăng xuất tại góc phải trên thanh tiêu đề. |
| **Màn hình mặc định sau đăng nhập** | **Tạo giao dịch bán hàng** (`/pos`) theo đúng yêu cầu đề bài. |

---

## 2. Hướng Dẫn Triển Khai Go-Live (Đưa Lên Internet)

Hệ thống được thiết kế tối ưu trên nền tảng **Next.js 14 + TypeScript**, CSDL quan hệ **PostgreSQL** kết nối qua **Prisma ORM** và triển khai trực tuyến trên **Vercel** + **Neon / Supabase**.

### Bước 1: Khởi tạo Cơ sở Dữ liệu PostgreSQL miễn phí trên Neon
1. Truy cập [https://neon.tech](https://neon.tech), đăng ký tài khoản miễn phí.
2. Tạo một Project mới (ví dụ: `taphoa-quynhnhu`).
3. Sao chép chuỗi kết nối PostgreSQL (Connection String dạng `postgresql://<user>:<password>@<host>/<dbname>?sslmode=require`).

### Bước 2: Đẩy Mã Nguồn Lên GitHub
Tại thư mục mã nguồn dự án:
```bash
git init
git add .
git commit -m "feat: Ban giao he thong quan ly ban hang tap hoa Quynh Nhu - 25 Use Cases"
git branch -M main
git remote add origin https://github.com/<tai-khoan-github-cua-ban>/taphoa-quynhnhu.git
git push -u origin main
```

### Bước 3: Triển Khai Lên Vercel
1. Đăng nhập [https://vercel.com](https://vercel.com), chọn **Add New...** -> **Project**.
2. Chọn kho mã nguồn `taphoa-quynhnhu` vừa tạo trên GitHub.
3. Trong phần **Environment Variables**, cấu hình 2 biến môi trường bắt buộc:
   - `DATABASE_URL`: Dán chuỗi kết nối PostgreSQL từ Neon ở Bước 1.
   - `SESSION_SECRET`: Một chuỗi khóa ngẫu nhiên (ví dụ: `quynhnhu_secure_session_secret_2026_xyz`).
4. Nhấn **Deploy**. Vercel sẽ tự động build và cấp đường dẫn công khai (ví dụ: `https://taphoa-quynhnhu.vercel.app`).

### Bước 4: Đẩy Cấu Trúc Bảng & Khôi Phục Dữ Liệu Mẫu
Sau khi triển khai lên Vercel:
- **Cách 1 (Nhanh nhất - Ngay trên giao diện Web)**:
  Truy cập vào trang web đã deploy -> Đăng nhập tài khoản `chucuahang` / `QuynhNhu@2026` -> Nhấn nút **"Khôi phục dữ liệu mẫu"** màu xanh ngọc trên thanh Header. Hệ thống sẽ tự động khởi tạo toàn bộ danh mục, sản phẩm nhiều đơn vị, nhà cung cấp, khách hàng, các lô nhập hàng khác hạn, và hóa đơn mẫu.
- **Cách 2 (Qua dòng lệnh)**:
  ```bash
  npx prisma db push
  npm run db:seed
  ```

---

## 3. Danh Sách 25 Use Cases Đã Hoàn Thành

| Phân hệ | Mã UC | Tên chức năng | Đường dẫn màn hình |
| :--- | :--- | :--- | :--- |
| **Sản phẩm (UC1)** | UC1.1 | Thêm mới sản phẩm | `/products` |
| | UC1.2 | Sửa thông tin sản phẩm | `/products` |
| | UC1.3 | Cập nhật giá bán | `/products` |
| | UC1.4 | Cập nhật trạng thái kinh doanh | `/products` |
| | UC1.5 | Xem lịch sử giá bán | `/products` |
| **Nhà cung cấp (UC2)** | UC2.1 | Thêm mới nhà cung cấp | `/suppliers` |
| | UC2.2 | Sửa thông tin nhà cung cấp | `/suppliers` |
| | UC2.3 | Cập nhật trạng thái hợp tác | `/suppliers` |
| | UC2.4 | Tra cứu nhà cung cấp | `/suppliers` |
| **Báo cáo (UC3)** | UC3.1 | Xem báo cáo kinh doanh | `/reports/business` |
| | UC3.2 | Xem báo cáo xuất - nhập - tồn | `/reports/inventory` |
| | UC3.3 | Xuất báo cáo (Excel .xlsx & PDF) | `/reports/business` & `/reports/inventory` |
| **Quản lý kho (UC4)** | UC4.1 | Nhập hàng | `/inventory/import` |
| | UC4.2 | Điều chỉnh tồn kho | `/inventory/adjust` |
| | UC4.3 | Tra cứu tồn kho & cảnh báo | `/inventory/inquiry` |
| | UC4.4 | Xem lịch sử nhập hàng | `/inventory/history` |
| **Khách hàng (UC5)** | UC5.1 | Thêm mới khách hàng | `/customers` |
| | UC5.2 | Sửa thông tin khách hàng | `/customers` |
| | UC5.3 | Tra cứu khách hàng | `/customers` |
| | UC5.4 | Xem lịch sử mua hàng | `/customers` |
| **Bán hàng (UC6)** | UC6.1 | Tạo giao dịch bán hàng (POS) | `/pos` |
| | UC6.2 | In hóa đơn bán hàng | `/pos` (Sau thanh toán) & `/sales/history` |
| | UC6.3 | Hủy hóa đơn bán hàng | `/sales/history` |
| | UC6.4 | Xem lịch sử bán hàng | `/sales/history` |
| | UC6.5 | Đổi - Trả hàng | `/sales/history` |

---

## 4. Quyết Định Bổ Sung Của Nhóm

Theo Mục 4 của đề bài, các quyết định bổ sung được ghi nhận và áp dụng nhất quán trong toàn bộ hệ thống:

1. **Sản phẩm và Đơn vị tính:**
   - Hồ sơ sản phẩm bổ sung: `Mã vạch`, `Mức tồn tối thiểu`, Cờ `Có quản lý hạn sử dụng`, danh sách đơn vị bán (Đơn vị, Tỷ lệ quy đổi về đơn vị cơ sở, Giá bán). Đơn vị cơ sở luôn có hệ số quy đổi bằng 1.
   - Hạn sử dụng thực tế chỉ nhập ở phiếu nhập hàng (UC4.1) cho từng lô chi tiết. Cờ "Có quản lý hạn sử dụng" ở form sản phẩm quyết định trường hạn sử dụng ở phiếu nhập là bắt buộc hay tùy chọn.
   - "Giá nhập" ở form sản phẩm là giá tham chiếu ban đầu; khi phát sinh phiếu nhập, giá nhập bình quân gia quyền (Weighted Average Cost) được tính lại để làm giá vốn xuất kho và tính lợi nhuận.
2. **Nguyên tắc Xuất kho & Tồn kho:**
   - Bán hàng phân bổ tồn kho theo thứ tự ưu tiên: chi tiết phiếu nhập có hạn sử dụng gần nhất trước (FEFO); hàng không quản lý hạn sử dụng lấy theo ngày nhập cũ trước (FIFO).
   - Chi tiết phiếu nhập đã hết hạn (`Hạn sử dụng < ngày hiện tại`) bị loại bỏ hoàn toàn khỏi lượng hàng có thể bán.
   - Cùng sản phẩm được thêm nhiều lần vào giỏ hàng sẽ được hệ thống gộp và kiểm tra tính khả dụng theo tổng số lượng cơ sở.
   - Trả hàng: Hoàn trả vào kho theo thứ tự LIFO (ngược thứ tự đã xuất), không vượt quá lượng đã xuất của từng lô. Tiền trả khách theo đơn giá gốc trên hóa đơn.
   - Hàng đổi: Xuất kho theo quy tắc FEFO/FIFO như bán mới, đơn giá là giá bán hiện hành của đơn vị được chọn.
   - Điều chỉnh tồn (UC4.2): Số lượng tồn sau điều chỉnh của lô không được vượt quá số lượng đã nhập của lô đó; không làm thay đổi giá nhập bình quân.
3. **Giá vốn và Báo cáo:**
   - Lưu trữ giá vốn bình quân (đơn vị cơ sở) tại thời điểm bán trên từng dòng chi tiết hóa đơn (`ChiTietHoaDon`). Hàng trả hoàn giá vốn của dòng hóa đơn gốc; hàng đổi áp dụng giá vốn tại thời điểm đổi.
   - Hóa đơn hủy tính theo ngày hủy: loại khỏi doanh thu của kỳ chứa ngày hủy; lượng hàng hoàn kho được tính là nhập ở báo cáo xuất - nhập - tồn của kỳ đó.
   - Hàng trả chọn "Không nhập lại kho": không tính lượng nhập ở báo cáo xuất - nhập - tồn, nhưng vẫn trừ doanh thu tương ứng.
   - File xuất Excel/PDF: Định dạng chuẩn gồm tiêu đề báo cáo, loại báo cáo, bộ lọc đã chọn, các cột dữ liệu và dòng tổng cộng. Thư viện sử dụng thuần JavaScript (`exceljs`, `jspdf`, `jspdf-autotable`), tương thích hoàn toàn môi trường Serverless Vercel.
4. **Mã tự sinh & Trạng thái chứng từ:**
   - Mã tự sinh duy nhất: `SP0001` (Sản phẩm), `NCC001` (Nhà cung cấp), `KH0001` (Khách hàng), `HD0001` (Hóa đơn), `PN0001` (Phiếu nhập), `DC0001` (Phiếu điều chỉnh), `DT0001` (Phiếu đổi/trả).
   - Trạng thái hóa đơn: `Đã thanh toán`, `Đã hủy`. Hóa đơn đã phát sinh phiếu đổi/trả vẫn giữ trạng thái `Đã thanh toán` nhưng bị khóa hủy trực tiếp (bảo toàn tính toàn vẹn chứng từ).
5. **Gắn khách hàng khi thanh toán:**
   - Màn hình POS cung cấp hộp thoại "Gắn khách hàng" theo số điện thoại: nhập SĐT -> chọn "Tìm". Nếu có thì hiển thị tên và gắn vào hóa đơn; nếu không thấy báo đúng thông báo `Không tìm thấy khách hàng`. Khách vãng lai không gắn khách vẫn thanh toán bình thường.
6. **Chống gửi trùng (Idempotency Key):**
   - Mọi thao tác thanh toán, nhập hàng, hủy hóa đơn, đổi/trả đều sinh mã yêu cầu duy nhất (`idempotencyKey`) để bảo đảm người dùng bấm nhiều lần nút bấm cũng chỉ tạo duy nhất 1 bản ghi và không trừ kho 2 lần.

---

## 5. Điểm Đặc Tả Chưa Quy Định & Cách Xử Lý

1. **Lỗi đánh số UC4.1 "7c.1":** Đặc tả đánh số sai bước ngoại lệ hạn sử dụng. Nhóm hiểu đây là ngoại lệ 5c.1 của bước kiểm tra hạn sử dụng: `"Hạn sử dụng phải sau ngày nhập hàng"`.
2. **Cụt chữ tại UC6.5 bước 5:** Đoạn văn bản kết thúc bằng: `"mặc định mỗi dòng hàng trả được nhập lại kh"`. Nhóm hoàn thiện thành: `"mặc định mỗi dòng hàng trả được nhập lại kho"` (Checkbox "Nhập lại kho" mặc định được chọn `true`).
3. **Mã vạch sản phẩm:** Trường mã vạch được hỗ trợ tối đa 13 ký tự số chuẩn EAN-13, có tính năng tìm nhanh theo mã vạch trên POS.
4. **Mô phỏng máy in & Mã QR chuyển khoản:**
   - In hóa đơn: Sử dụng hộp thoại in của trình duyệt (`window.print()`) kết hợp giao diện mẫu hóa đơn bán lẻ chuẩn khổ 80mm.
   - Mã QR chuyển khoản: Tự động sinh mã VietQR chuẩn kèm thông tin chuyển khoản ngân hàng và số tiền chính xác của đơn hàng.
5. **Công tắc mô phỏng lỗi demo (Demo Error Switches):**
   - Đặt tại góc phải Header (nút **"Công tắc lỗi demo"**). Cho phép bật/tắt:
     - Lỗi in hóa đơn (UC6.2 5a)
     - Lỗi lưu dữ liệu CSDL (UC4.1 8a, UC4.2 8a, UC6.1 10a, UC6.3 7a, UC6.5 10a)
     - Lỗi tải dữ liệu (UC3, UC4, UC6.4)
   - Lưu qua Cookie theo từng phiên làm việc của người dùng, không làm ảnh hưởng đến dữ liệu toàn hệ thống.

---

## 6. Kịch Bản & Kết Quả Kiểm Thử (7 Trường Hợp Mục 7)

Tất cả 7 kịch bản kiểm tra bắt buộc đã được xác minh tự động (`scripts/verify-all.ts`) và kiểm thử trực quan trên giao diện:

| STT | Kịch bản kiểm thử | Hành động & Dữ liệu | Kết quả thực tế | Đánh giá |
| :---: | :--- | :--- | :--- | :---: |
| **1** | Nhập hai dòng cùng sản phẩm khác hạn; tra cứu từng dòng | Nhập phiếu PN0004 cho `SP0001` gồm 2 dòng: HSD +60 ngày (30 gói) và HSD +150 ngày (20 gói). Vào màn hình Tra cứu tồn kho (`/inventory/inquiry`). | Bảng hiển thị tách biệt 2 lô hàng với đúng mã phiếu, hạn sử dụng, số lượng nhập và số lượng còn lại. | **ĐẠT (PASS)** |
| **2** | Bán hàng FEFO từ hai nguồn, nhập thiếu tiền rồi sửa và thanh toán. Bấm thanh toán 2 lần | Chọn mua 35 gói `SP0001`. Nhập tiền khách đưa nhỏ hơn tổng tiền (báo lỗi `Tiền khách đưa chưa đủ để thanh toán`). Sửa đủ tiền, bấm thanh toán. Click liên tiếp 2 lần. | Chỉ sinh đúng 1 hóa đơn, xuất 30 gói từ lô hạn gần trước và 5 gói từ lô sau. Không trừ trùng kho nhờ Idempotency Key. | **ĐẠT (PASS)** |
| **3** | Hủy một hóa đơn chưa đổi/trả; đối chiếu lượng hoàn từng nguồn | Hủy hóa đơn vừa tạo ở Test 2 với lý do "Khách đổi ý". | Hóa đơn chuyển trạng thái `Đã hủy`. Lô hạn gần được hoàn đủ 30 gói, lô hạn xa được hoàn đủ 5 gói. | **ĐẠT (PASS)** |
| **4** | Trả hàng chọn "Không nhập lại kho" & Khóa hủy trực tiếp hóa đơn gốc | Tạo hóa đơn `HD0002` bán 10 chai nước ngọt. Vào Lịch sử bán hàng -> chọn Đổi/Trả hàng -> trả 4 chai, bỏ chọn "Nhập lại kho". Thử bấm nút Hủy hóa đơn gốc. | Tiền trả khách hoàn đủ. Tồn kho không tăng. Hóa đơn gốc bị khóa hủy trực tiếp với thông báo: *"Hóa đơn có giao dịch đổi/trả hàng, không thể hủy trực tiếp"*. | **ĐẠT (PASS)** |
| **5** | Báo cáo theo khoảng ngày, xuất Excel & PDF, đối chiếu số liệu | Chọn kỳ báo cáo từ 30 ngày trước đến nay. Xem màn hình và nhấn xuất file Excel (`.xlsx`), PDF (`.pdf`). | Doanh thu thuần, giá vốn và lợi nhuận gộp trên màn hình khớp 100% với file Excel và PDF tải về. | **ĐẠT (PASS)** |
| **6** | Chống bán vượt tồn kho (Race Condition & Tồn không âm) | Thử bán sản phẩm còn tồn 5 cái nhưng giỏ hàng đặt số lượng 15 cái. | Hệ thống chặn giao dịch với thông báo lỗi `Không đủ số lượng hàng có thể bán`. Số lượng tồn kho không bao giờ bị âm. | **ĐẠT (PASS)** |
| **7** | Đăng nhập kiểm tra từ trình duyệt ngoài | Đăng nhập tài khoản `chucuahang` / `QuynhNhu@2026` từ cửa sổ ẩn danh (Incognito). | Đăng nhập thành công, cấp quyền Chủ cửa hàng, tự động chuyển vào màn hình Tạo giao dịch bán hàng (`/pos`). | **ĐẠT (PASS)** |

---

## 7. Khởi Chạy Ứng Dụng Ở Chế Độ Cục Bộ (Local)

Để chạy thử nghiệm cục bộ trên máy tính:
```bash
# 1. Cài đặt thư viện
npm install

# 2. Khởi tạo Prisma client
npx prisma generate

# 3. Chạy môi trường phát triển
npm run dev
```
Truy cập địa chỉ: [http://localhost:3000](http://localhost:3000)
Tài khoản kiểm tra: `chucuahang` / `QuynhNhu@2026`.
