import prisma from "@/lib/prisma";
import Link from "next/link";

export default async function HomePage({
  searchParams,
}: {
  searchParams: { search?: string; page?: string };
}) {
  // 1. รับค่า Search และ Page จาก URL
  const searchQuery = searchParams.search || "";
  const currentPage = Number(searchParams.page) || 1;
  const itemsPerPage = 10; // กำหนดตามโจทย์: หน้าละ 10 รายการ
  const skip = (currentPage - 1) * itemsPerPage;

  // 2. ดึงข้อมูลจาก Database พร้อมเงื่อนไขค้นหาและแบ่งหน้า
  const [blogs, totalBlogs] = await Promise.all([
    prisma.blog.findMany({
      where: {
        isPublished: true,
        title: {
          contains: searchQuery,
          mode: "insensitive", // ค้นหาตัวเล็กตัวใหญ่ได้หมด
        },
      },
      orderBy: { createdAt: "desc" },
      skip: skip,
      take: itemsPerPage,
    }),
    prisma.blog.count({
      where: {
        isPublished: true,
        title: {
          contains: searchQuery,
          mode: "insensitive",
        },
      },
    }),
  ]);

  const totalPages = Math.ceil(totalBlogs / itemsPerPage);

  return (
    <main className="max-w-5xl mx-auto p-8">
      <header className="text-center mb-10 mt-6">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">Metier Blog </h1>
        <p className="text-gray-500">อัปเดตบทความใหม่ล่าสุดจากเรา</p>
      </header>

      {/* ส่วนช่องค้นหา (Search Bar)*/}
      <form className="mb-10 max-w-lg mx-auto flex gap-2" method="GET" action="/">
        <input
          type="text"
          name="search"
          defaultValue={searchQuery}
          placeholder="ค้นหาชื่อบทความ..."
          className="flex-grow border border-gray-300 p-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition"
        />
        <button type="submit" className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 shadow-sm transition">
          ค้นหา
        </button>
        {searchQuery && (
          <Link href="/" className="bg-gray-100 text-gray-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition">
            ล้าง
          </Link>
        )}
      </form>

      {/* ส่วนแสดงการ์ดบทความ */}
      {blogs.length === 0 ? (
        <div className="text-center text-gray-500 py-16 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
          <p className="text-lg">ไม่พบข้อมูลบทความที่คุณค้นหา 😥</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((blog) => (
            <article key={blog.id} className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition duration-300 flex flex-col group">
              <div className="overflow-hidden">
                <img src={blog.coverImage} alt={blog.title} className="w-full h-52 object-cover group-hover:scale-105 transition duration-500" />
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <h2 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2 group-hover:text-blue-600 transition">
                  {blog.title}
                </h2>
                <p className="text-gray-600 text-sm mb-5 line-clamp-3 flex-grow leading-relaxed">
                  {blog.excerpt}
                </p>
                <Link href={`/blog/${blog.slug}`} className="text-blue-600 font-bold text-sm inline-flex items-center mt-auto">
                  อ่านต่อ <span className="ml-1 group-hover:translate-x-1 transition-transform">&rarr;</span>
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* ส่วนปุ่มแบ่งหน้า (Pagination) */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-16">
          {currentPage > 1 ? (
            <Link href={`/?search=${searchQuery}&page=${currentPage - 1}`} className="px-5 py-2 border border-gray-300 rounded-full hover:bg-gray-50 font-medium transition">
              &larr; ก่อนหน้า
            </Link>
          ) : (
            <span className="px-5 py-2 border border-gray-200 rounded-full text-gray-400 font-medium cursor-not-allowed">&larr; ก่อนหน้า</span>
          )}

          <span className="text-gray-600 font-medium">
            หน้า {currentPage} จาก {totalPages}
          </span>

          {currentPage < totalPages ? (
            <Link href={`/?search=${searchQuery}&page=${currentPage + 1}`} className="px-5 py-2 border border-gray-300 rounded-full hover:bg-gray-50 font-medium transition">
              ถัดไป &rarr;
            </Link>
          ) : (
            <span className="px-5 py-2 border border-gray-200 rounded-full text-gray-400 font-medium cursor-not-allowed">ถัดไป &rarr;</span>
          )}
        </div>
      )}
    </main>
  );
}