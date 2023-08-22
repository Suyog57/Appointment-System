const doctorModel = require("../models/doctorModel");
const userModel = require("../models/userModels");

const getAllUsersController = async (req, res) => {
  try {
    const users = await userModel.find({});
    return res.status(200).send({
      success: true,
      message: "Users data list!",
      data: users,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error while fetching users",
      error,
    });
  }
};

const getAllDoctorsController = async (req, res) => {
  try {
    const doctors = await doctorModel.find({});
    return res.status(200).send({
      success: true,
      message: "Doctors Data list!",
      data: doctors,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error while getting doctors data",
      error,
    });
  }
};

const changeAccountStatusController = async (req, res) => {
  try {
    const { doctorId, status } = req.body;
    if (status === "approved") {
      const doctor = await doctorModel.findByIdAndUpdate(doctorId, { status });
      const user = await userModel.findOne({ _id: doctor.userId });
      const notifcation = user.notifcation;
      notifcation.push({
        type: "doctor-account-request-updated",
        message: `Your doctor account request has been ${status} `,
        onClickPath: "/notification",
      });
      user.isDoctor = status === "approved" ? true : false;
      await user.save();

      return res.status(201).send({
        success: true,
        message: "Account Status Updated!",
        data: doctor,
      });
    } else {
      let doctor=await doctorModel.findById(doctorId);
      const user = await userModel.findOne({ _id: doctor.userId });
      const notifcation = user.notifcation;
      notifcation.push({
        type: "doctor-account-request-updated",
        message: `Your doctor account request has been ${status} `,
        onClickPath: "/notification",
      });
      await user.save();

      await doctorModel.findByIdAndDelete(doctorId);
      return res.status(201).send({
        success: true,
        message: "Account Status Updated!",
        // data: doctor,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in Account Status",
      error,
    });
  }
};

module.exports = {
  getAllDoctorsController,
  getAllUsersController,
  changeAccountStatusController,
};
