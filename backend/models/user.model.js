import mongoose from "mongoose"
import {genSalt,hash} from "bcrypt"

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  image: {
    type: String,
  },
  color: {
    type: Number,
    default: 0,
  },
  profileSetup: {
    type: Boolean,
    default: false,
  },
});

userSchema.pre("save",async function(next){
    const salt = await genSalt(7);
    this.password = await hash(this.password, salt);
    next();
})

const User = mongoose.model("User",userSchema)
export default User;