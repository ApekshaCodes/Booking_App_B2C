import mongoose from 'mongoose';

const travellerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: Number,
  gender: String,
  passportNumber: String
});

export default mongoose.models.Traveller || mongoose.model('Traveller', travellerSchema);