const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const config = require("../config/config");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const randomstring = require("randomstring");
const sendLoginDetail = require("../middleware/sendLoginDetail");

// Reset Password send to mail method
const sendResetPasswordMail = async (userName, userEmail, userToken) => {
  try {
    const transporter = nodemailer.createTransport(config.smtpConfig);
    const mailOption = {
      from: config.smtpConfig.auth.user,
      to: userEmail,
      subject: "For reset password",
      html:
      `
      <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Password Reset</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                margin: 0;
                padding: 0;
              }
              .container {
                max-width: 600px;
                margin: 50px auto;
                background-color: #ffffff;
                padding: 20px;
                border: 1px solid #ddd;
                border-radius: 5px;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
              }
              .header {
                text-align: center;
                padding-bottom: 20px;
                border-bottom: 1px solid #ddd;
              }
              .header h1 {
                margin: 0;
                font-size: 24px;
              }
              .content {
                padding: 20px 0;
              }
              .content p {
                line-height: 1.6;
              }
              .button {
                display: block;
                width: 200px;
                margin: 20px auto;
                padding: 10px;
                text-align: center;
                background-color: #007BFF;
                color: #ffffff;
                text-decoration: none;
                border-radius: 5px;
              }
              .footer {
                text-align: center;
                padding-top: 20px;
                border-top: 1px solid #ddd;
                color: #777;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Password Reset Request</h1>
              </div>
              <div class="content">
                <p>Hi ${userName},</p>
                <p>We received a request to reset your password. Click the button below to reset it.</p>
                <a href="http://localhost:4200/change-password?token='${userToken}'" class="button">Reset Password</a>
                <p>If you did not request a password reset, please ignore this email or contact support if you have questions.</p>
                <p>Thank you, <br> Administrator</p>
              </div>
              <div class="footer">
                <p>&copy; 2024 Developed By Narayan. All rights reserved.</p>
              </div>
            </div>
          </body>
          </html>
      `
      //   "<p>Hi " +
      //   userName +
      //   ', Please click here <a herf="http://localhost:4200/change-password?token=' +
      //   userToken +
      //   '">reset your password</a> http://localhost:4200/change-password?token='+userToken
    };

    transporter.sendMail(mailOption,(error, info)=>{
      if(error){
        console.log(error);
      }else{
        console.log("Email sent: " + info.response);
      }
    })
    
  } catch (error) {
    res.status(400).send({ success: false, msg: error.message });
  }
};

//create token method
const createToken = async (id) => {
  try {
    const token = await jwt.sign({ _id: id }, config.jwtSecertKey, {
      expiresIn: 3 * 24 * 60 * 60 * 1000,
    });
    return token;
  } catch (error) {
    console.log(error);
    res.status(400).send({ msg: error.message });
  }
};

//secure method
const secure_password = async (password) => {
  try {
    const passwordHash = await bcrypt.hash(password, 10);
    return passwordHash;
  } catch (error) {
    console.log(error);
    // res.status(500).json({ status: 500, msg: "Internal Server Error", e });
  }
};

// Register method
const registerUser = async (req, res) => {
  try {
    const securePassword = await secure_password(req.body.password);
    // console.log(req.body);
    // console.log(securePassword);

    const loginGen =
      req.body.userRole === "S"
        ? "S-" + req.body.admissionNo
        : "T-" + req.body.employeeID;
    console.log(loginGen);
    const user = new User({
      userRole: req.body.userRole,
      employeeID: req.body.employeeID,
      admissionNo: req.body.admissionNo,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      password: securePassword,
      gender: req.body.gender,
      standard: req.body.standard,
      section: req.body.section,
      admittedClass: req.body.admittedClass,
      dob: req.body.dob,
      fatherName: req.body.fatherName,
      motherName: req.body.motherName,
      contact: req.body.contact,
      email: req.body.email,
      address: req.body.address,
      mailingAddress: req.body.mailingAddress,
      // image: req.file.filename,
      loginID: loginGen,
    });

    const userData = await User.findOne({ loginID: loginGen });
    // const userData = await User.findOne({ email: req.body.email });
    
    if (userData) {
      res.status(200).json({ status: 200, msg: "This User is already exits" });
    } else {
      const user_data = await user.save();
      console.log("decode ",bcrypt.decodeBase64(user_data.password))
      user_data['password'] = req.body.password;
      sendLoginDetail(user_data)
      res
        .status(201)
        .json({ status: 201, msg: "User created successfully", user_data });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: 500, msg: "Internal Server Error", error });
  }
};

