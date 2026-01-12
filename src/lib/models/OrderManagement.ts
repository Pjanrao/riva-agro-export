

import mongoose, { Schema, models, model } from "mongoose";

const OrderManagementSchema = new Schema(
  {
    /* ================= CUSTOMER ================= */
    customerId: {
      type: String,
      required: true,
    },
    customerName: {
      type: String,
      required: true,
    },

    /* ================= CATEGORY ================= */
    categoryId: {
      type: String,
    },
    categoryName: {
      type: String,
    },

    /* ================= PRODUCT ================= */
    productId: {
      type: String,
      required: true,
    },
    productName: {
      type: String,
      required: true,
    },

    hsCode: {
      type: String,
    },

    minOrderQty: {
      type: Number,
      default: 0,
    },

    discountedPrice: {
      type: Number,
      default: 0,
    },

    /* ================= ORDER DETAILS ================= */
    quantity: {
      type: Number,
      required: true,
    },

    shippingCharges: {
      type: Number,
      default: 0,
    },

    taxApplied: {
      type: Boolean,
      default: false,
    },

    taxAmount: {
      type: Number,
      default: 0,
    },

    totalAmount: {
      type: Number,
      required: true,
    },

    /* ================= DELIVERY ================= */
    deliveryAddress: {
      type: String,
    },

    latitude: {
      type: String,
    },

    longitude: {
      type: String,
    },

    /* ================= STATUS ================= */
    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Shipped", "Delivered", "Cancelled"],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

export default models.OrderManagement ||
  model("OrderManagement", OrderManagementSchema);