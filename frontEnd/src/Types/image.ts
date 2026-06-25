export interface Image {
  id: string;
  name: string;
  imageUrl: string;
  publicId: string;
  category?: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateImagePayload {
  name: string;
  imageUrl: string;
  publicId: string;
}