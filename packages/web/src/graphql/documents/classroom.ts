import gql from "graphql-tag";

export const getClassroomByIdQuery = gql`
    query GetClassroomByIdQuery($id: ID!) {
        getClassroomById(id: $id) {
            name
            students
            desks
        }
    }
`;

export const createClassroomMutation = gql`
    mutation CreateClassroomMutation($name: String!, $email:String!, $desks: String!, $students: [String!]!){
        createClassroom(name: $name, email:$email,desks:$desks, students:$students) {
            id
        }
    }
`
