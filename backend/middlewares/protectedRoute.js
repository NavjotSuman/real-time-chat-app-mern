import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protectedRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt
    if (!token) {
      return res
        .status(401)
        .json({ error: "Unauthorized, No Token Provided", success: false });
    }
    const decode = jwt.verify(token, process.env.JWT_SECRET)

    if (!decode) {
      return res
        .status(401)
        .json({ error: "Unauthorized, Invalid Token", success: false });
    }
    const user = await User.findById(decode.userId).select("-password")

    if (!user) {
      return res
        .status(401)
        .json({ error: "User Not Found", success: false });
    }
    req.user = user
    next();

  } catch (error) {
    console.log(`Error at Protected Route : ${error}`);
    res.status(500).json({
      error: `Internal server Error`,
      success: false,
    });
  }
};
