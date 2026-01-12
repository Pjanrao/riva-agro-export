import mongoose, { Schema, model, models } from 'mongoose';

/* ================= TYPE ================= */

export type CustomerType = {
  _id?: string;

  fullName: string;
  contactNo: string;
  email: string;

  country: string;
  state: string;
  city: string;
  pin: string;

  latitude?: string | null;
  longitude?: string | null;

  address: string;
  referenceName?: string | null;
  referenceContact?: string | null;

  createdAt?: Date;
  updatedAt?: Date;
};

/* ================= SCHEMA ================= */

const CustomerSchema = new Schema(
  {
    fullName: { type: String, required: true },
    contactNo: { type: String, required: true },
    email: { type: String, required: true },

    country: { type: String, required: true },
    state: { type: String, required: true },
    city: { type: String, required: true },
    pin: { type: String, required: true },

    latitude: { type: String, default: null },
    longitude: { type: String, default: null },

    address: { type: String, required: true },
    referenceName: { type: String, default: null },
    referenceContact: { type: String, default: null },
  },
  { timestamps: true }
);

/* ================= MODEL ================= */

export const CustomerModel =
  models.Customer || model<CustomerType>('Customer', CustomerSchema);