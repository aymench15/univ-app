// import mongoose from "mongoose";
// const { Schema } = mongoose;
// const EmailsSchema = new Schema({
//   email: {
//     type: String,
//     required: [true, 'Email address is required'],
//     unique: true,
//     trim: true,
//     lowercase: true,
//     validate: {
//       validator: function(email) {
//         return emailRegex.test(email);
//       },
//       message: props => `${props.value} is not a valid email address`
//     },
//     index: true // Add index for better query performance
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now,
//     index: true // Add index for sorting and querying by date
//   }});
// export default mongoose.model("Emails", EmailsSchema);

import mongoose from "mongoose";
const { Schema } = mongoose;

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const EmailsSchema = new Schema({
  email: {
    type: String,
    required: [true, 'Email address is required'],
    unique: true,
    trim: true,
    lowercase: true,
    validate: {
      validator: function(email) {
        return emailRegex.test(email);
      },
      message: props => `${props.value} is not a valid email address`
    },
    index: true // Add index for better query performance
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true // Add index for sorting and querying by date
  },
  active: {
    type: Boolean,
    default: true,
    index: true // Add index for filtering active/inactive emails
  },
  lastModified: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true, // Automatically handle updatedAt and createdAt
  versionKey: false // Remove __v field
});

// Add compound index for email + active status
EmailsSchema.index({ email: 1, active: 1 });

// Pre-save middleware to update lastModified
EmailsSchema.pre('save', function(next) {
  this.lastModified = new Date();
  next();
});

// Add instance method to safely update email
EmailsSchema.methods.updateEmail = async function(newEmail) {
  if (!emailRegex.test(newEmail)) {
    throw new Error('Invalid email format');
  }
  this.email = newEmail.toLowerCase().trim();
  this.lastModified = new Date();
  return this.save();
};

// Add static method to find duplicate emails
EmailsSchema.statics.findDuplicates = async function() {
  return this.aggregate([
    {
      $group: {
        _id: { email: '$email' },
        count: { $sum: 1 },
        ids: { $push: '$_id' }
      }
    },
    {
      $match: {
        count: { $gt: 1 }
      }
    }
  ]);
};

// Handle duplicate key errors more gracefully
EmailsSchema.post('save', function(error, doc, next) {
  if (error.name === 'MongoServerError' && error.code === 11000) {
    next(new Error(`Email ${doc.email} already exists`));
  } else {
    next(error);
  }
});

const Email = mongoose.model("Emails", EmailsSchema);

// Create indexes
Email.createIndexes().catch(err => {
  console.error('Error creating indexes:', err);
});

export default Email;