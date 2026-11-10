import { NextRequest, NextResponse } from 'next/server';
import { getDemoSwitches, DEMO_SWITCH_COOKIE } from '@/lib/demoSwitches';

export async function GET(req: NextRequest) {
  const switches = getDemoSwitches(req);
  return NextResponse.json(switches);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const switches = {
      errorSave: Boolean(body.errorSave),
      errorLoad: Boolean(body.errorLoad),
      errorPrinter: Boolean(body.errorPrinter),
    };

    const res = NextResponse.json({ success: true, switches });
    res.cookies.set(DEMO_SWITCH_COOKIE, JSON.stringify(switches), {
      path: '/',
      maxAge: 7 * 24 * 60 * 60,
      sameSite: 'lax',
    });
    return res;
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
