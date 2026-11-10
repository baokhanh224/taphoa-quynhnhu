import { NextRequest, NextResponse } from 'next/server';
import { getInventoryInquiry } from '@/lib/db';
import { getDemoSwitches } from '@/lib/demoSwitches';

export async function GET(req: NextRequest) {
  const switches = getDemoSwitches(req);
  // UC4.3 5b.1: Không thể tải dữ liệu tồn kho
  if (switches.errorLoad) {
    return NextResponse.json({ error: 'Không thể tải dữ liệu tồn kho' }, { status: 500 });
  }

  const { searchParams } = new URL(req.url);
  const filter = (searchParams.get('filter') as any) || 'all';
  const keyword = searchParams.get('keyword') || undefined;

  try {
    const results = await getInventoryInquiry(filter, keyword);
    return NextResponse.json({ results });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
