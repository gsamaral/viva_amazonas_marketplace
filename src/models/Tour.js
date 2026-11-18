import mongoose from 'mongoose';
const tourSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  city: { type: String, enum: ['Manaus', 'Presidente Figueiredo'], required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  originalPrice: { type: Number, min: 0 },
  date: { type: Date, required: true },
  availableSpots: { type: Number, required: true, min: 0 },
  provider: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  image: { type: String, default: '' },
  active: { type: Boolean, default: true }
}, { timestamps: true });
tourSchema.virtual('isPromotional').get(function () { return this.originalPrice && this.originalPrice > this.price; });
tourSchema.set('toJSON', { virtuals: true });
export default mongoose.model('Tour', tourSchema);