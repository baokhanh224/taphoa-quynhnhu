import { NextRequest, NextResponse } from 'next/server';
import { calculateBusinessReport } from '@/lib/db';
import { getDemoSwitches } from '@/lib/demoSwitches';

export async function GET(req: NextRequest) {
  const switches = getDemoSwitches(req);
  // UC3.1 7a.2: Không thể tải báo cáo. Vui lòng thử lại
  if (switches.errorLoad) {
    return NextResponse.json(
      { error: 'Không thể tải báo cáo. Vui lòng thử lại' },
      { status: 500 }
    );
  }

  const { searchParams } = new URL(req.url);
  const fromDate = searchParams.get('fromDate') || undefined;
  const toDate = searchParams.get('toDate') || undefined;
  const productId = searchParams.get('productId') || undefined;
  const categoryId = searchParams.get('categoryId') || undefined;
  const rankingBy = (searchParams.get('rankingBy') as any) || 'quantity';

  // BR-UC3-01: "Từ ngày" không lớn hơn "Đến ngày" và không vượt quá ngày hiện tại
  const today = new Date();
  today.setHours(23, 59, 59, 999);

  if (fromDate && toDate) {
    const f = new Date(fromDate);
    const t = new Date(toDate);
    if (f > t || t > today) {
      // UC3.1 6a.2: Khoảng thời gian hoặc tiêu chí lọc không hợp lệ
      return NextResponse.json(
        { error: 'Khoảng thời gian hoặc tiêu chí lọc không hợp lệ' },
        { status: 400 }
      );
    }
  }

  try {
    const report = await calculateBusinessReport({
      fromDate,
      toDate,
      productId,
      categoryId,
      rankingBy,
    });

    const hasData = report.soHoaDon > 0 || report.topSellers.length > 0;

    return NextResponse.json({
      report,
      hasData,
      // BR-UC3-04: Khi không có dữ liệu phù hợp, hệ thống phải hiển thị kết quả trống kèm thông báo “Không có dữ liệu phù hợp”
      message: hasData ? undefined : 'Không có dữ liệu phù hợp',
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Không thể tải báo cáo. Vui lòng thử lại' },
      { status: 500 }
    );
  }
}
