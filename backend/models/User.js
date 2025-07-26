import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: function() {
      return !this.isAnonymous;
    }
  },
  email: {
    type: String,
    required: function() {
      return !this.isAnonymous;
    },
    unique: true,
    sparse: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: function() {
      return !this.isAnonymous;
    },
    minlength: 6
  },
  deviceId: {
    type: String,
    required: function() {
      return this.isAnonymous;
    },
    unique: true,
    sparse: true
  },
  isAnonymous: {
    type: Boolean,
    default: true
  },
  preferences: {
    theme: {
      type: String,
      enum: ['light', 'dark', 'system'],
      default: 'system'
    },
    notifications: {
      type: Boolean,
      default: false
    },
    resourceCategories: {
      type: [String],
      default: []
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastActive: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Method to generate JWT token
userSchema.methods.generateAuthToken = function() {
  if (!process.env.JWT_SECRET) {
    console.warn('JWT_SECRET not set in environment variables, using fallback key');
  }
  
  return jwt.sign(
    { 
      userId: this._id,
      email: this.email,
      isAnonymous: this.isAnonymous 
    },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '7d' }
  );
};

const User = mongoose.model('User', userSchema);

export default User;