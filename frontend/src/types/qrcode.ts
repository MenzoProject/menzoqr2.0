export type QrCodeType = "takeaway" | "table";

export interface QrCodeTable {
  id: number;
  number: string;
}

export interface QrCode {
  id: number;
  type: QrCodeType;
  code: string;
  table: QrCodeTable | null;
  image_url: string | null;
  /** The public menu URL this QR code ultimately redirects a scan to. */
  public_url: string;
  scans_count: number;
  created_at: string;
}
