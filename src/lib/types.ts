import { ObjectId } from 'mongodb';

/* ================= CATEGORY ================= */

export interface Category {
  _id?: ObjectId;
  id: string;
  name: string;
  slug: string;
  featured: boolean;
  image: string;
  status: 'active' | 'inactive';
}

/* ================= PRODUCT ================= */

export interface ProductUnit {
  unit: string;
  price: number;
}

export type Product = {
    _id?: string;
  id: string;
  name: string;
  description: string;
  slug: string;

  category: string;
  categoryName?: string;

  hsCode: string;

  /* 🔹 OLD (keep for backward compatibility) */
  units?: ProductUnit[];

  /* 🔹 NEW (current product model) */
  minOrderQty?: string;
  discountedPrice?: number;
  sellingPrice?: number;

  images: string[];
  primaryImage: string;

  featured: boolean;
  status: 'active' | 'inactive';
};

/* ================= CART ================= */

export interface CartItem {
  productId: string;
  variantId: string;
  quantity: number;
  price: number;
  name: string;
  variantName: string;
  image: string;
}

/* ================= ORDER ================= */

export interface ShippingAddress {
  name: string;
  address: string;
  city: string;
  country: string;
  zip: string;
}

export interface Order {
  _id?: ObjectId;
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  paymentStatus: 'Pending' | 'Paid' | 'Failed';
  paymentId?: string;
  currency: "INR" | "USD";
  createdAt: string;

}

/* ================= USER ================= */

export interface User {
  _id?: ObjectId;
  id: string;
  user_id: string;

  name: string;
  email: string;
  password?: string;

  role: "User" | "Admin";
  status?: "active" | "blocked";
  verified?: boolean;

  contactNo?: string;

  country?: string;
  state?: string;
  city?: string;
  pincode?: string;

  latitude?: number;
  longitude?: number;

  referenceName?: string;
  referenceContact?: string;

  profileCompleted?: boolean;

  createdAt?: string;
  updatedAt?: string;
}


/* ================= Customers ================= */

export type Customer = {
  id: string;
  customer_id: string;

  fullName: string;
  contactNo: string;
  email: string;
  address: string;

  country: string;
  state: string;
  city: string;
  pin: string;

  referenceName?: string;
  referenceContact?: string;

  createdAt?: Date;
};

/* ================= banners ================= */


export type Banner = {
  id: string;

  heading: string;
  subHeading?: string;

  image: string;

  button1Text: string;
  button1Link: string;

  button2Text?: string;
  productId?: string;

  position: 'HOME' | 'BRAND' | 'CATEGORY';
  order: number;
  status: 'active' | 'inactive';
};

