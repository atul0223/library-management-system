import User from "../models/user.model";
import generateJWT from "../utils/jwtgenerator";
import sendOtp from "../utils/sendOtp";

const signIn =async(req:any,res:any)=>{
    const { username, email } = req.body;
  if ([username, email].some(f => !f?.trim())) {
  return res.status(400).json({ message: "All fields are required" });
}

    const emailExists = await User.findOne({ email });
    if (emailExists) {
        return res.status(400).json({ message: "Email already exists" });
    }
     const role = "member";
    const newUser = await User.create({ username, email, role  });
   await sendOtp(email);
    return res.status(201).json({ message: "verify through otp" });
}
const login = async (req:any, res:any) => {
    const { email} = req.body;
    if (!email) {
        return res.status(400).json({ message: "please provide email" });
    }
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }
    await sendOtp(email);
    return res.status(200).json({ message: "otp sent successfully" });
}
const verifyOtp = async (req:any, res:any) => {
    const { email, otp ,keepLoggedIn} = req.body;

    
    if (![email, otp].every(Boolean)) {
        return res.status(400).json({ message: "All fields are required" });
    }
    const user = await User.findOne({ email });
    if (user?.otp === null) {
        return res.status(423).json({ message: "OTP send first" });
    }
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }
    if (typeof user?.otp === "undefined" || user.otp === 0 || user.otp.toString() !== otp.toString()) {
        return res.status(400).json({ message: "Invalid OTP" });
    }
    user.otp = 0;


   
    const token = generateJWT(user._id , keepLoggedIn ? "30d" : "30m",user.role||"member");
    await user.save();
   
    return res
    .cookie("token", token, {   httpOnly: true,
          secure: true,
          sameSite: "none",
          maxAge: keepLoggedIn ? 30 * 24 * 60 * 60 * 1000 : 30 * 60 * 1000, // 30 days or 30 minutes
      })
      
    .status(200).json({ message: "OTP verified successfully" });
}
 const getUser = async (req: any, res: any) => {
  const user = await User.findById(req.user.userId).populate("issuedBooks");
  if (!user) return res.status(404).json({ message: "User not found" });

  res.status(200).json({
    user: {
      username: user.username,
      email: user.email,
      role: user.role,
      issuedBooks: user.issuedBooks,
    },
  });
};

export { signIn, login, verifyOtp, getUser };