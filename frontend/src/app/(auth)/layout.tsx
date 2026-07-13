import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12">
      <Link href="/" className="mb-10 font-display text-2xl font-medium tracking-tight text-ink">
        MENZO <span className="text-accent">QR</span>
      </Link>
      <div className="w-full max-w-[420px]">{children}</div>
    </div>
  );
}
