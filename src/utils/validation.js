const validator = require("validator");

const validateSignUpData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;
  if (!firstName || !lastName) {
    throw new Error("enter valid firstName or lastName");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("Enter valid email id");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("please enter strong password");
  }
};
module.exports = { validateSignUpData };
