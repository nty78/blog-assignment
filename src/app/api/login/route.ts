import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // ปรับ path ให้ตรงกับที่เก็บไฟล์ prisma ของคุณ
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    // 1. ค้นหา Admin จาก Database (เปลี่ยน .user เป็น .admin)
    const adminUser = await prisma.admin.findUnique({
      where: { username }
    });

    // 2. ด่านตรวจสุดหิน...
    if (!adminUser || adminUser.password !== password || adminUser.role !== "ADMIN") {
      return NextResponse.json(
        { error: "ชื่อผู้ใช้งาน รหัสผ่าน หรือสิทธิ์การเข้าถึงไม่ถูกต้อง" },
        { status: 401 }
      );
    }

    // 3. ออกบัตรผ่าน (Session Cookie) ที่จะหายไปเองเมื่อปิดเบราว์เซอร์
    cookies().set("admin_session", "true", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      // สังเกตว่าเราไม่ใส่ maxAge เพื่อให้มันเป็น Session Cookie
    });

    // 4. ให้ผ่านเข้าประเทศได้!
    return NextResponse.json({ message: "เข้าสู่ระบบสำเร็จ" });

  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json(
      { error: "ระบบมีปัญหา กรุณาลองใหม่อีกครั้ง" },
      { status: 500 }
    );
  }
}