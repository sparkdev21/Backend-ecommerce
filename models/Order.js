const mongoose = require("mongoose");

const OrderSchema = mongoose.Schema({
  shippingInfo: {
    state: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    tole: {
      type: String,
      required: true,
    },
    nearestLandmark: {
      type: String,
      required: true,
    },
    phoneNo: {
      type: Number,
      required: true,
    },
  },
  orderItems: [
    {
      productId: {
        type: mongoose.Schema.ObjectId,
        ref: "Item",
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        min: [1, "Quantity cannot be less than 1."],
      },
      image: {
        type: String,
        required: true,
      },
    },
  ],
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  bill: {
    itemsPrice: {
      type: Number,
      required: true,
    },
    tax: {
      type: Number,
      required: true,
    },
    deliveryCharge: {
      type: Number,
      required: true,
    },
    allTotal: {
      type: Number,
      required: true,
    },
  },
  paymentInfo: {
    id: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
  },
  dateAdded: {
    type: Date,
    default: Date.now,
  },
  deliveredAt: {
    type: Number,
  },
  orderStatus: {
    type: String,
    required: true,
    default: "Processing",
  },
});

module.exports = mongoose.model("Order", OrderSchema);
