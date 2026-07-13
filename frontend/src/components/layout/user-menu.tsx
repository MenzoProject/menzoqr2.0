"use client";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { LogOut, User as UserIcon, ChevronDown } from "lucide-react";
import { useAuth } from "@/providers/auth-provider";
import { cn } from "@/lib/utils";

export function UserMenu() {
  const { user, signOut } = useAuth();

  if (!user) return null;

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          className={cn(
            "flex items-center gap-2 rounded-card px-3 py-2 text-sm text-ink/80 transition hover:bg-ink/5"
          )}
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/10 text-accent">
            <UserIcon className="h-4 w-4" />
          </span>
          <span className="font-medium">{user.name}</span>
          <ChevronDown className="h-4 w-4 text-ink/40" />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={8}
          className="glass-surface-strong z-50 min-w-[200px] rounded-card p-1.5"
        >
          <div className="px-3 py-2 text-xs text-ink/45">{user.email}</div>
          <DropdownMenu.Separator className="my-1 h-px bg-ink/8" />
          <DropdownMenu.Item
            onSelect={() => signOut()}
            className="flex cursor-pointer items-center gap-2 rounded-[14px] px-3 py-2 text-sm text-danger outline-none transition hover:bg-danger/8"
          >
            <LogOut className="h-4 w-4" />
            Выйти
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
