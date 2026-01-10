export type CamperGalleryItem =
  | string
  | {
      original?: string;
      thumb?: string;
    };

export type Review = {
  reviewer_name: string;
  reviewer_rating: number;
  comment: string;
};

export type Camper = {
  id: string;
  name: string;
  price: number;
  rating: number;
  location: string;
  description: string;

  gallery?: CamperGalleryItem[];
  reviews?: Review[];

  // main features
  transmission?: 'automatic' | 'manual' | string;
  engine?: string;

  // equipment (boolean flags)
  AC?: boolean;
  bathroom?: boolean;
  kitchen?: boolean;
  TV?: boolean;
  radio?: boolean;
  refrigerator?: boolean;
  microwave?: boolean;
  gas?: boolean;
  water?: boolean;

  // details (for details page later)
  form?: string;
  length?: string;
  width?: string;
  height?: string;
  tank?: string;
  consumption?: string;
};
