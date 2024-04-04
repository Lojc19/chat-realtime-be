const User = require("../models/user.model");
const asyncHandler = require('express-async-handler');
const { generateTokenAndSetCookie } = require("../../utils/jwtToken.js")

const loginUser = asyncHandler(async (req,res) => {
    try {
        const { username, password } = req.body;
        // check if user exists or not
        const findUser = await User.findOne({ username });
        if (findUser && (await findUser.isPasswordMatched(password))) {
            generateTokenAndSetCookie(findUser._id, res);
            res.json({
                status:"success",
                data: {
                    _id: findUser._id,
			              fullName: findUser.fullName,
			              username: findUser.username,
			              profilePic: findUser.profilePic,
                },
                message: "Đăng nhập thành công",
            });
        } else {
          throw new Error("Invalid Credentials");
        }
    } 
    catch (error) {
        throw new Error(error);
    }
});

const signupUser = asyncHandler(async (req,res) => {
    try {
        const {fullname, username, password, confirmPassword, gender} = req.body;
        const findUser = await User.findOne({ username: username });

        const boyprofilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`
        const girlprofilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`

        if (!findUser) {
          const newUser = await User.create({
            fullname,
            username,
            password,
            gender,
            profilePic: gender === "male" ? boyprofilePic : girlprofilePic 
          }
        );
          res.json({
            status:"success",
            data: newUser,
            message: "Đăng kí thành công",
          })
        } else {
          throw new Error("Username already exists");
        }
      } catch (error) {
        throw new Error(error);
      }
});

const logout = asyncHandler(async (req,res) => {
	try {
		res.cookie("jwt", "", { maxAge: 0 });
		res.status(200).json({ message: "Logged out successfully" });
	} catch (error) {
		console.log("Error in logout controller", error.message);
		res.status(500).json({ error: "Internal Server Error" });
    }
})

module.exports = {loginUser, signupUser, logout}