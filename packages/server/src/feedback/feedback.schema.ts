import { Schema, Document } from "mongoose";
import { Feedback } from "../graphql"

export type IFeedbackModel = Document & Feedback;

export const FeedbackSchema = new Schema({
    selectedValues: [{ type: String, default: [] }],
    textField: { type: String },
    email: { type: String, required: true }
});