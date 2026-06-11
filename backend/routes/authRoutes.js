const express = require("express");
const { register, login, logout, checkEmail, forgotPassword, resetPassword, googleCallBack, check, sendOtp, verifyOtp } = require("../controllers/authController");
const { registerLimiter, loginLimiter, otpLimiter,forgotPasswordLimiter } = require("../middlewares/rateLimit");
const passport = require("passport");
const { protect } = require("../middlewares/authMiddleware");
const validate = require('../middlewares/validate')
const { registerSchema, loginSchema , emailSchema  , resetPasswordSchema , verifyOTPSchema } = require('../validations/authValidation')

require("dotenv").config();
const router = express.Router();



// router.post('/bulk-register', async (req, res, next) => {
//   try {
//     const users = req.body.users;

//     const createdUsers = [];

//     for (let user of users) {
//       const { name, email, password, username } = user;

//       const existing = await User.findOne({ email });
//       if (existing) continue;

//       const newUser = new User({ name, email, username });
//       const registeredUser = await User.register(newUser, password); // passport-local-mongoose

//       createdUsers.push({
//         id: registeredUser._id,
//         username: registeredUser.username
//       });
//     }

//     res.status(201).json({ message: "Users created", users: createdUsers });
//   } catch (err) {
//     next(err);
//   }
// });


router.get('/check', protect, check)

router.post("/register", registerLimiter, validate(registerSchema), register);

router.post("/logout", protect, logout);

router.post("/login", loginLimiter,validate(loginSchema), (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      // login failed
      // console.log("login failed")
      return res.status(401).json({
        success: false,
        message: info.message || "Invalid email or password"
      });
    }

    // console.log(user)
    req.user = user;
    next();
  })(req, res, next);
}, login);




// POST /api/auth/check-email
router.post("/check-email", validate(emailSchema), checkEmail);

router.post("/forgot-password",validate(emailSchema) ,  forgotPasswordLimiter, forgotPassword);

router.post("/reset-password", validate(resetPasswordSchema), resetPassword);

router.get("/google",
  passport.authenticate("google", { scope: ["profile", "email"] }));


router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    session: false,
  }), googleCallBack
);


router.post("/send-otp", otpLimiter, validate(emailSchema),sendOtp)
router.post("/verify-otp",validate(verifyOTPSchema), verifyOtp)

module.exports = router;
