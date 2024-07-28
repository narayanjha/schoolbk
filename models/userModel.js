const { default: mongoose } = require("mongoose");

const user = mongoose.Schema({
  userStatus: String,
  userRole: String,
  employeeID: String,
  admissionNo: String,
  firstName: String,
  lastName: String,
  gender: String,
  standard: String,
  section: String,
  admittedClass: String,
  dob: String,
  fatherName: String,
  motherName: String,
  contact: Number,
  email: String,
  address: String,
  mailingAddress: String,
  image: String,
  password: String,
  confirmPassword: String,
  loginID:String,
  token:String,
  createdAt: {
    type: Date,
    default: new Date(),
  },
  updatedAt: {
    type: Date,
    default: new Date(),
  },
});

module.exports = mongoose.model("User", user);
