import mongoose, { Schema, model, models } from 'mongoose';

/* ================= TYPE ================= */

export type CustomerType = {
  _id?: string;
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
  updatedAt?: Date;
};

/* ================= SCHEMA ================= */

const CustomerSchema = new Schema<CustomerType>(
  {
    fullName: { type: String, required: true },
    contactNo: { type: String, required: true },
    email: { type: String, required: true },
    address: { type: String, required: true },
    country: { type: String, required: true },
    state: { type: String, required: true },
    city: { type: String, required: true },
    pin: { type: String, required: true },
    referenceName: { type: String },
    referenceContact: { type: String },
  },
  {
    timestamps: true,
  }
);

/* ================= MODEL ================= */

// ✅ Export VALUE safely
export const CustomerModel =
  models.Customer || model<CustomerType>('Customer', CustomerSchema);
