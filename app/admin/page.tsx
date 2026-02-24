import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import AdminLoginForm from "@/components/admin/AdminLoginForm";
import { authOptions } from "@/lib/auth";

export default async function AdminLoginPage() {
  const session = await getServerSession(authOptions);

  if (session?.user?.role === "ADMIN") {
    redirect("/admin/dashboard");
  }

  return <AdminLoginForm />;
}
