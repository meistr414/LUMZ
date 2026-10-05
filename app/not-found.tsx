import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-4 px-4 py-24 text-center">
      <h1 className="text-3xl font-bold tracking-tight">Page not found</h1>
      <p className="text-foreground/70">
        The page you&apos;re looking for doesn&apos;t exist or may have moved.
      </p>
      <Button size="lg" nativeButton={false} render={<Link href="/products" />}>
        Shop the catalogue
      </Button>
    </div>
  );
}
