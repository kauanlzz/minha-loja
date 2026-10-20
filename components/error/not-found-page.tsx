import { Container } from "@/components/ui/container";
import { Link } from "@/components/ui/link";
import { Page } from "@/components/ui/page";

export function NotFoundPage() {
  return (
    <Page className="flex flex-1 flex-col">
      <Container className="flex flex-1 flex-col items-center justify-center text-center">
        <div className="flex flex-col items-center gap-2.5">
          <h1 className="text-3xl sm:text-4xl md:text-5xl">Page Not Found</h1>
          <p className="max-w-xl text-sm text-muted-foreground md:text-base">
            The link may be incorrect, or the page has been removed.
          </p>
          <Link
            href="/collections/all"
            className="inline-flex h-12 items-center justify-center rounded-lg bg-primary px-8 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Continue Shopping
          </Link>
        </div>
      </Container>
    </Page>
  );
}
