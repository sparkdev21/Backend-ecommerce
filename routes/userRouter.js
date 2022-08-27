const { Router } = require("express");
const { verifyUser } = require("../controllers/userController");
const { ImageUpload } = require("../controllers/imageController");
const userController = require("../controllers/userController");
const router = Router();
const {auth} = require("../middleware/auth");
const {authorizeRoles}=require("../middleware/auth")

router.post("/register", ImageUpload.single("image"), userController.signup);
router.post("/login", userController.login);
router.post(
  "/updateuser/:id",
  ImageUpload.single("image"),
  userController.updateUser
);
router.post("/changepassword/:id", userController.changePassword);
router.post("/forgotpassword", userController.forgotPassword);
router.get("/auth", auth, userController.getUser);
router.get("/admin/getallusers", auth, authorizeRoles("admin"),userController.getAllUsers);
router.get("/admin/getuser/:id", auth, authorizeRoles("admin"), userController.getSingleUser);
router.put("/admin/updatesingleuser/:id",auth,authorizeRoles("admin"), userController.updateUserAdmin);
router.delete("/admin/deleteuser/:id",auth,authorizeRoles("admin"), userController.deleteuser);
router.get(
  "/handleforgotpassword/:id/:token",
  userController.handleForgotPassword
);

module.exports = router;
