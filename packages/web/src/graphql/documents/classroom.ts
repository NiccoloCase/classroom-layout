import gql from "graphql-tag";

/**
 * Restituisce una classe dato l'id
 */
export const getClassroomByIdQuery = gql`
    query GetClassroomById($id: ID!) {
        getClassroomById(id: $id) {
            name
            email
            students
            desks {
                x
                y
                orientation
            }
        }
    }
`;

/**
 * Verifica se l'email passata è già associata a un account
 */
export const isEmailAlreadyUsedQuery = gql`
    query isEmailAlreadyUsed($email:String!) {
        isEmailAlreadyUsed(email: $email)
    }
`

/**
 * Crea una nuova classe
 */
export const createClassroomMutation = gql`
    mutation CreateClassroom($name: String!, $email:String!, $desks: [DeskInput!]!, $students: [String!]!){
        createClassroom(name: $name, email: $email, desks: $desks, students: $students) {
            id
        }
    }
`

/**
 * Cabia i posti
 */
export const shuffleDesksMutation = gql`
    mutation ShuffleDesks($id: ID!){
        shuffleDesks(classId: $id) {
            students
        }
    }
`

