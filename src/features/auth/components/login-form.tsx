"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Eye, EyeOff, LoaderCircle, Lock, Mail } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { HOME_ROUTE } from "@/config/routes";
import {
  loginSchema,
  type LoginFormValues,
} from "@/features/auth/schemas/login-schema";

const INVALID_CREDENTIALS_ERROR = "CredentialsSignin";

export function LoginForm() {
  const router = useRouter();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(values: LoginFormValues) {
    const result = await signIn("credentials", { ...values, redirect: false });

    if (!result?.ok) {
      setError("root", {
        message:
          result?.error === INVALID_CREDENTIALS_ERROR
            ? "E-mail ou senha inválidos."
            : "Não foi possível entrar. Tente novamente.",
      });
      return;
    }

    router.replace(HOME_ROUTE);
    router.refresh();
  }

  const PasswordVisibilityIcon = isPasswordVisible ? Eye : EyeOff;

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <FieldGroup>
        <Field data-invalid={!!errors.email}>
          <FieldLabel htmlFor="email">E-mail institucional</FieldLabel>
          <InputGroup className="h-9">
            <InputGroupAddon>
              <Mail aria-hidden />
            </InputGroupAddon>
            <InputGroupInput
              id="email"
              type="email"
              autoComplete="email"
              placeholder="tecnico@empresa.com"
              aria-invalid={!!errors.email}
              {...register("email")}
            />
          </InputGroup>
          <FieldError errors={[errors.email]} />
        </Field>

        <Field data-invalid={!!errors.password}>
          <FieldLabel htmlFor="password">Senha</FieldLabel>
          <InputGroup className="h-9">
            <InputGroupAddon>
              <Lock aria-hidden />
            </InputGroupAddon>
            <InputGroupInput
              id="password"
              type={isPasswordVisible ? "text" : "password"}
              autoComplete="current-password"
              placeholder="••••••••"
              aria-invalid={!!errors.password}
              {...register("password")}
            />
            <InputGroupAddon align="inline-end">
              <InputGroupButton
                size="icon-xs"
                aria-label={isPasswordVisible ? "Ocultar senha" : "Mostrar senha"}
                onClick={() => setIsPasswordVisible((visible) => !visible)}
              >
                <PasswordVisibilityIcon />
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
          <FieldError errors={[errors.password]} />
        </Field>

        <FieldError errors={[errors.root]} />

        <Button type="submit" className="h-9 w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <LoaderCircle className="animate-spin" aria-hidden />
          ) : (
            <>
              Entrar
              <ArrowRight aria-hidden />
            </>
          )}
        </Button>
      </FieldGroup>
    </form>
  );
}
