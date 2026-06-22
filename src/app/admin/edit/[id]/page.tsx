"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

export const dynamic = 'force-dynamic';

export default function EditBlogPage() {
  const router = useRouter();
  const params = useParams();
  const blogId = params.id;

  const [formData, setFormData] = useState({
    title: "", slug: "", excerpt: "", content: "", coverImage: "", additionalImages: [] as string[]
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // ดึงข้อมูลเดิมมาแสดงตอนเปิดหน้าเว็บ
  useEffect(() => {
    fetch(`/api/blogs/${blogId}`)
      .then(res => res.json())
      .then(data => {
        if (data.error) setError(data.error);
        else setFormData({
          title: data.title, slug: data.slug, excerpt: data.excerpt,
          content: data.content, coverImage: data.coverImage,
          additionalImages: data.additionalImages || []
        });
        setLoading(false);
      });
  }, [blogId]);

  // ฟังก์ชันเพิ่มช่องใส่รูป
  const handleAddImage = () => {
    if (formData.additionalImages.length >= 6) {
      setError("โจทย์กำหนดให้ใส่รูปเพิ่มเติมได้สูงสุด 6 รูปครับ!");
      return;
    }
    setFormData({ ...formData, additionalImages: [...formData.additionalImages, ""] });
  };

  // ฟังก์ชันจัดการตอนพิมพ์ลิงก์รูป
  const handleImageChange = (index: number, value: string) => {
    const newImages = [...formData.additionalImages];
    newImages[index] = value;
    setFormData({ ...formData, additionalImages: newImages });
  };

  // ฟังก์ชันลบช่องใส่รูป
  const handleRemoveImage = (index: number) => {
    const newImages = formData.additionalImages.filter((_, i) => i !== index);
    setFormData({ ...formData, additionalImages: newImages });
    setError(""); 
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(""); setError("");

    const res = await fetch(`/api/blogs/${blogId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData)
    });

    if (res.ok) {
      setMessage("อัปเดตบทความสำเร็จ! กำลังกลับไปหน้า Dashboard...");
      setTimeout(() => {
        router.push('/admin');
        router.refresh();
      }, 1500);
    } else {
      const errData = await res.json();
      setError(errData.error || "เกิดข้อผิดพลาด");
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center font-bold text-xl text-gray-500">กำลังโหลดข้อมูล... ⏳</div>;

  return (
    <div className="p-8 max-w-4xl mx-auto bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900">แก้ไขบทความ</h1>
        <Link href="/admin" className="text-blue-600 font-semibold hover:underline">
          &larr; กลับหน้าแอดมิน
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-200 flex flex-col gap-6">
        {message && <div className="p-4 bg-green-100 text-green-800 rounded-xl font-medium">{message}</div>}
        {error && <div className="p-4 bg-red-100 text-red-800 rounded-xl font-medium">{error}</div>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">ชื่อบทความ (Title)</label>
            <input type="text" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full border border-gray-300 p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            {/* ฟีเจอร์แก้ไข Slug ตามโจทย์ */}
            <label className="block text-sm font-bold text-gray-700 mb-2">URL Slug (ห้ามซ้ำกับบทความอื่น)</label>
            <input type="text" required value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} className="w-full border border-gray-300 p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">คำโปรย (Excerpt)</label>
          <input type="text" required value={formData.excerpt} onChange={e => setFormData({...formData, excerpt: e.target.value})} className="w-full border border-gray-300 p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">เนื้อหาบทความ (Content)</label>
          <textarea required rows={8} value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} className="w-full border border-gray-300 p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"></textarea>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">ลิงก์รูปภาพปก (Cover Image URL)</label>
          <input type="url" required value={formData.coverImage} onChange={e => setFormData({...formData, coverImage: e.target.value})} className="w-full border border-gray-300 p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" />
        </div>

        {/* --- ส่วนจัดรูปรอง 6 รูป ตามโจทย์ --- */}
        <div className="border-t border-gray-100 pt-6 mt-2">
          <div className="flex justify-between items-center mb-4">
            <label className="block text-sm font-bold text-gray-700">รูปภาพเพิ่มเติม (ใส่ได้สูงสุด 6 รูป)</label>
            <button type="button" onClick={handleAddImage} className="text-sm bg-blue-100 text-blue-700 px-4 py-2 rounded-lg font-bold hover:bg-blue-200 transition shadow-sm">
              + เพิ่มช่องใส่ลิงก์รูปภาพ
            </button>
          </div>

          <div className="flex flex-col gap-3">
            {formData.additionalImages.map((img, index) => (
              <div key={index} className="flex gap-2 items-center">
                <span className="text-gray-400 font-bold w-6 text-right">{index + 1}.</span>
                <input type="url" placeholder="วางลิงก์รูปภาพที่นี่..." value={img} onChange={e => handleImageChange(index, e.target.value)} className="flex-grow border border-gray-300 p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" />
                <button type="button" onClick={() => handleRemoveImage(index)} className="bg-red-50 text-red-600 px-4 py-3 rounded-xl font-bold hover:bg-red-100 transition">
                  ลบ
                </button>
              </div>
            ))}
            {formData.additionalImages.length === 0 && (
              <p className="text-sm text-gray-400 italic bg-gray-50 p-4 rounded-xl text-center border border-dashed border-gray-200">ยังไม่ได้เพิ่มรูปภาพเพิ่มเติม...</p>
            )}
          </div>
        </div>

        <button type="submit" className="mt-6 bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 shadow-md transition text-lg">
          บันทึกการแก้ไข
        </button>
      </form>
    </div>
  );
}