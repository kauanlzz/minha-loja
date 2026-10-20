import { SearchIcon } from "lucide-react";

import { Container } from "@/components/ui/container";
import { Link } from "@/components/ui/link";
import { shopConfig } from "@/lib/config";
import type { MenuItem } from "@/lib/menu/types";

import { CartIcon } from "./cart";
import { MobileMenu } from "./mobile-menu";
import { QuickLinks } from "./quick-links";

export function Nav() {
  const items: MenuItem[] = [
    { id: "default-nav-shop", items: [], title: "Shop", url: "/collections/all" },
  ];
  return (
    <nav
      className="sticky top-0 z-30 w-full bg-background pt-[env(safe-area-inset-top,0px)] transition-shadow duration-250"
      id="nav-outer"
    >
      <Container className="flex h-16 items-center gap-2.5 md:gap-5">
        <MobileMenu items={items} />
        <Link className="flex shrink-0 items-center" href="/">
          <span className="text-xl leading-4">{shopConfig.site.name}</span>
        </Link>
        <QuickLinks items={items} />
        <div className="ml-auto flex items-center gap-5">
          <Link aria-label="Search" className="flex items-center" href="/search">
            <SearchIcon className="size-5" />
          </Link>
          <CartIcon />
        </div>
      </Container>
    </nav>
  );
}
