import { NextRequest, NextResponse } from 'next/server';
import { generateExcelReport } from '@/lib/excelExport';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, reportType, filters, columns, rows, totals } = body;

    const buffer = await generateExcelReport({
      title: title || 'Báo cáo',
      reportType: reportType || '',
      filters: filters || {},
      columns: columns || [],
      rows: rows || [],
      totals: totals || undefined,
    });

    const filename = `BaoCao_${Date.now()}.xlsx`;

    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (err: any) {
    // UC3.3 5a.2: Xuất báo cáo không thành công, vui lòng thử lại
    return NextResponse.json(
      { error: 'Xuất báo cáo không thành công, vui lòng thử lại' },
      { status: 500 }
    );
  }
}
