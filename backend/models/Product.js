import mongoose from 'mongoose';

const productSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },
    image: {
      type: String,
      required: [true, 'Product image is required'],
      default: 'https://via.placeholder.com/400x400?text=Remirind',
    },
    category: {
      type: String,
      required: [true, 'Product category is required'],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Product price is required'],
      min: [0, 'Price must be positive'],
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
    },
    stock: {
      type: Number,
      required: [true, 'Stock count is required'],
      min: [0, 'Stock cannot be negative'],
      default: 0,
    },
    featured: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

productSchema.index({ name: 'text', category: 'text' });

const Product = mongoose.model('Product', productSchema);
export default Product;
