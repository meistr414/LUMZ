import { Lock, RotateCcw, Truck } from "lucide-react";
import type { ComponentType } from "react";

const ITEMS: {
  icon: ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  title: string;
  description: string;
}[] = [
  {
    icon: Truck,
    title: "Nationwide delivery",
    description: "We deliver across South Africa",
  },
  {
    icon: Lock,
    title: "Secure checkout",
    description: "Your details are always protected",
  },
  {
    icon: RotateCcw,
    title: "Easy returns",
    description: "Hassle-free returns and exchanges",
  },
];

export function TrustStrip() {
  return (
    <div className="grid grid-cols-1 gap-6 border-y border-border py-8 sm:grid-cols-3">
      {ITEMS.map(({ icon: Icon, title, description }) => (
        <div key={title} className="flex items-center gap-3 px-4">
          <Icon className="size-6 shrink-0 text-brand" aria-hidden />
          <div>
            <p className="text-sm font-medium">{title}</p>
            <p className="text-xs text-foreground/60">{description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
