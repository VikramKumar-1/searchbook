export interface UploadResult {
  urls: string[];
  url: string;
  count: number;
}

export interface CloudinaryApiResponse {
  secure_url: string;
  public_id: string;
  format: string;
  bytes: number;
  width?: number;
  height?: number;
  error?: {
    message: string;
  };
}