// Login method
const userLogin = async (req, res) => {
  try {
    const loginID = req.body.loginID;
    const password = req.body.password;

    const userData = await User.findOne({ loginID: loginID });
    console.log(userData.userStatus)
    if(userData.userStatus === "A"){
      if (userData) {
        const passwordMatch = await bcrypt.compare(password, userData.password);
        if (passwordMatch) {
          const tokenData = await createToken(userData._id);
          const userDetail = {
            firstName: userData.firstName,
            lastName: userData.lastName,
            email: userData.email,
            profilePic: userData.image,
            loginID: userData.loginID,
            userRole: userData.userRole,
            token: tokenData,
          };
          const response = {
            status:200,
            success: true,
            msg: "User Details",
            data: userDetail,
          };
          res.status(200).send(response);
        } else {
          res
            .status(200)
            .send({ success: false, msg: "Login credentials are incorrect.!" });
        }
      } else {
        res
          .status(200)
          .send({ success: false, msg: "Login credentials are incorrect.!" });
      }
    }else{
      res
        .status(200)
        .send({ success: false, msg: "User is not active" });
    }
    
  } catch (error) {
    res.status(400).send({ msg: error.message });
  }
};

const updatePassword = async (req, res) => {
  try {
    const { loginID, password } = req.body;
    console.log(req.body);
    const data = await User.findOne({ loginID: loginID });
    console.log(data);
    if (data) {
      const newPassword = await secure_password(password);
      const updateData = await User.findByIdAndUpdate(
        { _id: data._id },
        { set: { password: newPassword } }
      );
      res
        .status(200)
        .send({
          status:200,
          success: true,
          msg: "Your password has been update successfully.",
        });
    } else {
      res.status(200).send({ success: false, msg: "Login ID are incorrect." });
    }
  } catch (error) {
    console.log(error);
    res.status(400).send({ msg: error.message });
  }
};

//Forgot Password Method
const forgotPassword = async (req, res) => {
  try {
    const { loginID,email } = req.body;
    const userData = await User.findOne({ loginID: email });
    // console.log(userData)
    if (userData) {
      const randomString = randomstring.generate();
      const data = await User.updateOne(
        { email: userData.email },
        { $set: { token: randomString } },{new:true}
      );
      sendResetPasswordMail(userData.firstName,userData.email,randomString);
      res
        .status(200)
        .send({
          status:200,
          success: true,
          msg: "Please check your mail and reset your password.",
        });
    } else {
      res
        .status(200)
        .send({ success: true, msg: "This email does not exists." });
    }
  } catch (error) {
    console.log(error);
    res.status(400).send({ msg: error.message });
  }
};

// reset password method
const resetPassword = async(req,res)=>{
    try {
      const token = req.query.token;
      console.log(`Get Token ${token}`);
      const tokenData = await User.findOne({token:token});
      console.log(`Get Token ${tokenData}`);
      if(tokenData){
        const resetToken = '';
        // console.log(`Reset tokent ${resetToken}`)
        const newPassword = await secure_password(req.body.password);
        const updateData = await User.findByIdAndUpdate(
          { _id: tokenData._id },
          { $set: { password: newPassword, token:resetToken } },{new:true}
        );
        // console.log(`Update Data ${updateData}`);
        res
          .status(200)
          .send({
            status:200,
            success: true,
            msg: "Your password has been reset.",
            data:updateData
          });
      }else{
      res.status(200).send({status:200, success:true, msg:"This link has been expired."})
      }
    } catch (error) {
      res.status(400).send({success:false, msg:error.message})
    }
}

// user profile method
const getUserProfile = async(req, res)=>{
  try {
    const userProfile = await User.findOne({loginID:req.query.loginID});
    res.status(200).send({status:200, success:true, msg:"User profile", data:userProfile})
  } catch (error) {
    console.log(error.message)
  }
} 

// user profile update method
const updateUserProfile = async(req, res)=>{
  try {
    const getId = await User.findOne({loginID:req.body.loginID});
    let setReq = req.body;
    const updateData = await User.findByIdAndUpdate(
      { _id: getId._id },
      { $set: setReq },{new:true}
    );
    res.status(200).send({status:200, success:true, msg:"User profile updated", data:updateData})
  } catch (error) {
    console.log(error.message)
  }
} 
module.exports = { registerUser, userLogin, updatePassword, forgotPassword, resetPassword, getUserProfile, updateUserProfile };
