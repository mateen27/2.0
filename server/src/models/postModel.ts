import mongoose, { Schema, Document } from 'mongoose';

export interface PostInterface extends Document {
    type: string;
    contentUrl: string;
    userId: mongoose.Types.ObjectId;
    likes: mongoose.Types.ObjectId[];
    comments: CommentInterface[];
}

// Define the interface for a comment
export interface CommentInterface {
    userId: mongoose.Types.ObjectId;
    text: string;
}

// Define the schema for a comment
const commentSchema: Schema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    text: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

// Define the schema for the post document
const postSchema: Schema = new Schema({
    type: {
        type: String,
        required: true
    },
    contentUrl: {
        type: String,
        required: true
    },
    contentDescription: {
        type: String,
        
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    likes: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    comments: [commentSchema]
}, {
    timestamps: true
});

// Create and export the Post model
const Post = mongoose.model<PostInterface>('Post', postSchema);
export default Post;