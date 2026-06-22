import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // 1. เช็กก่อนว่ามี Admin ในระบบหรือยัง จะได้ไม่สร้างซ้ำซ้อน
    const existingAdmin = await prisma.admin.findUnique({
      where: { username: 'admin' }
    });

    if (existingAdmin) {
      return NextResponse.json({ message: 'มีแอดมินอยู่ในระบบแล้วจ้า! ลองไปที่หน้า Login ได้เลย' });
    }

    // 2. ถ้ายังไม่มี ให้สร้าง Admin เริ่มต้น
    const newAdmin = await prisma.admin.create({
      data: {
        username: 'admin',
        password: 'password123', // (ในการใช้งานจริงควรเข้ารหัสผ่าน แต่อันนี้เราทำเพื่อทดสอบครับ)
        role: 'ADMIN'
      }
    });

    return NextResponse.json({
      message: 'สร้างบัญชี Admin สำเร็จแล้ว!',
      credentials: {
        username: newAdmin.username,
        password: newAdmin.password
      }
    });

  } catch (error) {
    console.error("Setup Error:", error);
    return NextResponse.json({ error: 'เกิดข้อผิดพลาดในการสร้าง Admin' }, { status: 500 });
  }
}