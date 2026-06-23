import mongoose from 'mongoose';

const slideSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  subtitle: {
    type: String,
    default: '',
    trim: true
  },
  imageUrl: {
    type: String,
    required: true,
    trim: true
  },
  linkUrl: {
    type: String,
    default: '',
    trim: true
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

const Slide = mongoose.model('Slide', slideSchema);
export default Slide;
