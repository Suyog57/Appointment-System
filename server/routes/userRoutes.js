const express = require("express");
const {
  loginController,
  registerController,
  authController,
  applyDoctorController,
  getAllNotificationController,
  markAllNotificationController,
  deleteAllNotificationController,
  getAllDocotrsController,
  bookeAppointmnetController,
  bookingAvailabilityController,
  userAppointmentsController,
  forgetController,
  resetpassController,
} = require("../controllers/userController");

const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/login", loginController);

router.post("/register", registerController);

router.post("/forget-password", forgetController);

router.post("/reset-password", resetpassController);

router.post("/getUserData", authMiddleware, authController);

router.post("/apply-doctor", authMiddleware, applyDoctorController);

router.post(
  "/get-all-notification",
  authMiddleware,
  getAllNotificationController
);

router.post(
  "/mark-all-notification",
  authMiddleware,
  markAllNotificationController
);

router.post(
  "/delete-all-notification",
  authMiddleware,
  deleteAllNotificationController
);

router.get("/getAllDoctors", authMiddleware, getAllDocotrsController);

router.post("/book-appointment", authMiddleware, bookeAppointmnetController);

router.post(
  "/booking-availbility",
  authMiddleware,
  bookingAvailabilityController
);

router.get("/user-appointments", authMiddleware, userAppointmentsController);

module.exports = router;
