import { redirect } from "next/navigation";

import { HOME_ROUTE } from "@/config/routes";

export default function RootPage() {
  redirect(HOME_ROUTE);
}
