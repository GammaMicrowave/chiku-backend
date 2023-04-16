import Item from "../models/item.model";
import Order from "../models/order.model.js";

export const getItem = (req, res) => {
  Item.find((err, items) => {
    if (err) {
      res.status(400).json({ error: err });
    }
    res.status(200).json({ items: items });
  });
};

export const createOrder = (req, res) => {
  const {
    items,
    totalPrice,
    address,
    phoneNumber,
    deliveryInstructions,
    status,
    email,
  } = req.body;

  if (!items || !totalPrice || !address || !phoneNumber || !status) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const order = new Order({
    items: items,
    totalPrice: totalPrice,
    address: address,
    phoneNumber: phoneNumber,
    deliveryInstructions: deliveryInstructions,
    status: status,
    email: email,
  });

  order
    .save()
    .then((data) => {
      res.status(200).json({ order: data });
    })
    .catch((err) => {
      res.status(400).json({ error: err });
    });
};
