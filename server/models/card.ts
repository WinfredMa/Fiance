import * as mongoose from 'mongoose';

const cardSchema = new mongoose.Schema({
  bank: String,
  type: String,
  limit: Number,
  remark: String,
  statementdate: String,
  duedate: String,
  createdate: String
});

const Card = mongoose.model('Card', cardSchema);

export default Card;