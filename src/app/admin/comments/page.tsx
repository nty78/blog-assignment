import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import Link from 'next/link';

export default async function ManageCommentsPage() {
  // 1. ด่านตรวจความปลอดภัย: ถ้าไม่มี Session ให้เด้งกลับไปหน้า Login
  if (!cookies().has('admin_session')) {
    redirect('/admin/login');
  }

  // 2. ดึงข้อมูลคอมเมนต์ทั้งหมด (ดึงชื่อบทความมาโชว์ด้วย)
  const comments = await prisma.comment.findMany({
    orderBy: { createdAt: 'desc' },
    include: { blog: { select: { title: true } } }
  });

  // 3. Server Action: ฟังก์ชันนี้จะรันบน Server ทันทีที่
  async function changeStatus(commentId: number, newStatus: string) {
    "use server";
    
    // อัปเดตสถานะใน Database
    await prisma.comment.update({
      where: { id: commentId },
      data: { status: newStatus }
    });
    
    // สั่งให้ Next.js ล้างแคชและรีเฟรชข้อมูลบนหน้าเว็บใหม่ทันที
    revalidatePath('/admin/comments'); 
    revalidatePath('/', 'layout'); 
  }

  return (
    <div className="p-8 max-w-6xl mx-auto bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900">จัดการความคิดเห็น </h1>
        <Link href="/admin" className="text-blue-600 font-semibold hover:underline">
          &larr; กลับหน้าแอดมินหลัก
        </Link>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 border-b border-gray-200">
              <th className="p-5 font-bold text-gray-700">ผู้ส่ง</th>
              <th className="p-5 font-bold text-gray-700">บทความ</th>
              <th className="p-5 font-bold text-gray-700 w-1/3">ข้อความ</th>
              <th className="p-5 font-bold text-gray-700">สถานะ</th>
              <th className="p-5 font-bold text-gray-700 text-center">จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {comments.map((comment) => (
              <tr key={comment.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                <td className="p-5 font-bold text-gray-900">{comment.senderName}</td>
                <td className="p-5 text-gray-600 text-sm line-clamp-2">{comment.blog.title}</td>
                <td className="p-5 text-gray-800">{comment.content}</td>
                <td className="p-5">
                  {comment.status === 'PENDING' && <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-bold shadow-sm">รอตรวจสอบ</span>}
                  {comment.status === 'APPROVED' && <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-bold shadow-sm">อนุมัติแล้ว</span>}
                  {comment.status === 'REJECTED' && <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs font-bold shadow-sm">ซ่อน / ปฏิเสธ</span>}
                </td>
                <td className="p-5">
                  <div className="flex gap-2 justify-center">
                    {/* ฟอร์มเรียกใช้ Server Action สำหรับ Approve */}
                    <form action={changeStatus.bind(null, comment.id, 'APPROVED')}>
                      <button 
                        type="submit" 
                        disabled={comment.status === 'APPROVED'}
                        className={`px-4 py-2 rounded-xl text-sm font-bold transition ${
                          comment.status === 'APPROVED' 
                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                            : 'bg-green-500 text-white hover:bg-green-600 shadow-md hover:shadow-lg'
                        }`}
                      >
                        Approve
                      </button>
                    </form>
                    
                    {/* ฟอร์มเรียกใช้ Server Action สำหรับ Reject */}
                    <form action={changeStatus.bind(null, comment.id, 'REJECTED')}>
                      <button 
                        type="submit" 
                        disabled={comment.status === 'REJECTED'}
                        className={`px-4 py-2 rounded-xl text-sm font-bold transition ${
                          comment.status === 'REJECTED' 
                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                            : 'bg-red-500 text-white hover:bg-red-600 shadow-md hover:shadow-lg'
                        }`}
                      >
                        Reject
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
            
            {comments.length === 0 && (
              <tr>
                <td colSpan={5} className="p-10 text-center text-gray-500 font-medium">
                  ยังไม่มีความคิดเห็นในระบบครับ
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}