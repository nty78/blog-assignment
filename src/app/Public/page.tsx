import prisma from "@/lib/prisma";
import Link from "next/link";

export default async function HomePage() {
  // ดึงข้อมูลบล็อกทั้งหมดจาก Database เรียงจากใหม่ไปเก่า
  const blogs = await prisma.blog.findMany({
    where: { isPublished: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="max-w-5xl mx-auto p-8">
      <header className="text-center mb-12 mt-10">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Metier Blog </h1>
        <p className="text-gray-500">อัปเดตบทความใหม่ล่าสุดจากเรา</p>
      </header>

      {/* ถ้ายังไม่มีบทความให้โชว์ข้อความนี้ */}
      {blogs.length === 0 ? (
        <div className="text-center text-gray-500 py-10">
          ยังไม่มีบทความในระบบครับ แอดมินต้องไปสร้างก่อนนะ!
        </div>
      ) : (
        /* โครงสร้าง Grid แสดงการ์ดบทความ */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((blog) => (
            <article 
              key={blog.id} 
              className="bg-white border rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition duration-300 flex flex-col"
            >
              {/* รูปภาพปก */}
              <img 
                src={blog.coverImage} 
                alt={blog.title} 
                className="w-full h-48 object-cover"
              />
              
              {/* เนื้อหาในการ์ด */}
              <div className="p-6 flex flex-col flex-grow">
                <h2 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">
                  {blog.title}
                </h2>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-grow">
                  {blog.excerpt}
                </p>
                
                <Link 
                  href={`/blog/${blog.slug}`} 
                  className="text-blue-600 font-semibold hover:text-blue-800 mt-auto"
                >
                  อ่านต่อ &rarr;
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}