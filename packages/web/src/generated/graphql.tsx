import gql from 'graphql-tag';
import * as React from 'react';
import * as ApolloReactCommon from '@apollo/react-common';
import * as ApolloReactComponents from '@apollo/react-components';
import * as ApolloReactHooks from '@apollo/react-hooks';
export type Maybe<T> = T | null;
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Classroom = {
   __typename?: 'Classroom';
  id: Scalars['ID'];
  email: Scalars['String'];
  name: Scalars['String'];
  desks: Scalars['String'];
  students: Array<Scalars['String']>;
};

export type Mutation = {
   __typename?: 'Mutation';
  createClassroom: Classroom;
  editClassroom: Classroom;
};


export type MutationCreateClassroomArgs = {
  email: Scalars['String'];
  name: Scalars['String'];
  desks: Scalars['String'];
  students: Array<Scalars['String']>;
};


export type MutationEditClassroomArgs = {
  id: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
  desks?: Maybe<Scalars['String']>;
  students?: Maybe<Array<Scalars['String']>>;
};

export type Query = {
   __typename?: 'Query';
  getClassroomById: Classroom;
  getClassroomByEmail: Classroom;
  isEmailAlreadyUsed: Scalars['Boolean'];
};


export type QueryGetClassroomByIdArgs = {
  id: Scalars['ID'];
};


export type QueryGetClassroomByEmailArgs = {
  email: Scalars['String'];
};


export type QueryIsEmailAlreadyUsedArgs = {
  email: Scalars['String'];
};

export type GetClassroomByIdQueryVariables = {
  id: Scalars['ID'];
};


export type GetClassroomByIdQuery = (
  { __typename?: 'Query' }
  & { getClassroomById: (
    { __typename?: 'Classroom' }
    & Pick<Classroom, 'name' | 'students' | 'desks'>
  ) }
);

export type IsEmailAlreadyUsedQueryVariables = {
  email: Scalars['String'];
};


export type IsEmailAlreadyUsedQuery = (
  { __typename?: 'Query' }
  & Pick<Query, 'isEmailAlreadyUsed'>
);

export type CreateClassroomMutationVariables = {
  name: Scalars['String'];
  email: Scalars['String'];
  desks: Scalars['String'];
  students: Array<Scalars['String']>;
};


export type CreateClassroomMutation = (
  { __typename?: 'Mutation' }
  & { createClassroom: (
    { __typename?: 'Classroom' }
    & Pick<Classroom, 'id'>
  ) }
);


export const GetClassroomByIdDocument = gql`
    query GetClassroomById($id: ID!) {
  getClassroomById(id: $id) {
    name
    students
    desks
  }
}
    `;
export type GetClassroomByIdComponentProps = Omit<ApolloReactComponents.QueryComponentOptions<GetClassroomByIdQuery, GetClassroomByIdQueryVariables>, 'query'> & ({ variables: GetClassroomByIdQueryVariables; skip?: boolean; } | { skip: boolean; });

    export const GetClassroomByIdComponent = (props: GetClassroomByIdComponentProps) => (
      <ApolloReactComponents.Query<GetClassroomByIdQuery, GetClassroomByIdQueryVariables> query={GetClassroomByIdDocument} {...props} />
    );
    

