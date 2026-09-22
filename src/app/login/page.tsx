import type { Metadata } from "next";

import { AppLogo } from "@/components/layout/app-logo";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoginForm } from "@/features/auth/components/login-form";

export const metadata: Metadata = {
  title: "Login",
};

export default function LoginPage() {
  return (
    <main className="flex flex-1 items-center justify-center p-4">
      <Card className="w-full max-w-sm py-8">
        <CardHeader className="items-center justify-items-center gap-4 text-center">
          <AppLogo />
          <CardTitle className="text-2xl font-semibold">Chamados</CardTitle>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>
    </main>
  );
}
