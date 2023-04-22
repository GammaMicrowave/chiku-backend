import Item from "../models/item.model.js";
import Order from "../models/order.model.js";

export function redirectAdmin(req, res) {
  if (req.user) {
    return res.redirect("/admin/home");
  }
  return res.redirect("/admin");
}

export const getItem = (req, res) => {
  Item.find()
    .then((items) => {
      res.status(200).json({ items: items });
    })
    .catch((err) => {
      res.status(400).json({ error: err });
    });
};

export const createOrder = async (req, res) => {
  const { items, address, phoneNumber, name, email, pinCode } = req.body;
  // console.log(req.body);

  if (!items || !address || !phoneNumber || !email || !name || !pinCode) {
    return res.status(400).json({ error: "All fields are required" });
  }

  let totalPrice = 0;
  items.map((item) => {
    totalPrice += item.price * item.amount;
  });
  let today = new Date();
  let latestOrder = await Order.findOne({
    createdAt: {
      $gte: new Date(today.getFullYear(), today.getMonth(), today.getDate()),
    },
  }).sort({ createdAt: -1 });

  let id = 101;
  if (latestOrder) {
    id = latestOrder.id + 1;
  }

  const query = {
    id,
    items: items.map((item) => {
      return {
        details: item.id,
        quantity: item.amount,
      };
    }),
    totalPrice,
    address,
    phoneNumber,
    name,
    status: "Pending",
    email,
    pinCode,
  };

  const order = new Order(query);
  await order.save();
  res.status(200).json({ order: order });
};
