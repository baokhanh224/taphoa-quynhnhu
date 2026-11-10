import { NextRequest, NextResponse } from 'next/server';
import { calculateInventoryReport } from '@/lib/db';
import { getDemoSwitches } from '@/lib/demoSwitches';

export async function GET(req: NextRequest) {
  const switches = getDemoSwitches(req);
  // UC3.2 6a.2: Không thể tải báo cáo. Vui lòng thử lại
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

  // BR-UC3-01
  const today = new Date();
  today.setHours(23, 59, 59, 999);

  if (fromDate && toDate) {
    const f = new Date(fromDate);
    const t = new Date(toDate);
    if (f > t || t > today) {
      // UC3.2 5a.2: Khoảng thời gian hoặc tiêu chí lọc không hợp lệ
      return NextResponse.json(
        { error: 'Khoảng thời gian hoặc tiêu chí lọc không hợp lệ' },
        { status: 400 }
      );
    }
  }

  try {
    const items = await calculateInventoryReport({
      fromDate,
      toDate,
      productId,
      categoryId,
    });

    const hasData = items.length > 0 && items.some((i) => i.tonDauKy > 0 || i.nhap > 0 || i.xuat > 0);

    return NextResponse.json({
      items,
      hasData,
      message: hasData ? undefined : 'Không có dữ liệu phù hợp',
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Không thể tải báo cáo. Vui lòng thử lại' },
      { status: 500 }
    );
  }
}
