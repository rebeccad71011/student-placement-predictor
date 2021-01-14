const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const studentDetailSchema = new Schema({
  name: { type: String, required: true },
  gender: { type: String, required: true },
  xPercentage: { type: Number, required: true },
  xBoard: { type: String, required: true },
  xiiPercentage: { type: Number, required: true },
  xiiBoard: { type: String, required: true },
  hscStream: { type: String, required: true },
  degreePercentage: { type: Number, required: true },
  degreeT: { type: String, required: true },
  workex: { type: String, required: true },
  specialisation: { type: String, required: true },
  etestP: { type: Number, required: true },
  mbaP: { type: Number, required: true },
  yearOfGrad:  { type: Number, required: true },
  placement_status: { type: String, default: '', required: true },
  userId: { type: mongoose.Types.ObjectId, required: true, ref: 'User' }
});

studentDetailSchema.plugin(uniqueValidator);

module.exports = mongoose.model('StudentDetail', studentDetailSchema);
