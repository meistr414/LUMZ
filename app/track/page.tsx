import type { Metadata } from "next";
import { TrackView } from "@/components/TrackView";

export const metadata: Metadata = {
  title: "Track your order",
  description: "Check the status of your LUMZ order.",
};

export default function TrackPage() {
  return <TrackView />;
}
