"use client";

import { useState } from "react";

export default function CommentForm({ blogId }: { blogId: number }) {
  const [senderName, setSenderName] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // แนวทางการ Validate: ใช้ Regex ตรวจสอบภาษาไทย ตัวเลข และช่องว่าง
  // ^ เริ่มต้น, [ก-๙] ตัวอักษรและสระภาษาไทย, [0-9] ตัวเลข, \s ช่องว่าง, + มีตั้งแต่ 1 ตัวขึ้นไป, $ สิ้นสุด
  const validateThaiAndNumber = (text: string) => {
    const regex = /^[ก-๙0-9\s]+$/;
    return regex.test(text);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    // ตรวจสอบข้อมูลก่อนส่ง (Front-end Validation)
    if (!validateThaiAndNumber(content)) {
      setError("กรุณากรอกข้อความคอมเมนต์เป็นภาษาไทย หรือ ตัวเลขเท่านั้นครับ");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ blogId, senderName, content }),
      });

      if (response.ok) {
        setSuccess(true);
        setSenderName("");
        setContent("");
      } else {
        const data = await response.json();
        setError(data.error || "เกิดข้อผิดพลาดในการส่งข้อมูล");
      }
    } catch (err) {
      console.error("Comment Submit Error:", err); 
      setError("ระบบมีปัญหา กรุณาลองใหม่อีกครั้ง");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
      <h4 className="font-bold text-gray-800 mb-4">ร่วมแสดงความคิดเห็น</h4>
      
      {error && <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg">{error}</div>}
      {success && <div className="mb-4 p-3 bg-green-50 text-green-600 text-sm rounded-lg">ส่งความคิดเห็นเรียบร้อยแล้ว รอการอนุมัติจากผู้ดูแลระบบครับ</div>}

      <div className="mb-4">
        <label className="block text-sm font-bold text-gray-700 mb-2">ชื่อผู้ส่ง <span className="text-red-500">*</span></label>
        <input
          type="text" required
          className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
          value={senderName}
          onChange={(e) => setSenderName(e.target.value)}
          placeholder="กรอกชื่อของคุณ"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-bold text-gray-700 mb-2">ข้อความ (ภาษาไทย/ตัวเลข เท่านั้น) <span className="text-red-500">*</span></label>
        <textarea
          required rows={3}
          className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
          value={content}
          onChange={(e) => {
            setContent(e.target.value);
            setError(""); // เคลียร์ Error เมื่อเริ่มพิมพ์ใหม่
          }}
          placeholder="พิมพ์ความคิดเห็นของคุณที่นี่..."
        ></textarea>
      </div>

      <button
        type="submit" disabled={isSubmitting}
        className="bg-gray-900 text-white font-bold py-3 px-6 rounded-xl hover:bg-gray-800 disabled:bg-gray-400 transition"
      >
        {isSubmitting ? "กำลังส่ง..." : "ส่งความคิดเห็น"}
      </button>
    </form>
  );
}