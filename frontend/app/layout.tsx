import "../styles/globals.css";
import React from "react";

export const metadata = { title: "Users" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body>
        <div className="container py-6">
          <h1 className="text-2xl font-semibold mb-4">Пользователи</h1>
          {children}
        </div>
      </body>
    </html>
  );
}
