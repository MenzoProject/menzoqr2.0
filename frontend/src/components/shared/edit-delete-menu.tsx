"use client";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface EditDeleteMenuProps {
  onEdit: () => void;
  onDelete: () => void;
  editLabel?: string;
  deleteLabel?: string;
  triggerClassName?: string;
}

/**
 * The "⋮ → Изменить / Удалить" dropdown used across menu management cards
 * (dishes, categories). Extracted once both call sites turned out to be
 * pixel-for-pixel identical, so styling and behavior only need updating here.
 */
export function EditDeleteMenu({
  onEdit,
  onDelete,
  editLabel = "Изменить",
  deleteLabel = "Удалить",
  triggerClassName,
}: EditDeleteMenuProps) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger
        className={cn(
          "rounded-full p-1.5 text-muted transition hover:bg-ink/5 hover:text-ink",
          triggerClassName
        )}
        aria-label="Действия"
      >
        <MoreVertical className="h-4 w-4" />
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content align="end" className="glass-surface-strong z-50 min-w-[160px] rounded-card p-1.5">
          <DropdownMenu.Item
            onSelect={onEdit}
            className="flex cursor-pointer items-center gap-2 rounded-[14px] px-3 py-2 text-sm outline-none transition hover:bg-ink/5"
          >
            <Pencil className="h-4 w-4" />
            {editLabel}
          </DropdownMenu.Item>
          <DropdownMenu.Item
            onSelect={onDelete}
            className="flex cursor-pointer items-center gap-2 rounded-[14px] px-3 py-2 text-sm text-danger outline-none transition hover:bg-danger/8"
          >
            <Trash2 className="h-4 w-4" />
            {deleteLabel}
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
