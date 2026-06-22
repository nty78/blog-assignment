import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic'; 
export const revalidate = 0;

// ฟังก์ชัน GET: สำหรับดึงข้อมูลบทความเดิมมาแปะในฟอร์ม
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const blogId = Number(params.id);
    if (isNaN(blogId)) return NextResponse.json({ error: 'ID ไม่ถูกต้อง' }, { status: 400 }); 

    const blog = await prisma.blog.findUnique({
      where: { id: blogId }
    });
    if (!blog) return NextResponse.json({ error: 'ไม่พบบทความ' }, { status: 404 });
    return NextResponse.json(blog);
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json({ error: 'เกิดข้อผิดพลาด' }, { status: 500 });
  }
}

// ฟังก์ชัน PUT: สำหรับอัปเดตข้อมูลใหม่ลง Database
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const blogId = Number(params.id);
    if (isNaN(blogId)) return NextResponse.json({ error: 'ID ไม่ถูกต้อง' }, { status: 400 }); 

    const body = await request.json();
    const { title, slug, excerpt, content, coverImage, additionalImages } = body;

    // ด่านตรวจจับ: รูปเพิ่มเติมห้ามเกิน 6 รูปตามโจทย์เป๊ะๆ
    if (additionalImages && additionalImages.length > 6) {
      return NextResponse.json({ error: 'ใส่รูปเพิ่มเติมได้สูงสุด 6 รูปเท่านั้นครับ' }, { status: 400 });
    }

    const updatedBlog = await prisma.blog.update({
      where: { id: blogId },
      data: { title, slug, excerpt, content, coverImage, additionalImages }
    });

    return NextResponse.json({ message: 'อัปเดตสำเร็จ', blog: updatedBlog });
  } catch (error) {
    console.error("PUT Error:", error);
    return NextResponse.json({ error: 'เกิดข้อผิดพลาด (อาจจะตั้งชื่อ URL Slug ซ้ำกับบทความอื่น)' }, { status: 500 });
  }
}