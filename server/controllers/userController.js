const userModel = require("../models/userModels");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const doctorModel = require("../models/doctorModel");
const appointmentModel = require("../models/appointmentModel");
const moment = require("moment");
let nodemailer = require("nodemailer");

const registerController = async (req, res) => {
  try {
    const exisitingUser = await userModel.findOne({ email: req.body.email });
    if (exisitingUser) {
      return res
        .status(200)
        .send({ message: "User Already Exists!", success: false });
    }
    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    req.body.password = hashedPassword;
    const newUser = new userModel(req.body);
    await newUser.save();
    return res
      .status(201)
      .send({ message: "Registered Sucessfully!", success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: `Register Controller ${error.message}`,
    });
  }
};

const loginController = async (req, res) => {
  try {
    const user = await userModel.findOne({ email: req.body.email });
    // console.log(user);
    if (!user) {
      return res
        .status(200)
        .send({ message: "User not found!", success: false });
    }
    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      return res
        .status(200)
        .send({ message: "Invalid Email or Password!", success: false });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    return res
      .status(200)
      .send({ message: "Login Success!", success: true, token });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: `Error in Login CTRL ${error.message}` });
  }
};

const authController = async (req, res) => {
  try {
    const user = await userModel.findById({ _id: req.body.userId });
    user.password = undefined;
    if (!user) {
      return res.status(200).send({
        message: "User not found!",
        success: false,
      });
    } else {
      res.status(200).send({
        success: true,
        data: user,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: "auth error",
      success: false,
      error,
    });
  }
};

const applyDoctorController = async (req, res) => {
  try {
    const newDoctor = await doctorModel({ ...req.body, status: "pending" });
    await newDoctor.save();

    const adminUser = await userModel.findOne({ isAdmin: true });
    const notifcation = adminUser.notifcation;
    notifcation.push({
      type: "apply-doctor-request",
      message: `${newDoctor.firstName} ${newDoctor.lastName} Has Applied For A Doctor Account`,
      data: {
        doctorId: newDoctor._id,
        name: newDoctor.firstName + " " + newDoctor.lastName,
        onClickPath: "/admin/doctors",
      },
    });

    await userModel.findByIdAndUpdate(adminUser._id, { notifcation });
    return res.status(201).send({
      success: true,
      message: "Doctor Account Applied Successfully!",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      error,
      message: "Error WHile Applying For Doctotr",
    });
  }
};

const getAllNotificationController = async (req, res) => {
  try {
    const user = await userModel.findOne({ _id: req.body.userId });

    const notifications = user.notifcation;
    const seennotifs = user.seennotification;
    return res.status(200).send({
      success: true,
      message: "All notifications retrieved!",
      data: { notifications, seennotifs },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: "Error in retrieving notification!",
      success: false,
      error,
    });
  }
};

const markAllNotificationController = async (req, res) => {
  try {
    const user = await userModel.findOne({ _id: req.body.userId });

    const seennotification = user.seennotification;
    const notifcation = user.notifcation;

    seennotification.push(...notifcation);
    user.notifcation = [];
    user.seennotification = seennotification;
    console.log(user.seennotification);

    const updatedUser = await user.save();
    return res.status(200).send({
      success: true,
      message: "All notifications marked as read!",
      data: updatedUser,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: "Error in notification",
      success: false,
      error,
    });
  }
};

const deleteAllNotificationController = async (req, res) => {
  try {
    const user = await userModel.findOne({ _id: req.body.userId });
    user.notifcation = [];
    user.seennotification = [];
    const updatedUser = await user.save();
    updatedUser.password = undefined;
    return res.status(200).send({
      success: true,
      message: "Notifications Deleted successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "unable to delete all notifications",
      error,
    });
  }
};

const getAllDocotrsController = async (req, res) => {
  try {
    const doctors = await doctorModel.find({ status: "approved" });
    return res.status(200).send({
      success: true,
      message: "Doctors Lists Fetched Successfully",
      data: doctors,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      error,
      message: "Error While Fetching Doctors",
    });
  }
};

const bookeAppointmnetController = async (req, res) => {
  try {
    req.body.status = "pending";
    const doctor= await doctorModel.findById(req.body.doctorId);

    const user = await userModel.findById(doctor.userId);
    if (user) {
      user.notifcation.push({
        type: "New-appointment-request",
        message: `A new appointment request from ${req.body.userInfo}`,
        onCLickPath: "/user/appointments",
      });
      await user.save();
    }

    const newAppointment = new appointmentModel(req.body);
    await newAppointment.save();

    res.status(200).send({
      success: true,
      message: "Appointment Booked succesfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error While Booking Appointment",
    });
  }
};

const bookingAvailabilityController = async (req, res) => {
  try {

    const date = req.body.date;

    const [inputHours, inputMinutes] = req.body.time.split(":");

    const originalTime = new Date();
    originalTime.setHours(Number(inputHours));
    originalTime.setMinutes(Number(inputMinutes));

    const oneHourLater = new Date(originalTime);
    oneHourLater.setHours(originalTime.getHours() + 1);

    const oneHourEarlier = new Date(originalTime);
    oneHourEarlier.setHours(originalTime.getHours() - 1);

    const formatTime = (date) => {
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      return `${hours}:${minutes}`;
    };

    const toTime = formatTime(oneHourLater);
    const fromTime = formatTime(oneHourEarlier);

    const doctorId = req.body.doctorId;

    const appointments = await appointmentModel.find({
      doctorId,
      date,
      time: {
        $gte: fromTime,
        $lte: toTime,
      },
    });
    if (appointments.length > 0) {
      return res.status(200).send({
        message: "Appointments not Availibale at this time",
        success: false,
      });
    } else {
      return res.status(200).send({
        success: true,
        message: "Appointments available",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error In Booking",
    });
  }
};

const userAppointmentsController = async (req, res) => {
  try {
    const appointments = await appointmentModel.find({
      userId: req.body.userId,
    });
    res.status(200).send({
      success: true,
      message: "Users Appointments Fetch SUccessfully",
      data: appointments,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error In User Appointments",
    });
  }
};

const forgetController = async (req, res) => {
  try {
    const user = await userModel.findOne({ email: req.body.email });
    if (user) {
      const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "3h",
      });
      user.resetToken = token;

      await user.save();

      let mailOptions = {
        from: process.env.EMAIL_USERNAME,
        to: user.email,
        subject: "Reset password!",
        html: `<p>Please Click the following link to reset your password:</p> 
        <a href="${process.env.CLIENT_URL}/reset-password/${token}"}>Reset Password</a>
        `,
      };

      let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD,
        },
      });

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log("Email sent: " + info.response);
        }
      });
      res.status(200).send({
        success: true,
        message: "mail sent",
      });
    } else {
      res.status(500).send({
        success: false,
        message: "user not found",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error In forget password",
    });
  }
};

const resetpassController = async (req, res) => {
  try {
    jwt.verify(req.body.token, process.env.JWT_SECRET, async (err, decode) => {
      if (err) {
        res.status(401).send({ success: false, message: "Invalid Token" });
      } else {
        const user = await userModel.findOne({ resetToken: req.body.token });
        if (user) {
          if (req.body.values.password) {
            const password = req.body.values.password;
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            user.password = hashedPassword;
            await user.save();
            res.status(200).send({
              success: true,
              message: "Password reseted successfully",
            });
          }
        } else {
          res.status(404).send({ success: false, message: "User not found" });
        }
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error In forget password",
    });
  }
};
module.exports = {
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
};
