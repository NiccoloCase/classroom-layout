import { Schema, Document } from "mongoose";
import { generate } from "shortid";
import { Token } from "../graphql";

export type ITokenModel = Document & Token;

export const TokenSchema = new Schema({
    _id: { type: String, default: generate },
    email: { type: String, required: true },
    scope: {
        type: String,
        enum: ["DELETE_CLASSROOM"],
        required: true
    },
    createdAt: {
        type: Date,
        expires: 3600,
        default: Date.now()
    }
});


