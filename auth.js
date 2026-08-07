// activity 47
const jwt = require("jsonwebtoken");

require("dotenv").config();

module.exports.createAccessToken = (user) => {
	console.log("creating payload...");

	const data = {
		id: user._id,
		email: user.email,
		isAdmin: user.isAdmin
	}

	console.log(data);

	return jwt.sign(data, process.env.JWT_SECRET_KEY, {})
}


module.exports.verify = (req, res, next) => {
	let token = req.headers.authorization;

	if (typeof token === 'undefined'){
		return res.status(401).send({auth: "Failed. No Token"});
	}
	else {
		token = token.slice(7, token.length);

		jwt.verify(token, process.env.JWT_SECRET_KEY, function(err, decodedToken){
			if (err){
				return res.send({
					auth: "Failed",
					message: err.message
				})
			}
			else {
				req.user = decodedToken;
				next();
			}
		})
	}
}

module.exports.verifyAdmin = (req, res, next) => {
	if (req.user.isAdmin == true){
		next();
	}
	else {
		return res.status(403).send({
			auth:"Failed",
			message: "Action Forbidden"
		})
	}
}

module.exports.errorHandler = (err, req, res, next) => {
	const statusCode = err.status || 500;
	const errorMessage = err.message || "Internal Server Error";

	return res.status(statusCode).json({
		error:{
			message: errorMessage,
			errorCode: err.code || "SERVER ERROR",
			details: err.details || null
		}
	});
}


module.exports.isLoggedIn = (req, res, next) => {
	if (req.user){
		next();
	}
	else {
		res.sendStatus(401);
	}
}