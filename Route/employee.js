const { Router } = require("express");
const multer = require("multer");
const EMPLOYEE_SCHEMA = require("../Model/Employee");
const { ensureAuthenticated } = require("../helper/auth_helper");
const router = Router();

//?load multer middleware
let { storage } = require("../middlewares/multer");
const upload = multer({ storage: storage });

/*@HTTP GET METHOD
  @ACCESS PUBLIC
  @URL employee/home
*/
router.get("/home", async (req, res) => {
  let payload = await EMPLOYEE_SCHEMA.find({}).lean();
  res.render("../views/home", { title: "Home page", payload });
});

/*@HTTP GET METHOD
  @ACCESS PRIVATE
  @URL employee/home
*/
router.get("/emp-profile", async (req, res) => {
  let payload = await EMPLOYEE_SCHEMA.find({}).lean();
  res.render("../views/employees/employeeProfile", {
    title: "Profile page",
    payload,
  });
});

/*@HTTP GET METHOD
  @ACCESS PUBLIC
  @URL employee/create-emp
*/
router.get("/create-emp", ensureAuthenticated, (req, res) => {
  res.render("../views/employees/create-emp", { title: "create employee" });
});

/*!-----FETCH DATA FROM MONGODB DATABASE ----------------------!*/
/*@HTTP GET METHOD
  @ACCESS PUBLIC
  @URL employee/emp-profile

*/

router.get("/:id", async (req, res) => {
  let payload = await EMPLOYEE_SCHEMA.findOne({
    _id: req.params.id,
    user: req.user.id,
  }).lean();
  res.render("../views/employees/employeeProfile", { payload });
});

/*@HTTP GET METHOD
  @ACCESS PRIVATE
  @URL employee/edit-emp

*/
router.get("/edit-emp/:id", ensureAuthenticated, async (req, res) => {
  let editPayload = await EMPLOYEE_SCHEMA.findOne({
    _id: req.params.id,
  }).lean();
  res.render("../views/employees/editEmp", { editPayload });
});

/*================END ALL GET METHODS====================*/

/*?================START ALL POST METHODS====================*/
/*@HTTP POST METHOD
  @ACCESS PRIVATE
  @URL employee/create-emp*/
router.post("/create-emp", upload.single("emp_photo"), async (req, res) => {
  let {
    emp_id,
    emp_name,
    emp_salary,
    emp_edu,
    emp_exp,
    emp_location,
    emp_des,
    emp_email,
    emp_phone,
    emp_skills,
    emp_gender,
  } = req.body;

  let payload = {
    emp_photo: req.file,
    emp_id,
    emp_name,
    emp_salary,
    emp_edu,
    emp_exp,
    emp_location,
    emp_des,
    emp_email,
    emp_phone,
    emp_skills,
    emp_gender,
    user: req.user.id,
  };
  // save all data to database
  let body = await EMPLOYEE_SCHEMA.create(payload);
  req.flash("SUCCESS_MESSAGE", "successfully employee created");
  res.redirect("/employee/home", 302, { body });
});

/*================END ALL POST METHODS====================*/

/*---------------PUT REQUEST START HERE ------------*/
router.put("/edit-emp/:id", upload.single("emp_photo"), (req, res) => {
  EMPLOYEE_SCHEMA.findOne({ _id: req.params.id })
    .then(editEmp => {
      //old                    new
      (editEmp.emp_photo = req.file),
        (editEmp.emp_id = req.body.emp_id),
        (editEmp.emp_name = req.body.emp_name),
        (editEmp.emp_salary = req.body.emp_salary),
        (editEmp.emp_edu = req.body.emp_edu),
        (editEmp.emp_exp = req.body.emp_exp),
        (editEmp.emp_email = req.body.emp_email),
        (editEmp.emp_phone = req.body.emp_phone),
        (editEmp.emp_gender = req.body.emp_gender),
        (editEmp.emp_des = req.body.emp_des),
        (editEmp.emp_skills = req.body.emp_skills),
        (editEmp.emp_location = req.body.emp_location);
      //update data in database
      editEmp.save().then(_ => {
        req.flash("SUCCESS_MESSAGE", "successfully employee updated");
        res.redirect("/employee/home", 302, {});
      });
    })
    .catch(err => {
      console.log(err);
      req.flash("ERROR_MESSAGE", "something went wrong");
    });
});
/*---------------PUT REQUEST END HERE ------------*/

/*---------------DELETE REQUEST START HERE ------------*/
router.delete("/delete-emp/:id", async (req, res) => {
  await EMPLOYEE_SCHEMA.deleteOne({ _id: req.params.id });
  req.flash("SUCCESS_MESSAGE", "successfully employee deleted");
  res.redirect("/employee/home", 302, {});
});
/*---------------DELETE REQUEST END HERE ------------*/

module.exports = router;
