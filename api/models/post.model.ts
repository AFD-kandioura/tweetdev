import mongoose, { Schema, Model } from "mongoose";
import { User } from "./user.model";
import { Comment } from "./comment.model";

const postShemma = new Schema<Post>({
    title: {
        type: Schema.Types.String, 
        required: true
    },
    description:{
        type: Schema.Types.String,
        required: true
    },
    like: [{
        type: Schema.Types.ObjectId,
        def: "User",
        required: true
    }],
    comments: [{
        type: Schema.Types.ObjectId,
        ref: "Comment",
        required: true
    }],
    creationDate: {
        type: Schema.Types.Date,
        required: true
    },
    userId: {
        type: Schema.Types.String,
        required: true
    },
    type: {
        type: Schema.Types.String,
        enum: ['tweet', 'tweetdev'],
        required: true
    },
    authorName: {
        type: Schema.Types.String,
        required: true
    },
    language: {
        type: Schema.Types.String,
        enum: ['python', 'javascript'],
        required: false
    },
    format: {
        type: Schema.Types.String,
        enum: ['text', 'image'],
        required: false
    }
}, {
    versionKey: false,
    collection: "Posts"
})

export interface Post{
    _id: string
    title: string |undefined
    description: string
    like: User[]
    comments: Comment[]
    creationDate : Date
    userId: string
    authorName: string
    type: 'tweet' | 'tweetdev'
    language: 'python' | 'javascript'
    format: 'text' | 'image'
}


export const PostModel: Model<Post> = mongoose.model("Post", postShemma)