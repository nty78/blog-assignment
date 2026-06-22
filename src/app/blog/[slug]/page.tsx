import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import CommentForm from "@/components/CommentForm";

export default async function BlogDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  try {
    // ดึงข้อมูลบทความ พร้อมบวกยอด View (+1) อัตโนมัติ และดึงเฉพาะคอมเมนต์ที่ Approve แล้ว
    const blog = await prisma.blog.update({
      where: { slug: params.slug },
      data: { viewCount: { increment: 1 } },
      include: {
        comments: {
          where: { status: "APPROVED" }, // 🚨 ดึงเฉพาะที่ Admin อนุมัติแล้ว
          orderBy: { createdAt: "desc" },
        },
      },
    });

    // ถ้าไม่เจอบทความ หรือบทความถูก Unpublish อยู่ ให้เด้งไปหน้า 404
    if (!blog || !blog.isPublished) {
      return notFound();
    }

    return (
      <div className="max-w-4xl mx-auto p-8">
        <header className="mb-8">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">{blog.title}</h1>
          <div className="flex gap-4 text-sm text-gray-500 font-medium">
            <span>📅 {new Date(blog.createdAt).toLocaleDateString("th-TH")}</span>
            <span>👁️ ยอดเข้าชม: {blog.viewCount} ครั้ง</span>
          </div>
        </header>

        {/*  รูปภาพปก (Cover Image) 1 รูป */}
        <img
          src={blog.coverImage}
          alt={blog.title}
          className="w-full h-[400px] object-cover rounded-2xl mb-8 shadow-md"
        />

        {/* เนื้อหาบทความเต็ม */}
        <div className="prose max-w-none text-gray-800 leading-loose whitespace-pre-wrap mb-12">
          {blog.content}
        </div>

        {/* รูปภาพเพิ่มเติม (สูงสุด 6 รูป) */}
        {blog.additionalImages && blog.additionalImages.length > 0 && (
          <div className="mb-12">
            <h3 className="text-xl font-bold mb-4">รูปภาพเพิ่มเติม</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {blog.additionalImages.slice(0, 6).map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`additional-${index}`}
                  className="w-full h-32 object-cover rounded-xl shadow-sm hover:scale-105 transition-transform"
                />
              ))}
            </div>
          </div>
        )}

        <hr className="my-12 border-gray-200" />

        {/* 💬 ส่วนแสดงความคิดเห็น */}
        <section>
          <h3 className="text-2xl font-bold mb-6">ความคิดเห็น ({blog.comments.length})</h3>
          
          {/* เรียกใช้งาน Client Component สำหรับฟอร์มส่งคอมเมนต์ */}
          <CommentForm blogId={blog.id} />

          <div className="mt-8 space-y-4">
            {blog.comments.length > 0 ? (
              blog.comments.map((comment) => (
                <div key={comment.id} className="bg-gray-50 p-5 rounded-2xl border border-gray-100">
                  <p className="font-bold text-blue-700 mb-1">{comment.senderName}</p>
                  <p className="text-gray-700">{comment.content}</p>
                  <p className="text-xs text-gray-400 mt-2">
                    {new Date(comment.createdAt).toLocaleString("th-TH")}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-8">ยังไม่มีความคิดเห็น เป็นคนแรกที่แสดงความคิดเห็นสิ!</p>
            )}
          </div>
        </section>
      </div>
    );
  } catch (error) {
    return notFound();
  }
}