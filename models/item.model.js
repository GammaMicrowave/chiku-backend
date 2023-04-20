import { Schema, model } from "mongoose";

let itemSchema = new Schema({
  name: String,
  price: Number,
  image: String,
  flavour: String,
});

export default model("Item", itemSchema);
