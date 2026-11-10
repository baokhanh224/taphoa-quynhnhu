import { resetDatabase } from '../src/lib/db';

async function main() {
  console.log('--- Đang khởi tạo dữ liệu mẫu cho Tạp Hóa Quỳnh Như ---');
  await resetDatabase();
  console.log('✔ Khởi tạo dữ liệu mẫu thành công!');
  console.log('Tài khoản: chucuahang / Mật khẩu: QuynhNhu@2026');
}

main()
  .catch((e) => {
    console.error('Lỗi khi nạp dữ liệu mẫu:', e);
    process.exit(1);
  });
