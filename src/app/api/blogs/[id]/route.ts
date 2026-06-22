import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

type SafeContext = { params?: { id?: string } };

export async function GET(request: NextRequest, context: SafeContext) {
  try {
    const id = context?.params?.id;
    if (!id) return NextResponse.json({ error: 'ไม่พบ ID' }, { status: 400 });

    const blogId = Number(id);
    if (isNaN(blogId)) return NextResponse.json({ error: 'ID ไม่ถูกต้อง' }, { status: 400 });

    const blog = await prisma.blog.findUnique({ where: { id: blogId } });
    if (!blog) return NextResponse.json({ error: 'ไม่พบบทความ' }, { status: 404 });

    return NextResponse.json(blog);
  } catch (error) {
    return NextResponse.json({ error: 'เกิดข้อผิดพลาด' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, context: SafeContext) {
  try {
    const id = context?.params?.id;
    if (!id) return NextResponse.json({ error: 'ไม่พบ ID' }, { status: 400 });

    const blogId = Number(id);
    if (isNaN(blogId)) return NextResponse.json({ error: 'ID ไม่ถูกต้อง' }, { status: 400 });

    const body = await request.json();
    const { title, slug, excerpt, content, coverImage, additionalImages } = body;

    if (additionalImages && additionalImages.length > 6) {
      return NextResponse.json({ error: 'ใส่รูปเพิ่มเติมได้สูงสุด 6 รูป' }, { status: 400 });
    }

    const updatedBlog = await prisma.blog.update({
      where: { id: blogId },
      data: { title, slug, excerpt, content, coverImage, additionalImages }
    });

    return NextResponse.json({ message: 'อัปเดตสำเร็จ', blog: updatedBlog });
  } catch {
  return NextResponse.json({ error: 'เกิดข้อผิดพลาด' }, { status: 500 });
}
}