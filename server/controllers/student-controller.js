const { validationResult } = require('express-validator');
const mongoose = require('mongoose');

const HttpError = require('../models/http-error');
const User = require('../models/user');
const StudentDetail = require('../models/studentdetail');

const getStudentDetailsById = async (req, res, next) => {

  const studentId = res.locals.userData.userId;
  let student;

  try {
      student = await StudentDetail.find({ userId: studentId });
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
  
    res.status(200).json({ student: student[0] });
};

const updateDetails = async (req, res, next) => {

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
      placement_status } = req.body;
    
    let userDetails;

    try {
        userDetails = await User.findById(res.locals.userData.userId);
    } catch (err) {
        const error = new HttpError(
          'Updating Details failed, please try again!',
          500
        );
        return next(error);
      }
    
      if (!userDetails) {
        const error = new HttpError('Could not find user for provided id.', 404);
        return next(error);
      }
    
      
      const StudentDetails = new StudentDetail({
        name: name,
        gender: gender,
        xPercentage: xPercentage,
        xiiPercentage: xiiPercentage,
        degreePercentage: degreePercentage,
        etestP: etestP,
        mbaP: mbaP,
        xiiBoard: xiiBoard,
        xBoard: xBoard,
        specialisation: specialisation,
        workex: workex,
        hscStream: hscStream,
        degreeT: degreeT,
        yearOfGrad: yearOfGrad,
        placement_status: placement_status,
        userId: userDetails
    });
    
      try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await StudentDetails.save({ session: sess }); 
        await sess.commitTransaction();
      } catch (err) {
        const error = new HttpError(
          'Updating details failed, please try again later!',
          500
        );
        return next(err);
      }
    
      res.status(201).json({ details: StudentDetails });
}

exports.updateDetails = updateDetails;
exports.getStudentDetailsById = getStudentDetailsById;
