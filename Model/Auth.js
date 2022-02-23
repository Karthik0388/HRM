const { model, Schema } = require("mongoose");
const UserSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    // role: ["user", "employee"],
    // default: "user",
  },
  { timestamps: true }
);

module.exports = model("user", UserSchema);
