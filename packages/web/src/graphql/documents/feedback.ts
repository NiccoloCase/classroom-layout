import gql from "graphql-tag";

/**
 * Invia un feedback
 */
export const sendFeedbackMutation = gql`
    mutation SendFeedback($email: String! $selectedValues: [String!]!, $textField: String){
        sendFeedback(email: $email, selectedValues: $selectedValues, textField: $textField) {
            success
        }
    }
`

