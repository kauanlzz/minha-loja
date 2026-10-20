import type { Metadata } from "next";

import { NotFoundPage } from "@/components/error/not-found-page";

export const metadata: Metadata = {
  robots: { follow: false, index: false },
  title: "Page Not Found",
};

export default function NotFoundRoute() {
  return <NotFoundPage />;
}
