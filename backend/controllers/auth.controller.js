import User from "../models/user.model.js";
import { generateToken } from "../utils/generateToken.js";
import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs"
import { v4 as uuid } from "uuid";

export const signup = async (req, res) => {
  try {
    const { email, password, confirmPassword } = req.body;
    console.log(email, password, confirmPassword);
    if (!email || !password || !confirmPassword) {
      return res
        .status(400)
        .json({ error: "All Fields must be filled!", success: false });
    }

    // check whether the email exists in databse or not
    const emailRegex = /\b[\w\.-]+@[\w\.-]+\.\w{2,4}\b/;
    if (!emailRegex.test(email)) {
      return res
        .status(400)
        .json({ error: "Invalid Email Format", success: false });
    }

    const isExistingEmail = await User.findOne({ email });
    if (isExistingEmail) {
      return res
        .status(400)
        .json({ error: "Email Already Existed", success: false });
    }

    if (password.length < 8) {
      return res.status(400).json({
        error: "password can't be less than 8 characters",
        success: false,
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        error: "Password doesn't match with Confirm Password",
        success: false,
      });
    }

    const newUser = new User({
      email,
      password,
    });
    if (newUser) {
      generateToken(newUser._id, email, res);
      newUser.save();

      return res.status(201).json({
        user: {
          _id: newUser._id,
          email: newUser.email,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          image: newUser.image,
          color: newUser.color,
          profileSetup: newUser.profileSetup,
        },
        success: true,
        message: "Account created successfully.",
      });
    } else {
      res.status(400).json({ error: "Invalid User data", success: false });
    }
  } catch (error) {
    console.log(`Error at Singup Controller ${error}`);
    res.status(500).json({ error: "Internal Server Error", success: false });
  }
};

// ==================================== LOGIN =========================================================

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ error: "All Fields must be filled!", success: false });
    }

    const user = await User.findOne({ email });
    const isPasswordCorrect = await bcrypt.compare(
      password,
      user?.password || ""
    );

    if (!user || !isPasswordCorrect) {
      return res
        .status(400)
        .json({ error: "Invalid Username or Password", success: false });
    }

    generateToken(user._id, email, res);
    res.status(200).json({
      user: {
        _id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        image: user.image,
        color: user.color,
        profileSetup: user.profileSetup,
      },
      success: true,
      message: "Login Successful",
    });
  } catch (error) {
    console.log(`Error at Login Controller ${error}`);
    res.status(500).json({ error: "Internal Server Error", success: false });
  }
};

// ============================================= Logout ===========================================
export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out Successfully", success: true });
  } catch (error) {
    console.log(`Error at Logout Controller : ${error.message}`);
    res.status(500).json({ error: "Internal Server Error", success: false });
  }
};

//  ======================================== GetME ==================================================
// export const getMe = async (req, res) => {
//     try {
//       // req.user is a comming from the protected route, which is use on this route
//       const user = await User.findOne(req.user._id).select("-password")
//       res.status(200).json(user);
//     } catch (error) {
//       console.log(`Error at GetME : ${error.message}`)
//       res.status(500).json({ error: "Internal Server Error" })
//     }
//   }


// ======================================= updateProfile =================================================
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const { firstName, lastName, color } = req.body;
    if (!firstName || !lastName) {
      return res
        .status(400)
        .json({ error: "All fields must be filed.", success: false });
    }
    const userData = await User.findByIdAndUpdate(
      userId,
      {
        firstName,
        lastName,
        color,
        profileSetup: true,
      },
      { new: true, runValidators: true }
    ).select("-password");
    // console.log(userData);
    return res
      .status(200)
      .json({
        user: userData,
        success: true,
        message: "Your profile has been updated.",
      });
  } catch (error) {
    console.log(`Error at updateProfile Controller : ${error.message}`);
    res.status(500).json({ error: "Internal Server Error", success: false });
  }
};




// ============================================= updateProfileImage ===========================================================
export const updateProfileImage = async (req, res) => {
  try {
    const userId = req.user._id;
    if (!req.file) {
      return res.status(400).json({ error: "image is required", success: false })
    }
    const cloudinary_PublicID = userId+uuid()
console.log("file PATH : ",req.file)
    const cloudinary_res = await cloudinary.uploader.upload(req.file.path, { public_id: cloudinary_PublicID })
    // Optimize delivery by resizing and applying auto-format and auto-quality
    const optimizeUrl = cloudinary.url(cloudinary_PublicID, {
      fetch_format: 'auto',
      quality: 'auto',
      crop: "auto",
      gravity: 'auto',
      width: 500,
      height: 500,
    });
    // console.log(cloudinary_res.secure_url)
    // console.log(optimizeUrl)
    fs.unlink(req.file.path, (err) => {
      console.log("Error at unlink multer saved file", err)
    })

    const updatedUser = await User.findByIdAndUpdate(userId, { image: optimizeUrl }, { new: true, runValidators: true }).select("-password")
    console.log(updatedUser)
    return res.status(200).json({ user: updatedUser, message:"Image Updated Successfully", success: true })

  } catch (error) {
    console.log(`Error at updateProfileImage Controller : ${error}`);
    res.status(500).json({ error: "Internal Server Error", success: false });
  }
}


// ============================================ updateProfileImage_remove =====================================================
export const updateProfileImage_remove = async (req, res) => {
  try {
    const userId = req.user._id
    const user = await User.findById(userId)
    const imgId = user.image.split("/").pop().split("?").shift();
    await cloudinary.uploader.destroy(imgId)
    // https://res.cloudinary.com/dgzi0hiu2/image/upload/c_auto,f_auto,g_auto,h_500,q_auto,w_500/66ec062c46bf1a31bfe2b6e8434205d8-1220-4396-a8c3-c3b5065f03d5?_a=BAMAH2ZU0
    // await cloudinary.uploader.destroy("66ec062c46bf1a31bfe2b6e8434205d8-1220-4396-a8c3-c3b5065f03d5")
    await User.updateOne({ _id: userId }, { $set: { image: "" } }).select("-password")

res.status(200).json({message:"Image Removed Successfully",success:true})
    
  } catch (error) {
    console.log(`Error at updateProfileImage_remove Controller : ${error.message}`);
    res.status(500).json({ error: "Internal Server Error", success: false });
  }
}