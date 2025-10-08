import bcrypt from "bcrypt";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "email required"],
    unique: true,
    lowercase: true,
    trim: true,
  },

  password: {
    type: String,
    required: [true, "password required"],
  },

  role: {
    type: String,
    enum: ["employee", "admin"],
    default: "employee",
  },

  // Anonymization fields
  anonymousId: {
    type: String,
    unique: true,
    required: true,
  },

  anonymousName: {
    type: String,
    required: true,
  },

  // Email verification fields
  isEmailVerified: {
    type: Boolean,
    default: false,
  },

  verificationToken: {
    type: String,
  },

  verificationTokenExpiry: {
    type: Date,
  },

  // Hashed identity (for extra anonymization layer)
  identityHash: {
    type: String,
    unique: true,
  },
}, {
  timestamps: true
});

// Generate anonymous identity before saving
userSchema.pre("save", async function (next) {
  if (this.isNew) {
    // Generate anonymous ID (e.g., "ANON-8F2A9B")
    this.anonymousId = `ANON-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
    
    // Generate anonymous name (e.g., "Anonymous Falcon")
    const adjectives = ['Swift', 'Silent', 'Mystic', 'Noble', 'Clever', 'Brave', 'Wise', 'Bold', 'Quick', 'Fierce'];
    const animals = ['Falcon', 'Phoenix', 'Dragon', 'Eagle', 'Wolf', 'Tiger', 'Panther', 'Hawk', 'Lion', 'Fox'];
    
    const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const randomAnimal = animals[Math.floor(Math.random() * animals.length)];
    this.anonymousName = `${randomAdjective} ${randomAnimal}`;

    // Create identity hash (SHA-256 of email + timestamp + random salt)
    const identityString = `${this.email}-${Date.now()}-${crypto.randomBytes(16).toString('hex')}`;
    this.identityHash = crypto.createHash('sha256').update(identityString).digest('hex');
  }

  // Hash password if modified
  if (!this.isModified("password")) return next();

  try {
    this.password = await bcrypt.hash(this.password, 12);
    next();
  } catch (error) {
    next(error);
  }
});

// Generate email verification token
userSchema.methods.generateVerificationToken = function() {
  const token = crypto.randomBytes(32).toString('hex');
  this.verificationToken = crypto.createHash('sha256').update(token).digest('hex');
  this.verificationTokenExpiry = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
  return token;
};

// compare password before logging
userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Get public profile (anonymized data only)
userSchema.methods.getPublicProfile = function() {
  return {
    anonymousId: this.anonymousId,
    anonymousName: this.anonymousName,
    role: this.role,
    isEmailVerified: this.isEmailVerified,
  };
};

const userModel = mongoose.model("User", userSchema);
export default userModel;
