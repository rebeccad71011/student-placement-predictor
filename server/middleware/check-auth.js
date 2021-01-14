const jwt = require("jsonwebtoken");

const HttpError = require("../models/http-error.js");

module.exports = (req, res, next) => {
	if (req.method === "OPTIONS") {
		return next();
	}
	try {
		const token = req.headers.authorization.split(" ")[1];
		if (!token) {
			throw new HttpError("Authentication failed!", 401);
		}
		const decodedToken = jwt.verify(token, "supersecret_dont_share");
		if (decodedToken.role === res.locals.accessRole) {
			res.locals.userData = { userId: decodedToken.userId };
			next();
		} else {
			return next(new HttpError("Access could not be granted!", 403));
		}
	} catch (err) {
		return next(new HttpError("Authentication failed!", 403));
	}
};
