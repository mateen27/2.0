import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

interface UserInterface extends Document {
    name: string;
    email: string;
    password: string;
    mobile: string;
    pic?: string;
    otp?: number | null;
    friendRequests: mongoose.Types.ObjectId[];
    followers: mongoose.Types.ObjectId[];
    following: mongoose.Types.ObjectId[];
    sentFriendRequests: mongoose.Types.ObjectId[];
    uploadedMovies: {
    count: number;
    links: string[];
    is_online: boolean;
  };
  }

const userModelSchema: Schema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  mobile: {
    type: String,
    required: true,
    unique: true
  },
  pic: {
    type: String,
    default: 'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg'
  },
  otp:{
    type: Number,
    default: null
  },
  friendRequests: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  followers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  following: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  sentFriendRequests: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  uploadedMovies: {
    count: Number,
    links: [String]
  },
  is_online: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true
});

userModelSchema.pre<UserInterface>('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(this.password, salt);
  this.password = hashedPassword;
  next();
});

const User = mongoose.model<UserInterface>('User', userModelSchema);

export default User;