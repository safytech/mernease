import { errorHandler } from '../utils/error.js';
import User from '../models/user.model.js';
import jwt from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';
import { sendEmail } from '../utils/sendEmail.js';
import crypto from 'crypto';


export const signup = async (req, res, next) => {
  const { fullname, email, phone, password } = req.body;

  if (!fullname || !email || !phone || !password) {
    return next(errorHandler(400, "All fields are required"));
  }

  try {
    const hashedPassword = bcryptjs.hashSync(password, 10);

    const newUser = new User({
      fullname,
      email,
      phone,
      password: hashedPassword,
    });

    await newUser.save();

    return res.json({
      success: true,
      message: "Signup successful",
    });
  } catch (error) {
    return next(error);
  }
};


export const signin = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(errorHandler(400, "All fields are required"));
  }

  try {
    const validUser = await User.findOne({ email });

    if (!validUser) {
      return res.status(400).json({ message: "User not found" });
    }

    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    const token = jwt.sign(
      { id: validUser._id },
      process.env.JWT_SECRET
    );

    const { password: pass, ...rest } = validUser._doc;

    res
      .status(200)
      .cookie('access_token', token, { httpOnly: true })
      .json(rest);
  } catch (error) {
    next(error);
  }
};


function replacePlaceholders(template, values) {
  return template.replace(/{{(.*?)}}/g, (_, key) => {
    return values[key.trim()] || "";
  });
}

function formatLabel(text) {
  if (!text) return "";
  return text
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}


export const forgot = async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return next(errorHandler(400, "Email is required"));
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const token = user.generateResetToken();
  user.$disableAudit = true;
  await user.save();

  const SUBJECT = "reset_password_request";

  const template = `
    Hi {{userName}},

    We received a request to reset your password.

    Reset Password Link:
    {{resetLink}}

    This link will expire in 1 hour.

    If you didn’t request this, ignore this email.
    
    Thanks,
    The {{APP_NAME}} Team
  `;

  const values = {
    resetLink: `${process.env.APP_URL}/auth/reset/${token}`,
    userName: user.fullname,
    APP_NAME: process.env.APP_NAME
  };

  const filled = replacePlaceholders(template, values);

  await sendEmail({
    to: user.email,
    subject: formatLabel(SUBJECT),
    text: filled,
    html: filled.replace(/\n/g, "<br>"),
  });

  res.json({ message: "Reset link sent to email" });
};

/**
 * RESET PASSWORD
 */
export const reset = async (req, res, next) => {
  const hashedToken = crypto.createHash('sha256')
                            .update(req.params.token)
                            .digest('hex');

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: Date.now() }
  });

  if (!user) {
    return res.status(400).json({ message: "Invalid or expired token" });
  }

  const hashedPassword = bcryptjs.hashSync(req.body.password, 10);

  user.password = hashedPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;

  await user.save();

  res.json({ message: "Password has been reset" });
};
