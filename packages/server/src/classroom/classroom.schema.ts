import { Schema, Document } from "mongoose";
import { generate } from "shortid";
import { Classroom } from "../graphql";

export const ClassroomSchema = new Schema({
    _id: { type: String, default: generate },
    email: { type: String, required: true, unique: true },
    name: { type: String, requirsed: true },
    desks: { type: String, required: true },
    students: [{ type: String, required: true }]
});

export type IClassroomModel = Document & Classroom;
