import mongoose, { Schema, Model } from "mongoose";
import { Role } from "./role.model";
import { Post } from "./post.model";

const userShemma = new Schema<User>({
    login: {
        type: Schema.Types.String,
        index: true,
        unique: true,
        required : true
    },
    password:{
        type: Schema.Types.String,
        required: true
    },
    username: {
        type: Schema.Types.String,
        required: true
    },
    roles:[{
        type: Schema.Types.ObjectId,
        ref: "Role",
        required: true
    }],
    posts: [{
        type: Schema.Types.ObjectId,
        ref: "Post",
        required: true
    }],
    // User personal infos
    image: {
        type: Schema.Types.String,
        required: true
    },
    aboutMe: {
        type: Schema.Types.String,
        required: false
    },
    joinDate : {
        type: Schema.Types.Date,
        required: true
    },
    follow: [{
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    }]

}, {
    versionKey: false,
    collection: "Users"
})

export interface User{
    _id: string
    login: string
    password: string
    username: string
    roles: Role[]
    posts: Post[]

    // User personal infos
    image: string
    aboutMe: string
    joinDate: Date

    // Online
    follow: any[]

}

export const UserModel: Model<User> = mongoose.model("User", userShemma)