/**
 * __useGetClassroomByIdQuery__
 *
 * To run a query within a React component, call `useGetClassroomByIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetClassroomByIdQuery` returns an object from Apollo Client that contains loading, error, and data properties 
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetClassroomByIdQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetClassroomByIdQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<GetClassroomByIdQuery, GetClassroomByIdQueryVariables>) {
        return ApolloReactHooks.useQuery<GetClassroomByIdQuery, GetClassroomByIdQueryVariables>(GetClassroomByIdDocument, baseOptions);
      }
export function useGetClassroomByIdLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetClassroomByIdQuery, GetClassroomByIdQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<GetClassroomByIdQuery, GetClassroomByIdQueryVariables>(GetClassroomByIdDocument, baseOptions);
        }
export type GetClassroomByIdQueryHookResult = ReturnType<typeof useGetClassroomByIdQuery>;
export type GetClassroomByIdLazyQueryHookResult = ReturnType<typeof useGetClassroomByIdLazyQuery>;
export type GetClassroomByIdQueryResult = ApolloReactCommon.QueryResult<GetClassroomByIdQuery, GetClassroomByIdQueryVariables>;
export const IsEmailAlreadyUsedDocument = gql`
    query isEmailAlreadyUsed($email: String!) {
  isEmailAlreadyUsed(email: $email)
}
    `;
export type IsEmailAlreadyUsedComponentProps = Omit<ApolloReactComponents.QueryComponentOptions<IsEmailAlreadyUsedQuery, IsEmailAlreadyUsedQueryVariables>, 'query'> & ({ variables: IsEmailAlreadyUsedQueryVariables; skip?: boolean; } | { skip: boolean; });

    export const IsEmailAlreadyUsedComponent = (props: IsEmailAlreadyUsedComponentProps) => (
      <ApolloReactComponents.Query<IsEmailAlreadyUsedQuery, IsEmailAlreadyUsedQueryVariables> query={IsEmailAlreadyUsedDocument} {...props} />
    );
    

/**
 * __useIsEmailAlreadyUsedQuery__
 *
 * To run a query within a React component, call `useIsEmailAlreadyUsedQuery` and pass it any options that fit your needs.
 * When your component renders, `useIsEmailAlreadyUsedQuery` returns an object from Apollo Client that contains loading, error, and data properties 
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useIsEmailAlreadyUsedQuery({
 *   variables: {
 *      email: // value for 'email'
 *   },
 * });
 */
export function useIsEmailAlreadyUsedQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<IsEmailAlreadyUsedQuery, IsEmailAlreadyUsedQueryVariables>) {
        return ApolloReactHooks.useQuery<IsEmailAlreadyUsedQuery, IsEmailAlreadyUsedQueryVariables>(IsEmailAlreadyUsedDocument, baseOptions);
      }
export function useIsEmailAlreadyUsedLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<IsEmailAlreadyUsedQuery, IsEmailAlreadyUsedQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<IsEmailAlreadyUsedQuery, IsEmailAlreadyUsedQueryVariables>(IsEmailAlreadyUsedDocument, baseOptions);
        }
export type IsEmailAlreadyUsedQueryHookResult = ReturnType<typeof useIsEmailAlreadyUsedQuery>;
export type IsEmailAlreadyUsedLazyQueryHookResult = ReturnType<typeof useIsEmailAlreadyUsedLazyQuery>;
export type IsEmailAlreadyUsedQueryResult = ApolloReactCommon.QueryResult<IsEmailAlreadyUsedQuery, IsEmailAlreadyUsedQueryVariables>;
export const CreateClassroomDocument = gql`
    mutation CreateClassroom($name: String!, $email: String!, $desks: String!, $students: [String!]!) {
  createClassroom(name: $name, email: $email, desks: $desks, students: $students) {
    id
  }
}
    `;
export type CreateClassroomMutationFn = ApolloReactCommon.MutationFunction<CreateClassroomMutation, CreateClassroomMutationVariables>;
export type CreateClassroomComponentProps = Omit<ApolloReactComponents.MutationComponentOptions<CreateClassroomMutation, CreateClassroomMutationVariables>, 'mutation'>;

    export const CreateClassroomComponent = (props: CreateClassroomComponentProps) => (
      <ApolloReactComponents.Mutation<CreateClassroomMutation, CreateClassroomMutationVariables> mutation={CreateClassroomDocument} {...props} />
    );
    

/**
 * __useCreateClassroomMutation__
 *
 * To run a mutation, you first call `useCreateClassroomMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateClassroomMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createClassroomMutation, { data, loading, error }] = useCreateClassroomMutation({
 *   variables: {
 *      name: // value for 'name'
 *      email: // value for 'email'
 *      desks: // value for 'desks'
 *      students: // value for 'students'
 *   },
 * });
 */
export function useCreateClassroomMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreateClassroomMutation, CreateClassroomMutationVariables>) {
        return ApolloReactHooks.useMutation<CreateClassroomMutation, CreateClassroomMutationVariables>(CreateClassroomDocument, baseOptions);
      }
export type CreateClassroomMutationHookResult = ReturnType<typeof useCreateClassroomMutation>;
export type CreateClassroomMutationResult = ApolloReactCommon.MutationResult<CreateClassroomMutation>;
export type CreateClassroomMutationOptions = ApolloReactCommon.BaseMutationOptions<CreateClassroomMutation, CreateClassroomMutationVariables>;