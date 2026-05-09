export type SignedUpload = {
  uploadUrl: string;
  key: string;
  expiresIn: number;
  headers?: Record<string, string>;
};

export interface StorageProvider {
  getSignedUploadUrl(input: {
    key: string;
    mimeType: string;
    size: number;
  }): Promise<SignedUpload>;
}
