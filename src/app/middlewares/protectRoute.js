const jwt = require("jsonwebtoken");
const User = require("../models/user.model.js");
const asyncHandler = require("express-async-handler");

const protectRoute = asyncHandler(async (req, res, next) => {
	try {
		const token = req.cookies.jwt;
		if (!token) {
			return res.status(401).json({ error: "Unauthorized - No Token Provided" });
		}

		const decoded = jwt.verify(token, process.env.JWT_SECRET);

		if (!decoded) {
			return res.status(401).json({ error: "Unauthorized - Invalid Token" });
		}

		const user = await User.findById(decoded._id).select("-password");

		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		req.user = user;

		next();
	} catch (error) {
        throw new Error(error);
		// console.log("Error in protectRoute middleware: ", error.message);
		// res.status(500).json({ error: "Internal server error" });
	}
});

module.exports = { protectRoute};