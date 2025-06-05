import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  destination: String,
  last_travel_date: Date,
  details: String, // e.g., “flight + hotel”
});

export default mongoose.models.Order || mongoose.model('Order', orderSchema);