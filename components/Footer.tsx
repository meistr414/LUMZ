import Link from "next/link";

const LEGAL_LINKS = [
  { href: "/privacy", label: "Privacy notice" },
  { href: "/terms", label: "Terms" },
  { href: "/returns", label: "Returns & exchanges" },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 text-sm">
        <div className="text-lg font-bold tracking-tight">LUMZ</div>

        <nav
          aria-label="Legal"
          className="flex flex-col gap-3 sm:flex-row sm:gap-6"
        >
          {LEGAL_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex min-h-11 items-center text-foreground/80 underline-offset-4 hover:text-foreground hover:underline sm:min-h-0"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex flex-col gap-2 text-foreground/60">
          <p>Secure checkout &middot; Visa &middot; Mastercard &middot; EFT</p>
          <p>&copy; {new Date().getFullYear()} LUMZ. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
