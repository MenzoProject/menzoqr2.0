"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import { Plus, Image as ImageIcon, Gift } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useCafe } from "@/hooks/use-cafes";
import { useBanners, useDeleteBanner } from "@/hooks/use-banners";
import { useComboOffers, useDeleteComboOffer } from "@/hooks/use-combo-offers";
import { BannerFormDialog } from "@/components/cafes/banner-form-dialog";
import { BannerCard } from "@/components/cafes/banner-card";
import { ComboOfferFormDialog } from "@/components/cafes/combo-offer-form-dialog";
import { ComboOfferCard } from "@/components/cafes/combo-offer-card";
import { useToast } from "@/providers/toast-provider";
import type { Banner } from "@/types/banner";
import type { ComboOffer } from "@/types/combo-offer";

export default function HomeContentPage() {
  const params = useParams<{ cafeId: string }>();
  const { data: cafe } = useCafe(params.cafeId);
  const currency = cafe?.currency ?? "RUB";

  const { data: banners, isLoading: bannersLoading } = useBanners(params.cafeId);
  const deleteBanner = useDeleteBanner(params.cafeId);
  const [bannerDialogOpen, setBannerDialogOpen] = React.useState(false);
  const [editingBanner, setEditingBanner] = React.useState<Banner | null>(null);
  const [deleteBannerTarget, setDeleteBannerTarget] = React.useState<Banner | null>(null);

  const { data: combos, isLoading: combosLoading } = useComboOffers(params.cafeId);
  const deleteCombo = useDeleteComboOffer(params.cafeId);
  const [comboDialogOpen, setComboDialogOpen] = React.useState(false);
  const [editingCombo, setEditingCombo] = React.useState<ComboOffer | null>(null);
  const [deleteComboTarget, setDeleteComboTarget] = React.useState<ComboOffer | null>(null);

  const { toast } = useToast();

  return (
    <div className="flex flex-col gap-10">
      <PageHeader
        title="Главная"
        description="Баннеры и «Комбо дня», которые гости видят на главном экране меню."
      />

      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-lg font-semibold text-ink">Баннеры</h2>
            <p className="text-sm text-muted">Слайды в верхней части главной страницы меню.</p>
          </div>
          <Button
            onClick={() => {
              setEditingBanner(null);
              setBannerDialogOpen(true);
            }}
          >
            <Plus className="h-4 w-4" />
            Новый баннер
          </Button>
        </div>

        {bannersLoading && (
          <div className="flex flex-col gap-3">
            {[0, 1].map((key) => (
              <Skeleton key={key} className="h-24 w-full" />
            ))}
          </div>
        )}

        {!bannersLoading && banners?.length === 0 && (
          <Card>
            <EmptyState
              icon={ImageIcon}
              title="Пока нет баннеров"
              description="Без баннера главная страница покажет только название и адрес кафе."
              action={
                <Button
                  onClick={() => {
                    setEditingBanner(null);
                    setBannerDialogOpen(true);
                  }}
                >
                  <Plus className="h-4 w-4" />
                  Добавить баннер
                </Button>
              }
            />
          </Card>
        )}

        {!bannersLoading && banners && banners.length > 0 && (
          <div className="flex flex-col gap-3">
            {banners.map((banner) => (
              <BannerCard
                key={banner.id}
                banner={banner}
                onEdit={() => {
                  setEditingBanner(banner);
                  setBannerDialogOpen(true);
                }}
                onDelete={() => setDeleteBannerTarget(banner)}
              />
            ))}
          </div>
        )}
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-lg font-semibold text-ink">Комбо дня</h2>
            <p className="text-sm text-muted">Промо-предложение с выгодной ценой на главной странице меню.</p>
          </div>
          <Button
            onClick={() => {
              setEditingCombo(null);
              setComboDialogOpen(true);
            }}
          >
            <Plus className="h-4 w-4" />
            Новое комбо
          </Button>
        </div>

        {combosLoading && (
          <div className="flex flex-col gap-3">
            {[0, 1].map((key) => (
              <Skeleton key={key} className="h-24 w-full" />
            ))}
          </div>
        )}

        {!combosLoading && combos?.length === 0 && (
          <Card>
            <EmptyState
              icon={Gift}
              title="Пока нет комбо-предложений"
              description="Добавьте комбо, чтобы показать гостям выгодное предложение на главной странице."
              action={
                <Button
                  onClick={() => {
                    setEditingCombo(null);
                    setComboDialogOpen(true);
                  }}
                >
                  <Plus className="h-4 w-4" />
                  Добавить комбо
                </Button>
              }
            />
          </Card>
        )}

        {!combosLoading && combos && combos.length > 0 && (
          <div className="flex flex-col gap-3">
            {combos.map((combo) => (
              <ComboOfferCard
                key={combo.id}
                comboOffer={combo}
                currency={currency}
                onEdit={() => {
                  setEditingCombo(combo);
                  setComboDialogOpen(true);
                }}
                onDelete={() => setDeleteComboTarget(combo)}
              />
            ))}
          </div>
        )}
      </section>

      <BannerFormDialog
        cafeId={params.cafeId}
        open={bannerDialogOpen}
        onOpenChange={setBannerDialogOpen}
        banner={editingBanner}
      />

      <ConfirmDialog
        open={Boolean(deleteBannerTarget)}
        onOpenChange={(open) => !open && setDeleteBannerTarget(null)}
        title="Удалить этот баннер?"
        description="Он больше не будет показываться на главной странице меню."
        isLoading={deleteBanner.isPending}
        onConfirm={() => {
          if (!deleteBannerTarget) return;
          deleteBanner.mutate(deleteBannerTarget.id, {
            onSuccess: () => {
              toast({ title: "Баннер удалён" });
              setDeleteBannerTarget(null);
            },
          });
        }}
      />

      <ComboOfferFormDialog
        cafeId={params.cafeId}
        open={comboDialogOpen}
        onOpenChange={setComboDialogOpen}
        comboOffer={editingCombo}
      />

      <ConfirmDialog
        open={Boolean(deleteComboTarget)}
        onOpenChange={(open) => !open && setDeleteComboTarget(null)}
        title="Удалить это комбо?"
        description="Оно больше не будет показываться на главной странице меню."
        isLoading={deleteCombo.isPending}
        onConfirm={() => {
          if (!deleteComboTarget) return;
          deleteCombo.mutate(deleteComboTarget.id, {
            onSuccess: () => {
              toast({ title: "Комбо удалено" });
              setDeleteComboTarget(null);
            },
          });
        }}
      />
    </div>
  );
}
