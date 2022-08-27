const Order = require("../models/Order");
const Item = require("../models/Item");

//create new order
const createOrder = async (req, res) => {
  const { shippingInfo, orderItems, paymentInfo, bill, user } = req.body.order;

  const order = await Order.create({
    shippingInfo,
    orderItems,
    bill,
    paymentInfo,
    paidAt: Date.now(),
    user,
  });
  res.status(201).json({
    success: true,
    order,
  });
};

//getOrder
const getSingleOrder = async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );
  if (!order) {
    return res.status(500).json({ err: "Not Found" });
  }
  res.status(200).json({
    success: true,
    order,
  });
};

//get logged in Myorders user
const myOrders = async (req, res) => {
  const order = await Order.find({ user: req.user.user.id });
  if (!order) {
    return res.status(500).json({ err: "Not Found" });
  }
  res.status(200).json({
    success: true,
    order,
  });
};

// get all Orders -- Admin
const getAllOrders = async (req, res) => {
  const orders = await Order.find();

  let totalAmount = 0;

  orders.forEach((order) => {
    totalAmount += order.bill.allTotal;
  });

  res.status(200).json({
    success: true,
    totalAmount,
    orders,
  });
};

//update Order Status--Admin
const updateOrder = async (req, res) => {
  const order = await Order.findById(req.params.id);
  const status = req.body.value;

  if (order.orderStatus === "Delivered") {
    return res.json({ message: "Product has been already delivered" });
  }

  if (status === "Shipped") {
    order &&
      order.orderItems.forEach(async (order) => {
        await updateStock(order.productId, order.quantity);
      });
  }

  if (status === "Delivered") {
    order.deliveredAt = Date.now();
  }
  const data = await Order.findByIdAndUpdate(req.params.id, {
    orderStatus: status,
  });
  res.status(200).json({
    success: true,
    data,
  });

  async function updateStock(id, quantity) {
    const product = await Item.findById(id);
    product.stock -= quantity;

    await Item.findByIdAndUpdate(id, { stock: product.stock });
  }
};

// delete Order -- Admin
const deleteOrder = async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return res.status(500).json("Order not found with this Id");
  }

  await order.remove();

  res.status(200).json({
    success: true,
  });
};

module.exports = {
  getSingleOrder,
  myOrders,
  getAllOrders,
  createOrder,
  updateOrder,
  deleteOrder,
};
