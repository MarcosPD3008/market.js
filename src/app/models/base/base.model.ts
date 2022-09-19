import mongoose from "mongoose";

export default interface BaseModel extends mongoose.Document {
    _id?: string;

    createdAt?: Date;
    updatedAt?: Date;
}

