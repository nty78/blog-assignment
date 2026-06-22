import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = 'force-dynamic'; 

export async function POST(request: Request) {
  try {
    const { blogId, senderName, content } = await request.json();

    // Back-end Validation: ป้องกันการยิง API ข้าม Front-end
    const regex = /^[ก-๙0-9\s]+$/;
    if (!regex.test(content)) {
      return NextResponse.json(
        { error: "Validation Failed: อนุญาตเฉพาะภาษาไทยและตัวเลขเท่านั้น" },
        { status: 400 }
      );
    }

    // บันทึกลง Database (สถานะเริ่มต้นตาม Schema คือ PENDING อยู่แล้ว)
    const newComment = await prisma.comment.create({
      data: {
        blogId: parseInt(blogId),
        senderName,
        content,
        // status ไม่ต้องส่งไป เพราะตั้ง @default("PENDING") ไว้ใน schema แล้ว
      },
    });

    return NextResponse.json({ message: "Comment created successfully", data: newComment }, { status: 201 });
  } catch (error) {
    console.error("Error creating comment:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}