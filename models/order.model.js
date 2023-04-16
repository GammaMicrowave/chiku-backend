import { Schema, model } from "mongoose";

let orderSchema = Schema(
  {
    id: Number,
    items: [
      {
        details: {
          type: Schema.Types.ObjectId,
          ref: "Item",
        },
        quantity: Number,
      },
    ],
    totalPrice: Number,
    address: String,
    phoneNumber: String,
    deliveryInstructions: String,
    status: String,
    email: String,
  },
  {
    timestamps: true,
  }
);

export default model("Order", orderSchema);
