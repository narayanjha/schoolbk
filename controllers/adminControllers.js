const userModel = require("../models/userModel")

// Get All student list
const getAllStudentList = async(req,res)=>{
    console.log("Get all student");
    let studentData = await userModel.find();
    studentData = studentData.filter(inputArray => inputArray.userRole == 'S')
    res.status(200).send({status:200, success:true, msg:"All student list", data:studentData, total:studentData.length})
}

// Get All teacher list    Admin@12345
const getAllTeacherList = async(req,res)=>{
    console.log("Get all teacher");
    let teacherData = await userModel.find();
    teacherData = teacherData.filter(inputArray => inputArray.userRole == 'T')
    res.status(200).send({status:200, success:true, msg:"All teacher list", data:teacherData, total:teacherData.length})
}

// Any user change status
const chageUserStatus = async(req,res)=>{
    try {
        const { loginID } = req.body;
        console.log(req.body);
        const data = await userModel.findOne({ loginID: loginID });
        // console.log(data);
        if (data) {
          const changeStatus = "I";
          const updateData = await userModel.findByIdAndUpdate(
            { _id: data._id },
            { $set: { userStatus: changeStatus } },{new:true}
          );
          console.log("After update user status",updateData);
          res
            .status(200)
            .send({
              status:200,
              success: true,
              msg: "User has been deleted.",
              data: updateData,
            });
        } else {
          res.status(200).send({ success: false, msg: "Login ID are incorrect." });
        }
      } catch (error) {
        console.log(error);
        res.status(400).send({ msg: error.message });
      }
}

module.exports = {getAllStudentList, getAllTeacherList,chageUserStatus}