import type { Metadata } from "next";
import { Prompt } from "next/font/google";
import { Toaster } from "react-hot-toast"; 
import "./globals.css";

const prompt = Prompt({
  subsets: ["latin", "thai"],
  weight: ["300", "400", "500", "600", "700"],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Metier Blog Assignment",
  description: "ระบบเว็บบล็อกโดย [ชื่อของคุณ] - Technical Assignment",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <body className={`${prompt.className} antialiased bg-gray-50`}>
        <Toaster 
          position="top-center" 
          toastOptions={{
            duration: 3000,
            style: {
              background: '#333',
              color: '#fff',
              borderRadius: '10px',
              fontWeight: 'bold',
            },
          }} 
        />
        {children}
      </body>
    </html>
  );
}