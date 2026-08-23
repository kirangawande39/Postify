require('dotenv').config();
const User = require("../models/User");
const { createAuditLog } = require("../services/auditService");

const authServices = require('../services/authService')
// Generate JWT Token


const register = async (req, res, next) => {
  try {

    const registeredUser = await authServices.registerUser(req.body);

    await createAuditLog({
      req,
      module: "AUTH",
      action: "REGISTER",
      targetId: registeredUser._id,
      targetType: "User",
      actorEmail: registeredUser.email,
      description: "New user registered successfully",
      success: true,
      metadata: {
        username: registeredUser.username,
      },
    });

    res.status(201).json({
      message: "Registration Sucessfully..",
      success: true,
    });

  } catch (err) {
    next(err);
  }
};


// Login User
const login = async (req, res, next) => {
  try {

    // console.log("Req.user:",req.user)

    const { user, token } = await authServices.loginUser(req.user);

    await createAuditLog({
      req,
      module: "AUTH",
      action: "LOGIN",
      targetId: user._id,
      targetType: "User",
      description: "User logged in successfully",
      metadata: {
        loginMethod: "LOCAL",
      },
    });

    // console.log(token)
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,          // HTTPS ke liye
      sameSite: "none",      // 🔥 MUST for cross-origin
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    // console.log(user,token)

    res.json({
      success: true,
      message: "Login Successful",
      user,
      // token,
      redirectUrl: "/"
    });
  } catch (err) {
    next(err);
  }
};




const logout = async (req, res, next) => {
  try {
    // console.log("logout called")

    await createAuditLog({
      req,
      module: "AUTH",
      action: "LOGOUT",
      targetId: req.user.id,
      targetType: "User",
      description: "User logged out",
      success: true,
    });

    res.clearCookie("token", {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      secure: process.env.NODE_ENV === 'production',
    });

    res.status(200).json({
      success: true,
      message: "Logged out successfully"
    });

  } catch (err) {
    next(err);
  }
};



// Google OAuth callback
const googleCallBack = async (req, res, next) => {
  try {
    const { token, UI_URL } = await authServices.googleCallBack(req.user);

    // console.log("UI_URL",UI_URL)
    // console.log("token",token)

    await createAuditLog({
      req,
      module: "AUTH",
      action: "GOOGLE_LOGIN",
      targetId: req.user._id,
      targetType: "User",
      actorEmail: req.user.email,
      description: "User logged in using Google",
      success: true,
      metadata: {
        loginMethod: "GOOGLE",
      },
    });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });
    res.redirect(UI_URL);
  } catch (err) {
    next(err);
  }
};



const checkEmail = async (req, res, next) => {
  try {
    await authServices.checkEmail(req.body)

    res.status(200).json({ message: "Email exists" });
  } catch (err) {

    next(err);
  }
}


const forgotPassword = async (req, res, next) => {
  try {

    const { message } = await authServices.forgotPassword(req.body)

    await createAuditLog({
      req,
      module: "PASSWORD",
      action: "RESET_REQUESTED",
      actorEmail: req.body.email,
      description: "Password reset requested",
      success: true,
    });

    res.status(200).json({
      message,
    });

  } catch (err) {
    next(err);
  }
}
// controllers/authController.js

const resetPassword = async (req, res, next) => {
  try {
    const { token, newPassword } = req.body;

    const result = await authServices.resetPassword(token, newPassword);

    await createAuditLog({
      req,
      module: "PASSWORD",
      action: "RESET_COMPLETED",
      targetType: "User",
      actorEmail: req.body.email,
      description: "Password reset completed successfully",
      success: true,
    });

    return res.status(200).json({ message: result });

  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};




const check = async (req, res, next) => {
  const token = req.cookies.token;
  const userId = req.user.id;

  // console.log("userId from check route::", userId);



  if (!token) {
    return res.status(401).json({ loggedIn: false })
  }


  try {

    const user = await User.findById(userId).select('username email');
    // console.log(user)

    if (user) {
      res.json({
        loggedIn: true,
        message: 'Login Sucessfully..',
        user: { id: user._id, username: user.username, email: user.email },
        redirectUrl: '/'
      });
    }
  }
  catch (err) {
    return res.status(401).json({ loggedIn: false });
  }
}

const sendOtp = async (req, res, next) => {
  try {
    let { email } = req.body;



    // console.log(email)
    await authServices.sendOtp(email);

    await createAuditLog({
      req,
      module: "AUTH",
      action: "OTP_SENT",
      actorEmail: req.body.email,
      description: "OTP sent successfully",
      success: true,
    });

    res.status(200).json({ message: "OTP send sucessfully", success: true })
  }
  catch (err) {
    next(err);
  }
}

const verifyOtp = async (req, res, next) => {
  try {
    let { email, otp } = req.body;
    // console.log(email, otp)

    await authServices.verifyOtp(email, otp);

    await createAuditLog({
      req,
      module: "AUTH",
      action: "OTP_VERIFIED",
      actorEmail: req.body.email,
      description: "OTP verified successfully",
      success: true,
    });

    res.status(200).json({ message: "Verify Sucessfully", success: true })
  }
  catch (err) {
    next(err)
  }
}

module.exports = { register, login, logout, checkEmail, forgotPassword, resetPassword, googleCallBack, check, sendOtp, verifyOtp };
