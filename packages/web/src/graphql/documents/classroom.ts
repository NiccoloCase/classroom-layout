import gql from "graphql-tag";

/**
 * Restituisce una classe dato l'id
 */
export const getClassroomByIdQuery = gql`
    query GetClassroomById($id: ID!) {
        getClassroomById(id: $id) {
            id
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

/**
 * Cambia i banchi
 */
export const editClassroomMutation = gql`
    mutation EditClassroom($id: ID!, $name: String, $email: String, $desks: [DeskInput!], $students: [String!]){
        editClassroom(id: $id, name: $name, email: $email, desks: $desks, students: $students) {
            id
        }
    }
`

/**
 * Spedisce un email contenete l'ID della classe associata
 */
export const sendClassroomIdByEmailMutation = gql`
    mutation SendClassroomIdByEmail($email: String!){
        sendClassroomIdByEmail(email: $email) {
            recipient
        }
    }
`

/**
 * Richiede un token per l'eliminazione di una classe
 */
export const requestClassroomDeletionMutation = gql`
    mutation RequestClassroomDeletion($id: String!){
        requestClassroomDeletion(id: $id) {
            tokenDigits
            email
        }
    }
`
/**
 * Elimina una classe 
 */
export const deleteClassroomMutation = gql`
    mutation DeleteClassroom($token: String!){
        deleteClassroom(token: $token) {
            success
        }
    }
`

