"use client";

import { useParams } from "next/navigation";
import { CafeSidebar } from "@/components/layout/cafe-sidebar";
import { useCafe } from "@/hooks/use-cafes";

export default function CafeLayout({ children }: { children: React.ReactNode }) {
  const params = useParams<{ cafeId: string }>();
  const { data: cafe } = useCafe(params.cafeId);

  return (
    <div className="mx-auto flex max-w-6xl gap-8 px-0">
      <CafeSidebar cafeId={params.cafeId} cafe={cafe} />
      <div className="min-w-0 flex-1 py-2">{children}</div>
    </div>
  );
}
