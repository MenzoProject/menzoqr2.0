export type TelegramStatus = "not_connected" | "pending" | "connected" | "disconnected";

export interface TelegramAccountStatus {
  status: TelegramStatus;
  connected_at: string | null;
  link_token: string | null;
}
