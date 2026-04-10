import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "DiinTech Admin Panel",
  description: "Manage Diin Technologies content",
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="admin-root min-h-screen">
      {children}
    </div>
  );
}
