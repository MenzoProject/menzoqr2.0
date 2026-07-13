"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import { Plus, LayoutList } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useCafe } from "@/hooks/use-cafes";
import { useCategories, useDeleteCategory } from "@/hooks/use-categories";
import { useDeleteDish } from "@/hooks/use-dishes";
import { CategoryFormDialog } from "@/components/menu/category-form-dialog";
import { DishFormDialog } from "@/components/menu/dish-form-dialog";
import { CategorySection } from "@/components/menu/category-section";
import { useToast } from "@/providers/toast-provider";
import type { Category, Dish } from "@/types/menu";

export default function MenuPage() {
  const params = useParams<{ cafeId: string }>();
  const { data: cafe } = useCafe(params.cafeId);
  const { data: categories, isLoading } = useCategories(params.cafeId);
  const deleteCategory = useDeleteCategory(params.cafeId);
  const { toast } = useToast();

  const [categoryDialog, setCategoryDialog] = React.useState<{ open: boolean; category: Category | null }>({
    open: false,
    category: null,
  });
  const [dishDialog, setDishDialog] = React.useState<{
    open: boolean;
    categoryId: number | null;
    dish: Dish | null;
  }>({ open: false, categoryId: null, dish: null });
  const [deleteCategoryTarget, setDeleteCategoryTarget] = React.useState<Category | null>(null);
  const [deleteDishTarget, setDeleteDishTarget] = React.useState<{ categoryId: number; dish: Dish } | null>(null);

  const deleteDish = useDeleteDish(params.cafeId, deleteDishTarget?.categoryId ?? "");

  const currency = cafe?.currency ?? "RUB";

  return (
    <div>
      <PageHeader
        title="Меню"
        description="Категории и блюда, которые видят гости в публичном меню."
        action={
          <Button onClick={() => setCategoryDialog({ open: true, category: null })}>
            <Plus className="h-4 w-4" />
            Категория
          </Button>
        }
      />

      {isLoading && (
        <div className="flex flex-col gap-6">
          {[0, 1].map((key) => (
            <div key={key} className="flex flex-col gap-3">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-24 w-full" />
            </div>
          ))}
        </div>
      )}

      {!isLoading && categories?.length === 0 && (
        <EmptyState
          icon={LayoutList}
          title="Пока нет категорий"
          description="Создайте первую категорию, например «Напитки» или «Основные блюда», чтобы начать заполнять меню."
          action={
            <Button onClick={() => setCategoryDialog({ open: true, category: null })}>
              <Plus className="h-4 w-4" />
              Создать категорию
            </Button>
          }
        />
      )}

      {!isLoading && categories && categories.length > 0 && (
        <div className="flex flex-col gap-10">
          {categories.map((category) => (
            <CategorySection
              key={category.id}
              category={category}
              currency={currency}
              onEditCategory={() => setCategoryDialog({ open: true, category })}
              onDeleteCategory={() => setDeleteCategoryTarget(category)}
              onAddDish={() => setDishDialog({ open: true, categoryId: category.id, dish: null })}
              onEditDish={(dish) => setDishDialog({ open: true, categoryId: category.id, dish })}
              onDeleteDish={(dish) => setDeleteDishTarget({ categoryId: category.id, dish })}
            />
          ))}
        </div>
      )}

      <CategoryFormDialog
        cafeId={params.cafeId}
        open={categoryDialog.open}
        onOpenChange={(open) => setCategoryDialog((current) => ({ ...current, open }))}
        category={categoryDialog.category}
      />

      {dishDialog.categoryId !== null && (
        <DishFormDialog
          cafeId={params.cafeId}
          categoryId={dishDialog.categoryId}
          open={dishDialog.open}
          onOpenChange={(open) => setDishDialog((current) => ({ ...current, open }))}
          dish={dishDialog.dish}
        />
      )}

      <ConfirmDialog
        open={Boolean(deleteCategoryTarget)}
        onOpenChange={(open) => !open && setDeleteCategoryTarget(null)}
        title={`Удалить категорию «${deleteCategoryTarget?.name}»?`}
        description="Все блюда в этой категории также будут удалены. Это действие нельзя отменить."
        isLoading={deleteCategory.isPending}
        onConfirm={() => {
          if (!deleteCategoryTarget) return;
          deleteCategory.mutate(deleteCategoryTarget.id, {
            onSuccess: () => {
              toast({ title: "Категория удалена" });
              setDeleteCategoryTarget(null);
            },
          });
        }}
      />

      <ConfirmDialog
        open={Boolean(deleteDishTarget)}
        onOpenChange={(open) => !open && setDeleteDishTarget(null)}
        title={`Удалить блюдо «${deleteDishTarget?.dish.name}»?`}
        isLoading={deleteDish.isPending}
        onConfirm={() => {
          if (!deleteDishTarget) return;
          deleteDish.mutate(deleteDishTarget.dish.id, {
            onSuccess: () => {
              toast({ title: "Блюдо удалено" });
              setDeleteDishTarget(null);
            },
          });
        }}
      />
    </div>
  );
}
