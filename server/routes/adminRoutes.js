const express = require("express");
const {
  getAllUsersController,
  getAllDoctorsController,
  changeAccountStatusController,

} = require("../controllers/adminController");

const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/getAllUsers", authMiddleware, getAllUsersController);

router.get("/getAllDoctors", authMiddleware, getAllDoctorsController);

router.post(
  "/changeAccountStatus",
  authMiddleware,
  changeAccountStatusController
);

module.exports = router;