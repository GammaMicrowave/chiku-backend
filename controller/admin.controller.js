import Item from "../models/item.model.js";
import Order from "../models/order.model.js";
import nodemailer from "nodemailer";
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  auth: {
    user: process.env.MAIL_EMAIL,
    pass: process.env.MAIL_PASSWORD,
  },
});

export const getLogin = (req, res) => {
  return res.render("login");
};

export const getHome = (req, res) => {
  return res.render("home");
};

export const getItems = (req, res) => {
  Item.find().then((items) => {
    res.render("items", { items: items });
  });
};

export const createItem = (req, res) => {
  const { name, price, flavour, image } = req.body;

  if (!name || !price || !image) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const item = new Item({
    name: name,
    price: price,
    flavour: flavour || "",
    image: image,
  });

  item.save();
  return res.redirect("/admin/items");
};

export const deleteItem = (req, res) => {
  Item.findByIdAndDelete(req.body.id).then(() => {
    res.redirect("/admin/items");
  });
};

export const updateItem = (req, res) => {
  const { name, price, flavour, image } = req.body;

  if (!name || !price || !image) {
    return res.redirect("/admin/items");
  }

  Item.findByIdAndUpdate(req.body.id, {
    name: name,
    price: price,
    flavour: flavour || "",
    image: image,
  }).then(() => {
    res.redirect("/admin/items");
  });
};

export const getOrder = (req, res) => {
  let today = new Date();
  let recentOrders = Order.find({
    createdAt: {
      $gte: new Date(today.getFullYear(), today.getMonth(), today.getDate()),
    },
    status: {
      $in: ["Pending", "Accepted"],
    },
  })
    .sort({ createdAt: -1, status: -1 })
    .populate("items.details");

  let previousOrders = Order.find({
    createdAt: {
      $lte: new Date(today.getFullYear(), today.getMonth(), today.getDate()),
    },
    status: {
      $in: ["Pending", "Accepted"],
    },
  })
    .sort({ createdAt: -1, status: -1 })
    .populate("items.details");

  let totalOrders = Order.countDocuments({});
  let totalDeliveredOrders = Order.countDocuments({ status: "Delivered" });

  let todayOrders = Order.countDocuments({
    createdAt: {
      $gte: new Date(today.getFullYear(), today.getMonth(), today.getDate()),
    },
  });
  let todayDeliveredOrders = Order.countDocuments({
    createdAt: {
      $gte: new Date(today.getFullYear(), today.getMonth(), today.getDate()),
    },
    status: "Delivered",
  });

  Promise.all([
    recentOrders,
    previousOrders,
    totalOrders,
    totalDeliveredOrders,
    todayOrders,
    todayDeliveredOrders,
  ]).then(
    ([
      recentOrders,
      previousOrders,
      totalOrders,
      totalDeliveredOrders,
      todayOrders,
      todayDeliveredOrders,
    ]) => {
      return res.render("orders", {
        recentOrders,
        previousOrders,
        stats: {
          totalOrders,
          totalDeliveredOrders,
          todayOrders,
          todayDeliveredOrders,
        },
      });
    }
  );
};

export const rejectOrder = async (req, res) => {
  const { id } = req.body;
  const data = await Order.findByIdAndUpdate(id, {
    status: "Rejected",
  });
  let orderDate = new Date(data.createdAt);
  const mailData = {
    from: `Chiku Foods <${process.env.MAIL_EMAIL}>`, // sender address
    to: data.email, // list of receivers
    subject: `Chiku Order Rejected`,
    text: `
Your order has been rejected.
Your order id is : ${data.id},
Your order amount is : ${data.totalPrice},
Your order was created at : ${orderDate.getDate()}-${
      orderDate.getMonth() + 1
    }-${orderDate.getFullYear()} ${orderDate.getHours()}:${orderDate.getMinutes()}
Please contact us at ${process.env.CONTACT_NUMBER} for more details.
We are sorry for your inconvenience. Thank you for choosing us.`,
  };

  transporter.sendMail(mailData, function (err, info) {
    if (err) console.log(err);
    else console.log(info);
    return res.redirect("/admin/orders");
  });
};

export const acceptOrder = async (req, res) => {
  const { id } = req.body;

  const data = await Order.findByIdAndUpdate(id, {
    status: "Accepted",
  });
  let orderDate = new Date(data.createdAt);
  const mailData = {
    from: `Chiku Foods <${process.env.MAIL_EMAIL}>`, // sender address
    to: data.email, // list of receivers
    subject: `Chiku Order Accepted`,
    text: `
Your order has been accepted.
Your order id is : ${data.id},
Your order amount is : ${data.totalPrice},
Your order was created at : ${orderDate.getDate()}-${
  orderDate.getMonth() + 1
}-${orderDate.getFullYear()} ${orderDate.getHours()}:${orderDate.getMinutes()}
Please contact us at ${process.env.CONTACT_NUMBER} for more details.
We will deliver it soon. Thank you for choosing us.`,
  };

  transporter.sendMail(mailData, function (err, info) {
    if (err) console.log(err);
    else console.log(info);
    return res.redirect("/admin/orders");
  });
};

export const deliveredOrder = async (req, res) => {
  const { id } = req.body;
  const data = await Order.findByIdAndUpdate(id, {
    status: "Delivered",
  });
  let orderDate = new Date(data.createdAt);
  const mailData = {
    from: `Chiku Foods <${process.env.MAIL_EMAIL}>`, // sender address
    to: data.email, // list of receivers
    subject: `Chiku Order Delivered`,
    text: `
Your order has been delivered successfully.
Your order id is : ${data.id},
Your order amount is : ${data.totalPrice},
Your order was created at : ${orderDate.getDate()}-${
  orderDate.getMonth() + 1
}-${orderDate.getFullYear()} ${orderDate.getHours()}:${orderDate.getMinutes()}
Please contact us at ${process.env.CONTACT_NUMBER} for more details.
Thank you for choosing us.`,
  };

  transporter.sendMail(mailData, function (err, info) {
    if (err) console.log(err);
    else console.log(info);
    return res.redirect("/admin/orders");
  });
};
