"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (res.ok) {
      router.push("/admin"); // ถ้า Login ผ่าน ให้เด้งไปหน้า Dashboard ของแอดมิน
      router.refresh();
    } else {
      const data = await res.json();
      setError(data.error); // ถ้าไม่ผ่าน ให้โชว์ข้อความแจ้งเตือนสีแดง
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-lg border border-gray-100">
        <h1 className="text-3xl font-extrabold text-center text-gray-900 mb-8">Admin Portal</h1>
        
        {error && <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-xl text-sm font-medium text-center">{error}</div>}
        
        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Username</label>
            <input 
              type="text" required 
              value={username} onChange={(e) => setUsername(e.target.value)}
              className="w-full border border-gray-300 p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition"
              placeholder="กรอกชื่อผู้ใช้งาน"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Password</label>
            <input 
              type="password" required 
              value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition"
              placeholder="กรอกรหัสผ่าน"
            />
          </div>
          <button type="submit" className="mt-4 bg-gray-900 text-white font-bold py-3.5 rounded-xl hover:bg-gray-800 transition-all shadow-md">
            เข้าสู่ระบบ
          </button>
        </form>
      </div>
    </div>
  );
}