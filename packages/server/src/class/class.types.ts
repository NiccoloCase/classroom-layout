import { Student } from "../graphql";

export interface createClassDTO {
    name: string;
    students: Student[];
}
