import "server-only";

import { z } from "zod";

const serverEnvSchema = z.object({
  API_URL: z.url(),
  NEXTAUTH_SECRET: z.string().min(1),
});

type ServerEnv = z.infer<typeof serverEnvSchema>;

let cachedServerEnv: ServerEnv | undefined;

// validado sob demanda para não exigir as variáveis durante o build
export function getServerEnv(): ServerEnv {
  cachedServerEnv ??= serverEnvSchema.parse(process.env);
  return cachedServerEnv;
}
