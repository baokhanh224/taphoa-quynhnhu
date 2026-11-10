import { NextRequest, NextResponse } from 'next/server';
import { generatePdfReport } from '@/lib/pdfExport';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, reportType, filters, headers, data, totals } = body;

    const buffer = generatePdfReport({
      title: title || 'Báo cáo',
      reportType: reportType || '',
      filters: filters || {},
      headers: headers || [],
      data: data || [],
      totals: totals || undefined,
    });

    const filename = `BaoCao_${Date.now()}.pdf`;

    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
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
