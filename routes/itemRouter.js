const { Router } = require("express");
const itemController = require("../controllers/itemController");
const { ImageUpload } = require("../controllers/imageController");
const { authorizeRoles } = require("../middleware/auth");
const { auth } = require("../middleware/auth");
const router = Router();

router.post(
  "/admin/additem",
  auth, authorizeRoles("admin"),
  ImageUpload.single("image"),
  itemController.addItem
);
router.post(
  "/admin/updateitem/:id",
  ImageUpload.single("image"),
  auth,
  authorizeRoles("admin"),
  itemController.updateItem
);
router.get("/getallitem", itemController.getAllItem);
router.get("/getsingleitem/:id", itemController.getSingleItem);
router.get(
  "/admin/getitem",
  auth,
  authorizeRoles("admin"),
  itemController.getAdminItem
);
router.delete(
  "/admin/deleteitem/:id",
  auth,
  authorizeRoles("admin"),
  itemController.deleteItem
);

module.exports = router;
