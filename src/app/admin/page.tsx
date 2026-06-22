import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import Link from 'next/link';

export default async function AdminDashboard() {
  // 1. Role Admin ต้อง Login ก่อน
  if (!cookies().has('admin_session')) {
    redirect('/admin/login');
  }

  // 2. ดึงข้อมูลบทความทั้งหมด เรียงจากใหม่ไปเก่า
  const blogs = await prisma.blog.findMany({
    orderBy: { createdAt: 'desc' }
  });

  // 3. Server Action: สลับสถานะ Publish / Unpublish
  async function togglePublish(id: number, currentStatus: boolean) {
    "use server";
    await prisma.blog.update({
      where: { id },
      data: { isPublished: !currentStatus }
    });
    revalidatePath('/admin');
    revalidatePath('/'); // รีเฟรชหน้าบ้านด้วย
  }

  // 4. Server Action: ลบบทความ
  async function deleteBlog(id: number) {
    "use server";
    await prisma.blog.delete({ where: { id } });
    revalidatePath('/admin');
    revalidatePath('/');
  }

  return (
    <div className="p-8 max-w-6xl mx-auto bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">จัดการบทความ</h1>
          <p className="text-gray-500">ศูนย์บัญชาการสำหรับแก้ไข ลบ และจัดการสถานะบทความ</p>
        </div>
        <div className="flex gap-4">
          <Link href="/admin/comments" className="bg-white text-gray-700 border border-gray-300 font-bold py-2.5 px-5 rounded-xl hover:bg-gray-100 shadow-sm transition">
            จัดการคอมเมนต์
          </Link>
          <Link href="/admin/create" className="bg-blue-600 text-white font-bold py-2.5 px-5 rounded-xl hover:bg-blue-700 shadow-sm transition">
            + สร้างบทความใหม่
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 border-b border-gray-200">
              <th className="p-5 font-bold text-gray-700 w-1/2">ชื่อบทความ</th>
              <th className="p-5 font-bold text-gray-700">ยอดวิว</th>
              <th className="p-5 font-bold text-gray-700">สถานะ</th>
              <th className="p-5 font-bold text-gray-700 text-right">จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {blogs.map((blog) => (
              <tr key={blog.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                <td className="p-5">
                  <p className="font-bold text-gray-900 text-lg mb-1 line-clamp-1">{blog.title}</p>
                  <p className="text-sm text-gray-500">/{blog.slug}</p>
                </td>
                <td className="p-5 font-medium text-gray-600">{blog.viewCount}</td>
                <td className="p-5">
                  {blog.isPublished ? (
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-bold shadow-sm">เผยแพร่แล้ว</span>
                  ) : (
                    <span className="bg-gray-200 text-gray-600 px-3 py-1 rounded-full text-xs font-bold shadow-sm">ซ่อน (Draft)</span>
                  )}
                </td>
                <td className="p-5 text-right">
                  <div className="flex gap-2 justify-end">
                    {/* ปุ่ม เปิด/ปิด Publish */}
                    <form action={togglePublish.bind(null, blog.id, blog.isPublished)}>
                      <button type="submit" className="px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-xl text-sm font-bold transition">
                        {blog.isPublished ? 'Unpublish' : 'Publish'}
                      </button>
                    </form>
                    
                    {/* ปุ่มแก้ไข */}
                    <Link href={`/admin/edit/${blog.id}`} className="px-4 py-2 bg-yellow-100 text-yellow-700 hover:bg-yellow-200 rounded-xl text-sm font-bold transition">
                      แก้ไข
                    </Link>

                    {/* ปุ่มลบ */}
                    <form action={deleteBlog.bind(null, blog.id)}>
                      <button type="submit" className="px-4 py-2 bg-red-100 text-red-700 hover:bg-red-200 rounded-xl text-sm font-bold transition">
                        ลบ
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
            
            {blogs.length === 0 && (
              <tr>
                <td colSpan={4} className="p-10 text-center text-gray-500 font-medium">
                  ยังไม่มีบทความในระบบครับ ลองสร้างบทความแรกดูสิ!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}