const express = require("express");
const user_route = express();

const bodyPraser = require("body-parser");
user_route.use(bodyPraser.json());
user_route.use(bodyPraser.urlencoded({ extended: true }));

const multer = require("multer");
const path = require("path");

user_route.use(express.static("public"));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(
      null,
      path.join(__dirname, "../public/userImage"),
      function (error, success) {
        if (error) {
          throw error;
        }
      }
    );
  },
  filename: function (req, file, cb) {
    const name = Date.now() + "-" + file.originalname;
    cb(null, name, function (error1, success1) {
      if (error1) throw error1;
    });
  },
});

const upload = multer({ storage: storage });

const user_controller = require("../controllers/userControllers");
const auth = require("../middleware/auth");
const admin_controller = require("../controllers/adminControllers");
const contact_controller = require("../controllers/contactController");

user_route.get("/test", (req, res) => {
  res.status(200).send({ success: true, msg: "Authenticated" });
});
console.log("routes")
user_route.post("/register", upload.single("image"),user_controller.registerUser);
user_route.post("/login", user_controller.userLogin);
user_route.post("/change-password", auth, user_controller.updatePassword);
user_route.post("/forgot-password", user_controller.forgotPassword);
user_route.post("/reset-password", user_controller.resetPassword);
user_route.post("/profile-update", auth, user_controller.updateUserProfile);
user_route.get("/profile", user_controller.getUserProfile);
user_route.post("/contact", contact_controller.contactUs);

// All student List route
user_route.get("/admin/student-list", admin_controller.getAllStudentList);
// All teacher List route
user_route.get("/admin/teacher-list", admin_controller.getAllTeacherList);
// All admin List route
user_route.post("/admin/user-delete", admin_controller.chageUserStatus);

module.exports = user_route;
