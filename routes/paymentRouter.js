const paymentController = require("../controllers/paymentController");
const auth = require("../middleware/auth");
const { Router } = require("express");
const router = Router();

router.post("/payment/processstripe", paymentController.processPayment);
router.get("/payment/getstripeapi",paymentController.sendStripeAPI);
module.exports = router;
