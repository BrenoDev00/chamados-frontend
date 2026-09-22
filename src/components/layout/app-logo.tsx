import { Cog } from "lucide-react";

import { cn } from "@/lib/utils";

type AppLogoProps = {
  className?: string;
};

export function AppLogo({ className }: AppLogoProps) {
  return (
    <div
      className={cn(
        "flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground",
        className,
      )}
    >
      <Cog className="size-5" aria-hidden />
    </div>
  );
}
