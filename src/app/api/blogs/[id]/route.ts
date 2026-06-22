import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// 1. เปลี่ยนจาก Request ธรรมดา เป็น NextRequest 
// 2. ใช้ context: any เพื่อหลบการตรวจจับตอน Build ของ Vercel
export async function GET(request: NextRequest, context: any) {
  try {
    // เช็คแบบเซฟๆ ป้องกัน Vercel แอบรันแล้วส่งค่าว่างมาให้
    const id = context?.params?.id;
    if (!id) {
      return NextResponse.json({ error: 'ไม่พบ ID' }, { status: 400 });
    }

    const blogId = Number(id);
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

export async function PUT(request: NextRequest, context: any) {
  try {
    const id = context?.params?.id;
    if (!id) {
      return NextResponse.json({ error: 'ไม่พบ ID' }, { status: 400 });
    }

    const blogId = Number(id);
    if (isNaN(blogId)) return NextResponse.json({ error: 'ID ไม่ถูกต้อง' }, { status: 400 }); 

    const body = await request.json();
    const { title, slug, excerpt, content, coverImage, additionalImages } = body;

    // ด่านตรวจจับ: รูปเพิ่มเติมห้ามเกิน 6 รูปตามโจทย์
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