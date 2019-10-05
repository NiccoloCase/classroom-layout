import { Schema, Document } from "mongoose"
import { Class } from "../graphql";
import * as shortid from "shortid"

export const classSchema = new Schema({
    _id: {
        type: String,
        unique: true,
        default: shortid.generate
    },
    // nome della classe
    name: { type: String, required: true },
    // studenti
    students: [{ name: { type: String, required: true } }]
});

export type ClassDocument = Class & Document;