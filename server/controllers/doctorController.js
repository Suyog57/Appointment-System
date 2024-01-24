const doctorModel = require("../models/doctorModel");
const appointmentModel = require("../models/appointmentModel");
const userModel = require("../models/userModels");

const getDoctorInfoController = async (req, res) => {
  try {
    const doctor = await doctorModel.findOne({ userId: req.body.userId });

    return res.status(200).send({
      success: true,
      message: "Doctor data fetched successfully!",
      data: doctor,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).send({
      success: false,
      error,
      message: "Error in Fetching Doctor Details!",
    });
  }
};

const updateProfileController = async (req, res) => {
  try {
    if (req.role === "doctor") {
      return res
        .status(401)
        .send({ success: false, message: "Unauthorized access" });
    }

    const doctor = await doctorModel.findOneAndUpdate(
      { userId: req.body.userId },
      req.body,
      { new: true }
    );

    return res.status(201).send({
      success: true,
      message: "Doctor Profile Updated!",
      data: doctor,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).send({
      success: false,
      message: "Doctor Profile Update issue",
      error,
    });
  }
};

const getDoctorByIdController = async (req, res) => {
  try {
    const doctor = await doctorModel.findOne({ _id: req.body.doctorId });

    res.status(200).send({
      success: true,
      message: "Single Doctor Info Fetched!",
      data: doctor,
    });
  } catch (error) {
    console.log(error);

    res.status(500).send({
      success: false,
      error,
      message: "Error in Single doctor info",
    });
  }
};

const doctorAppointmentsController = async (req, res) => {
  try {
    if (req.role === "doctor") {
      return res
        .status(401)
        .send({ success: false, message: "Unauthorized access" });
    }

    const doctor = await doctorModel.findOne({ userId: req.body.userId });

    const appointments = await appointmentModel.find({
      doctorId: doctor._id.toString(),
    });

    res.status(200).send({
      success: true,
      message: "Doctor Appointments fetched Successfully!",
      data: appointments,
    });
  } catch (error) {
    console.log(error);

    res.status(500).send({
      success: false,
      error,
      message: "Error in Doctor Appointments",
    });
  }
};

const updateStatusController = async (req, res) => {
  try {
    if (req.role === "doctor") {
      return res
        .status(401)
        .send({ success: false, message: "Unauthorized access" });
    }
    
    const { appointmentsId, status } = req.body;

    const appointments = await appointmentModel.findByIdAndUpdate(
      appointmentsId,
      { status }
    );
    
    const user = await userModel.findOne({ _id: appointments.userId });

    const notifcation = user.notifcation;
    notifcation.push({
      type: "status-updated",
      message: `Your appointment has been ${status}!`,
      onCLickPath: "/doctor-appointments",
    });

    await user.save();

    res.status(200).send({
      success: true,
      message: "Appointment Status Updated!",
    });
    
  } catch (error) {
    console.log(error);
    
    res.status(500).send({
      success: false,
      error,
      message: "Error In Update Status",
    });
  }
};
module.exports = {
  getDoctorInfoController,
  updateProfileController,
  getDoctorByIdController,
  doctorAppointmentsController,
  updateStatusController,
};
