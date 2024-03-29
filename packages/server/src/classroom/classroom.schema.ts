import { Schema, Document } from "mongoose";
import { generate } from "shortid";
import { Classroom } from "../graphql";

export type IClassroomModel = Document & Classroom;

export const ClassroomSchema = new Schema({
    _id: { type: String, default: generate },
    email: { type: String, required: true, unique: true },
    name: { type: String, requirsed: true },
    desks: [{
        x: { type: Number, required: true },
        y: { type: Number, required: true },
        orientation: { type: Number, required: true }
    }],
    students: [{ type: String, required: true }]
});
