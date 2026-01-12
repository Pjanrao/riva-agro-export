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

/* ================= SHIPPING ADDRESS ================= */

export interface ShippingAddress {
  name: string;
  address: string;
  city: string;
  country: string;
  zip: string;
}
/* ================= ORDER (CUSTOMER CHECKOUT) ================= */
/**
 * THIS IS THE ORDER USED IN:
 * - /api/orders
 * - /admin/orders
 * - checkout flow
 */
export interface Order {
  _id?: ObjectId;
  id: string;
  userId: 
    | string
    | {
        _id?: ObjectId;
        name: string;
        email: string;
        contact?: string;
      };
  items: CartItem[];
  total: number;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  paymentStatus: 'Pending' | 'Paid' | 'Failed';
  paymentId?: string;
  currency: "INR" | "USD";
  resetPasswordToken?: string;
resetPasswordExpire?: Date;
  createdAt: string;
  updatedAt?: string;
 
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
  _id?: ObjectId;
  id: string;
  customer_id: string;

  fullName: string;
  contactNo: string;
  email: string;
  address: string;

   latitude?: string;
  longitude?: string;

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

/* =========================================================
   🔥 ADMIN MANUAL ORDER (OPTIONAL – KEEP SEPARATE)
========================================================= */

export interface AdminOrder {
  _id?: ObjectId;
  id?: string;

  customerId: string;
  customerName: string;

  productId: string;
  productName: string;

  hsCode?: string;
  minOrderQty?: string;

  quantity: number;
  discountedPrice?: number;

  shippingCharges?: number;
  taxApplied?: boolean;
  taxAmount?: number;

  totalAmount: number;

  deliveryAddress?: string;

  latitude?: string;
  longitude?: string;

  status?: "Pending" | "Confirmed" | "Shipped" | "Delivered" | "Cancelled";

  createdAt?: Date;
  updatedAt?: Date;
}

export interface Enquiry {
  _id?: string;
  productId: string;
  productName: string;
  category?: string;

  name: string;
  email: string;
  phone?: string;
  quantity?: string;
  message?: string;

  createdAt: Date;
}
