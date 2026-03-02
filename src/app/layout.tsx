import "./globals.css";
import NavbarWrapper from "@/components/navbar/NavbarWrapper";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      {/* Tambahkan dark:bg-[#0a0a0a] dan transition-colors agar pergantian tema mulus */}
      <body className="bg-gray-50 dark:bg-[#0a0a0a] text-gray-900 dark:text-white pb-20 md:pb-0 md:pt-16 transition-colors duration-300">
        
        <NavbarWrapper />

        <main className="min-h-screen">
          {children}
        </main>

      </body>
    </html>
  );
}