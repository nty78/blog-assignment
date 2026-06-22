# Metier Blog Assignment - Software Developer

โปรเจกต์นี้เป็นส่วนหนึ่งของแบบทดสอบตำแหน่ง Software Developer (ส่วนที่ 2: Technical Assignment) 
พัฒนาระบบ Blog ที่มีฟังก์ชันการจัดการเนื้อหา (CMS) และระบบแสดงความคิดเห็นครบถ้วน

🌐 **Live Demo:** [https://blog-assignment-kla4.vercel.app](https://blog-assignment-kla4.vercel.app)

## 🛠️ Tech Stack
* **Framework:** Next.js (App Router)
* **Styling:** Tailwind CSS
* **Database:** PostgreSQL (Neon Serverless)
* **ORM:** Prisma

## ✨ Features (ตาม Requirement)
* **Public Pages:** หน้ารวมบทความพร้อมระบบค้นหาและ Pagination (หน้าละ 10 รายการ)
* **Blog Details:** แสดงรูปปก, รูปรอง (สูงสุด 6 รูป), เนื้อหา, วันที่ และยอด View
* **Comment System:** ฟอร์มส่งความคิดเห็น พร้อมระบบ Validation (อนุญาตเฉพาะภาษาไทยและตัวเลข)
* **Admin Panel (Protected):**
  * ระบบ Login สำหรับผู้ดูแลระบบ (ตรวจจับสิทธิ์ Role: `ADMIN` เท่านั้น)
  * จัดการบทความ (Create, Read, Update, Delete)
  * จัดการสถานะบทความ (Publish / Unpublish) และแก้ไข URL Slug
  * จัดการความคิดเห็น (Approve / Reject)

## 🚀 Getting Started (วิธีการรันโปรเจกต์ในเครื่อง Local)

**Clone the repository:**
   ```bash
   git clone [https://github.com/nty78/blog-assignment](https://github.com/nty78/blog-assignment)
   cd metier-blog-assignment

1. Install dependencies:
   npm install 

2. Environment Variables:
   สร้างไฟล์ .env ที่ root ของโปรเจกต์ และใส่ Connection URL ของ Database:
   DATABASE_URL="postgresql://[username]:[password]@[host]/[database]?sslmode=require" 

3. Database Setup (Prisma):
   รันคำสั่งเพื่อซิงก์ Schema เข้ากับ Database ของคุณ:
   npx prisma generate
   npx prisma db push

4. Run the development server:
   npm run dev
   เปิดเบราว์เซอร์ไปที่ http://localhost:3000

🔐 Admin Login (สำหรับทดสอบ)
สามารถเข้าสู่ระบบหลังบ้านได้ที่ /admin/login โดยใช้ข้อมูลจำลองดังนี้:

Username: admin
Password: 1234

Developed by: Teerapat Yodpayut
