import mongoose from 'mongoose';

const inquirySchema = new mongoose.Schema({
  customerName: {
    type: String,
    required: true,
    trim: true
  },
  customerEmail: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  customerPhone: {
    type: String,
    required: true,
    trim: true
  },
  message: {
    type: String,
    required: true,
    trim: true
  },
  watchId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Watch',
    required: false
  },
  watchName: {
    type: String,
    required: false,
    trim: true
  },
  status: {
    type: String,
    required: true,
    enum: ['Pending', 'Contacted', 'Completed'],
    default: 'Pending'
  }
}, {
  timestamps: true
});

const Inquiry = mongoose.model('Inquiry', inquirySchema);
export default Inquiry;
