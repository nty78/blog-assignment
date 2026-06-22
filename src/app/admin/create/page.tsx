"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import Link from "next/link";

export default function AdminDashboard() {
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    coverImage: "",
  });

  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // ดักจับ Error เบื้องต้นฝั่งหน้าบ้านก่อนส่งไปหลังบ้าน
    if (formData.slug.includes(" ")) {
      toast.error("URL Slug ห้ามมีช่องว่างครับ!");
      return;
    }

    try {
      const response = await fetch("/api/blogs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setShowSuccessModal(true);
        setTimeout(() => {
          setShowSuccessModal(false);
        }, 4000);
        setFormData({ title: "", slug: "", excerpt: "", content: "", coverImage: "" });
      } else {
        toast.error("เกิดข้อผิดพลาด (URL Slug อาจจะซ้ำกับบทความอื่น)");
      }
    } catch (error) {
      console.error(error);
      toast.error("ระบบมีปัญหา กรุณาลองใหม่");
    }
  };

  return (
    <>
      <div className="max-w-3xl mx-auto p-8 relative">
        
        {/* ส่วนหัวข้อและปุ่มย้อนกลับ */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-extrabold text-gray-900">สร้างบทความใหม่</h1>
          <Link 
            href="/admin" 
            className="text-gray-600 hover:text-blue-600 font-bold transition-colors flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-gray-200 shadow-sm hover:shadow hover:border-blue-200"
          >
            &larr; กลับหน้าจัดการ
          </Link>
        </div>
        
        {/* กล่องแจ้ง,หมายเหตุ และ ข้อจำกัด (Info Box) */}
        <div className="bg-blue-50 border-l-4 border-blue-500 p-5 mb-8 rounded-r-xl shadow-sm">
          <h3 className="font-bold text-blue-800 flex items-center gap-2 mb-2">
            <span>📌</span> ข้อควรระวังก่อนสร้างบทความ
          </h3>
          <ul className="list-disc list-inside text-sm text-blue-700 space-y-1">
            <li><strong>URL Slug:</strong> ต้องไม่ซ้ำกับบทความอื่น ห้ามเว้นวรรค และแนะนำให้ใช้ภาษาอังกฤษหรือตัวเลข (เช่น <code className="bg-blue-100 px-1 rounded">my-post-01</code>)</li>
            <li><strong>รูปภาพปก:</strong> ต้องเป็นลิงก์ (URL) รูปภาพที่ถูกต้องเท่านั้น</li>
            <li>เมื่อกดบันทึกแล้ว บทความจะถูกเผยแพร่ทันที (สามารถซ่อนทีหลังได้ที่หน้า Dashboard)</li>
          </ul>
        </div>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">หัวข้อบทความ (Title)</label>
            <input 
              type="text" required
              className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="เช่น: 5 ท่า Workout เพิ่มความฟิต..."
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">URL Slug</label>
            <input 
              type="text" required
              className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              placeholder="เช่น: basketball-workout-routine"
            />
            {/* Helper Text อธิบายข้อจำกัดของฟิลด์นี้ */}
            <p className="text-xs text-gray-500 mt-2 font-medium">
              * ห้ามใช้ภาษาไทย ห้ามเว้นวรรค และใช้เครื่องหมายขีดกลาง (-) แทนการเว้นวรรค
            </p>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">คำโปรย (Excerpt)</label>
            <textarea 
              required rows={2}
              className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              placeholder="เขียนสรุปย่อๆ ให้น่าสนใจ..."
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">เนื้อหาบทความ (Content)</label>
            <textarea 
              required rows={8}
              className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="พิมพ์เนื้อหาบทความของคุณที่นี่..."
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">ลิงก์รูปภาพปก (Cover Image URL)</label>
            <input 
              type="url" required
              className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              value={formData.coverImage}
              onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
              placeholder="https://example.com/image.jpg"
            />
            <p className="text-xs text-gray-500 mt-2 font-medium">
              * ต้องขึ้นต้นด้วย http:// หรือ https:// เท่านั้น
            </p>
          </div>

          <button 
            type="submit" 
            className="mt-4 bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 shadow-md hover:shadow-lg transition-all text-lg"
          >
            บันทึกบทความ
          </button>
        </form>
      </div>

      {showSuccessModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white p-12 rounded-[2rem] shadow-2xl flex flex-col items-center max-w-sm w-full mx-4 transform transition-all scale-100 animate-bounce-short">
            <div className="w-24 h-24 bg-green-100 text-green-500 rounded-full flex items-center justify-center text-5xl mb-6 shadow-inner">
              ✓
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900 mb-3 text-center">
              บันทึกสำเร็จ!
            </h2>
            <p className="text-lg text-gray-500 font-medium text-center">
              สร้างบทความของคุณเรียบร้อยแล้ว 
            </p>
          </div>
        </div>
      )}
    </>
  );
}