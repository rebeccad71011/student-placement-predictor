const mongoose = require("mongoose");

const bcrypt = require("bcryptjs");

const HttpError = require("../models/http-error");
const User = require("../models/user");
const StudentDetail = require("../models/studentdetail");

const getUsers = async (req, res, next) => {
	let users;

	try {
		users = await User.find({ _id: { $nin: [res.locals.userData.userId] } } );
	} catch (err) {
		const error = new HttpError(
			"Something went wrong, could not find any users.",
			500
		);
		return next(error);
	}

	if (!users) {
		const error = new HttpError(
			"Could not find any users for this application.",
			404
		);
		return next(error);
	}

	res.json({ users: users });
};

const addUsers = async (req, res, next) => {
	const { username, password, role } = req.body;

	let existingUser;
	try {
		existingUser = await User.findOne({ username: username });
	} catch (err) {
		const error = new HttpError(
			"Adding new user failed, please try again later.",
			500
		);
		return next(error);
	}

	if (existingUser) {
		const error = new HttpError(
			"User exists already, please ask him/her to login instead.",
			422
		);
		return next(error);
	}

	let hashedPassword;
	try {
		hashedPassword = await bcrypt.hash(password, 12);
	} catch (err) {
		return next(
			new HttpError("Could not create user, please try again later!", 500)
		);
	}

	const createdUser = new User({
		username: username,
		password: hashedPassword,
		role: role,
	});

	try {
		await createdUser.save();
	} catch (err) {
		const error = new HttpError(
			"Creating user failed, please try again later.",
			500
		);
		return next(error);
	}

	res.status(200).json({ user: createdUser.toObject({ getters: true }) });
};

const updateUser = async (req, res, next) => {
	const { username, password, role } = req.body;
	const userId = req.params.uid;

	let existingUser;
	try {
		existingUser = await User.findById(userId);
	} catch (err) {
		const error = new HttpError(
			"Updating user failed, please try again later.",
			500
		);
		return next(error);
	}

	if (!existingUser) {
		const error = new HttpError(
			"User not found, please add user instead.",
			422
		);
		return next(error);
	}

	if (!!password) {
		let newhashedPassword;
		try {
			newhashedPassword = await bcrypt.hash(password, 12);
		} catch (err) {
			return next(
				new HttpError("Could not update user, please try again later!", 500)
			);
		}
	}

	existingUser.username = username;
	existingUser.role = role;

	try {
		await existingUser.save();
	} catch (err) {
		const error = new HttpError(
			"Creating user failed, please try again later.",
			500
		);
		return next(error);
	}
	res.status(200).json({ user: existingUser.toObject({ getters: true }) });
};

const deleteUser = async (req, res, next) => {
	const uid = req.params.uid;

	let user;

	try {
		user = await User.findById(uid);
	} catch (err) {
		const error = new HttpError(
			"Something went wrong, could not delete user.",
			500
		);
		return next(error);
	}

	if (!user) {
		const error = new HttpError("Could not find user for this id.", 404);
		return next(error);
	}

	try {
		const sess = await mongoose.startSession();
		sess.startTransaction();
		let studentdetails;
		if (user.role === "student") {
			studentdetails = await StudentDetail.findOne({ userId: user.id });

			if (studentdetails) {
				await studentdetails.remove({ session: sess });
			}
		}
		await user.remove({ session: sess });
		await sess.commitTransaction();
	} catch (err) {
		const error = new HttpError(
			"Something went wrong, could not delete user.",
			500
		);
		return next(error);
	}

	res.status(200).json({ message: "Deleted User." });
};


const getStudentDetails = async (req, res, next) => {
	let studentdetails;

	try {
		studentdetails = await StudentDetail.find({});
	} catch (err) {
		const error = new HttpError(
			"Something went wrong, could not find any student's details.",
			500
		);
		return next(error);
	}

	if (!studentdetails) {
		const error = new HttpError(
			"Could not find any details of students.",
			404
		);
		return next(error);
	}

	res.json({ studentdetails: studentdetails });
};


const updateStudentDetails = async (req, res, next) => {
	const { name,
		gender,
		xPercentage,
		xiiPercentage,
		degreePercentage,
		etestP,
		mbaP,
		xiiBoard,
		xBoard,
		specialisation,
		workex,
		hscStream,
		degreeT,
		yearOfGrad,
		placement_status
	} = req.body;

	const details = req.params.did;

	let student;

	try {
		student = await StudentDetail.findById(details);
	} catch (err) {
		const error = new HttpError(
			'Something went wrong, could not find details for student.',
			500
		);
		return next(error);
	}
	
	if (!student) {
	const error = new HttpError(
		'Could not find details for the provided student-id.',
		404
	);
	return next(error);
	}


	student.name = name;
	student.gender = gender;
	student.xPercentage = xPercentage;
	student.xiiPercentage = xiiPercentage;
	student.degreePercentage = degreePercentage;
	student.etestP = etestP;
	student.mbaP = mbaP;
	student.xiiBoard = xiiBoard;
	student.xBoard = xBoard;
	student.specialisation = specialisation;
	student.workex = workex;
	student.hscStream = hscStream;
	student.degreeT = degreeT;
	student.yearOfGrad = yearOfGrad;
	student.placement_status = placement_status;
	
	try {
		await student.save(); 
	} catch (err) {
		const error = new HttpError(
		'Updating details failed, please try again later!',
		500
		);
		return next(err);
	}
	
	res.status(201).json({ details: student });
};

const deleteStudentDetails = async (req, res, next) => {
	const did = req.params.did;

	let details;

	try {
		details = await StudentDetail.findById(did);
	} catch (err) {
		const error = new HttpError(
			"Something went wrong, could not delete student details.",
			500
		);
		return next(error);
	}

	if (!details) {
		const error = new HttpError("Could not find details for this student.", 404);
		return next(error);
	}

	try {
		const sess = await mongoose.startSession();
		sess.startTransaction();
		await details.remove({ session: sess });
		await sess.commitTransaction();
	} catch (err) {
		const error = new HttpError(
			"Something went wrong, could not delete details for this student.",
			500
		);
		return next(error);
	}

	res.status(200).json({ message: "Deleted student details." });
};

exports.getUsers = getUsers;
exports.addUsers = addUsers;
exports.updateUser = updateUser;
exports.deleteUser = deleteUser;
exports.getStudentDetails = getStudentDetails;
exports.updateStudentDetails = updateStudentDetails;
exports.deleteStudentDetails = deleteStudentDetails;