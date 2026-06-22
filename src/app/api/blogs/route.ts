import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// ------------------------------------------------------
// Method GET: สำหรับดึงข้อมูล Blog ทั้งหมดไปแสดงที่หน้าบ้าน
// ------------------------------------------------------
export async function GET() {
  try {
    const blogs = await prisma.blog.findMany({
      orderBy: { createdAt: 'desc' }, // เรียงจากบทความใหม่สุดไปเก่าสุด
    });
    
    return NextResponse.json(blogs);
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return NextResponse.json({ error: 'ดึงข้อมูลไม่สำเร็จ' }, { status: 500 });
  }
}

// ------------------------------------------------------
// Method POST: สำหรับให้แอดมินสร้าง Blog ใหม่
// ------------------------------------------------------
export async function POST(request: Request) {
  try {
    // 1. รับข้อมูลที่ส่งมาจากหน้าฟอร์ม (Frontend)
    const body = await request.json();
    const { title, slug, excerpt, content, coverImage } = body;

    // 2. สั่ง Prisma ให้เอาข้อมูลไปบันทึกลง Database
    const newBlog = await prisma.blog.create({
      data: {
        title,
        slug,
        excerpt,
        content,
        coverImage,
        isPublished: true, // ค่าเริ่มต้นให้เผยแพร่เลย (ไว้ปรับแก้ทีหลังได้)
      },
    });

    // 3. ส่งข้อมูลที่สร้างเสร็จแล้วกลับไปบอกหน้าบ้านว่าสำเร็จ
    return NextResponse.json(newBlog, { status: 201 });
  } catch (error) {
    console.error("Error creating blog:", error);
    return NextResponse.json({ error: 'สร้างบทความไม่สำเร็จ' }, { status: 500 });
  }
}