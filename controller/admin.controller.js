import Item from "../models/item.model.js";
import Order from "../models/order.model.js";

export const getLogin = (req, res) => {
  return res.render("login");
};

export const getHome = (req, res) => {
  return res.render("home");
};

export const getItems = (req, res) => { 
  Item.find()
    .then((items) => {
      res.render("items", { items: items });
    })
}

export const createItem = (req, res) => {
  const { name, price, flavour, image } = req.body;

  if (!name || !price || !flavour || !image) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const item = new Item({
    name: name,
    price: price,
    flavour: flavour,
    image: image,
  });

  item.save();
  return res.redirect("/admin/items");
};

export const deleteItem = (req, res) => {
  Item.findByIdAndDelete(req.body.id)
    .then(() => {
      res.redirect("/admin/items");
    });
};

export const updateItem = (req, res) => {
  const { name, price, flavour, image } = req.body;

  if (!name || !price || !flavour || !image) {
    return res.redirect("/admin/items");
  }

  Item.findByIdAndUpdate(req.body.id, {
    name: name,
    price: price,
    flavour: flavour,
    image: image,
  })
    .then(() => {
      res.redirect("/admin/items");
    });
};

export const getOrder = (req, res) => {
  Order.find()
    .then((orders) => {
      res.status(200).json({ orders: orders });
    })
    .catch((err) => {
      res.status(400).json({ error: err });
    });
};

export const updateOrder = (req, res) => {
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ error: "All fields are required" });
  }

  Order.findByIdAndUpdate(req.body.id, {
    status: status,
  })
    .then(() => {
      res.status(200).json({ message: "Order updated" });
    })
    .catch((err) => {
      res.status(400).json({ error: err });
    });
};
