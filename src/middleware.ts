import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // เช็กว่ากำลังพยายามเข้าหน้าในโซน /admin หรือไม่
  const isAdminPage = request.nextUrl.pathname.startsWith('/admin');
  
  // ยกเว้นหน้า /admin/login เพื่อให้คนเข้าไปกรอกรหัสได้
  const isLoginPage = request.nextUrl.pathname.startsWith('/admin/login');

  if (isAdminPage && !isLoginPage) {
    // ขอดูบัตรผ่าน (Cookie) หน่อย
    const session = request.cookies.get('admin_session');

    // ถ้าไม่มีบัตรผ่าน เตะกลับไปหน้า Login!
    if (!session) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  // ถ้ามีบัตรผ่าน หรือเข้าหน้าเว็บปกติ (หน้าบ้าน) ก็ให้ผ่านไปได้
  return NextResponse.next();
}

// ระบุว่ายามคนนี้จะไปยืนเฝ้าที่ URL ไหนบ้าง
export const config = {
  matcher: ['/admin/:path*'],
};