export const endpoints = {
  auth: {
    register: "/auth/register",
    login: "/auth/login",
    logout: "/auth/logout",
    me: "/auth/me",
  },
  owner: {
    cafes: "/owner/cafes",
    cafe: (cafeId: number | string) => `/owner/cafes/${cafeId}`,
    categories: (cafeId: number | string) => `/owner/cafes/${cafeId}/categories`,
    category: (cafeId: number | string, categoryId: number | string) =>
      `/owner/cafes/${cafeId}/categories/${categoryId}`,
    dishes: (cafeId: number | string, categoryId: number | string) =>
      `/owner/cafes/${cafeId}/categories/${categoryId}/dishes`,
    dish: (cafeId: number | string, categoryId: number | string, dishId: number | string) =>
      `/owner/cafes/${cafeId}/categories/${categoryId}/dishes/${dishId}`,
    qrCodes: (cafeId: number | string) => `/owner/cafes/${cafeId}/qr-codes`,
    qrCode: (cafeId: number | string, qrCodeId: number | string) =>
      `/owner/cafes/${cafeId}/qr-codes/${qrCodeId}`,
    banners: (cafeId: number | string) => `/owner/cafes/${cafeId}/banners`,
    banner: (cafeId: number | string, bannerId: number | string) =>
      `/owner/cafes/${cafeId}/banners/${bannerId}`,
    comboOffers: (cafeId: number | string) => `/owner/cafes/${cafeId}/combo-offers`,
    comboOffer: (cafeId: number | string, comboOfferId: number | string) =>
      `/owner/cafes/${cafeId}/combo-offers/${comboOfferId}`,
    orders: (cafeId: number | string) => `/owner/cafes/${cafeId}/orders`,
    order: (cafeId: number | string, orderId: number | string) => `/owner/cafes/${cafeId}/orders/${orderId}`,
    orderStatus: (cafeId: number | string, orderId: number | string) =>
      `/owner/cafes/${cafeId}/orders/${orderId}/status`,
    staff: (cafeId: number | string) => `/owner/cafes/${cafeId}/staff`,
    staffMember: (cafeId: number | string, userId: number | string) =>
      `/owner/cafes/${cafeId}/staff/${userId}`,
    telegram: (cafeId: number | string) => `/owner/cafes/${cafeId}/telegram`,
    telegramConnect: (cafeId: number | string) => `/owner/cafes/${cafeId}/telegram/connect`,
    telegramDisconnect: (cafeId: number | string) => `/owner/cafes/${cafeId}/telegram/disconnect`,
    settings: (cafeId: number | string) => `/owner/cafes/${cafeId}/settings`,
  },
  public: {
    menu: (cafeSlug: string) => `/public/menu/${cafeSlug}`,
    orders: (cafeSlug: string) => `/public/menu/${cafeSlug}/orders`,
    orderStatus: (orderNumber: string) => `/public/orders/${orderNumber}/status`,
  },
} as const;
