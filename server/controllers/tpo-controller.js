const HttpError = require('../models/http-error');
const StudentDetail = require('../models/studentdetail');



const getStudentDetailsById = async (req, res, next) => {

    const studentId = req.params.student;

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
    
      res.json({ student: student[0] });
};

const getStudentDetails = async (req, res, next) => {
    let students;

    try {
        students = await StudentDetail.find({});
    } catch (err) {
        const error = new HttpError(
          'Something went wrong, could not find students.',
          500
        );
        return next(error);
      }
    
      if (!students) {
        const error = new HttpError(
          'Could not find students.',
          404
        );
        return next(error);
      }
    
      res.json({ students: students });
}


const getDashboardDetails = async (req, res, next) => {

  let students_placed, students_unplaced, m_students_placed, m_students_unplaced, hr_students_placed, hr_students_unplaced;
  try {
    students_placed = await StudentDetail.find({ placement_status : "placed" });
    students_unplaced = await StudentDetail.find({ placement_status : "unplaced" });

    m_students_placed = await StudentDetail.find({ $and: [ { specialisation : "Mkt&Fin" }, { placement_status : "placed" } ] });
    m_students_unplaced = await StudentDetail.find({ $and: [ { specialisation : "Mkt&Fin" }, { placement_status : "unplaced" } ] });
    hr_students_placed = await StudentDetail.find({ $and: [ { specialisation : "Mkt&HR" }, { placement_status : "placed" } ] });
    hr_students_unplaced = await StudentDetail.find({ $and: [ { specialisation : "Mkt&HR" }, { placement_status : "unplaced" } ] });
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not find students.',
      500
    );
    return next(error);
  }

  res.status(200).json({ total_placed : students_placed.length, total_unplaced : students_unplaced.length, m_placed : m_students_placed.length, m_unplaced : m_students_unplaced.length, hr_placed : hr_students_placed.length, hr_unplaced : hr_students_unplaced.length });


}

exports.getStudentDetailsById = getStudentDetailsById;
exports.getStudentDetails = getStudentDetails;
exports.getDashboardDetails = getDashboardDetails;