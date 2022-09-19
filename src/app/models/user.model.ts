import mongoose from "mongoose";
import BaseModel from "./base/base.model";

export interface User extends BaseModel {
    firstName: string;
    lastName: string;
    email: string;
    password: string;

    //for auth
    token?: string;
}

const userSchema = new mongoose.Schema<User>(
    {
        firstName: { 
            type: String,
            required: true, 
            default: null 
        },
        lastName: { 
            type: String, 
            required: true,
            default: null 
        },
        email: { 
            type: String, 
            required: true,
            unique: true,
            email: true,
        },
        password: { 
            type: String,
            required: true,
        },
        token: { 
            type: String,
            required: false
        }
    },
    {
        timestamps: true
    }
);

export default mongoose.model<User>("User", userSchema);