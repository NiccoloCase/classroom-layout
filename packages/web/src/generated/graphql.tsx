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

export type GetClassroomByIdQueryQueryVariables = {
  id: Scalars['ID'];
};


export type GetClassroomByIdQueryQuery = (
  { __typename?: 'Query' }
  & { getClassroomById: (
    { __typename?: 'Classroom' }
    & Pick<Classroom, 'name' | 'students' | 'desks'>
  ) }
);

export type CreateClassroomMutationMutationVariables = {
  name: Scalars['String'];
  email: Scalars['String'];
  desks: Scalars['String'];
  students: Array<Scalars['String']>;
};


export type CreateClassroomMutationMutation = (
  { __typename?: 'Mutation' }
  & { createClassroom: (
    { __typename?: 'Classroom' }
    & Pick<Classroom, 'id'>
  ) }
);


export const GetClassroomByIdQueryDocument = gql`
    query GetClassroomByIdQuery($id: ID!) {
  getClassroomById(id: $id) {
    name
    students
    desks
  }
}
    `;
export type GetClassroomByIdQueryComponentProps = Omit<ApolloReactComponents.QueryComponentOptions<GetClassroomByIdQueryQuery, GetClassroomByIdQueryQueryVariables>, 'query'> & ({ variables: GetClassroomByIdQueryQueryVariables; skip?: boolean; } | { skip: boolean; });

    export const GetClassroomByIdQueryComponent = (props: GetClassroomByIdQueryComponentProps) => (
      <ApolloReactComponents.Query<GetClassroomByIdQueryQuery, GetClassroomByIdQueryQueryVariables> query={GetClassroomByIdQueryDocument} {...props} />
    );
    

/**
 * __useGetClassroomByIdQueryQuery__
 *
 * To run a query within a React component, call `useGetClassroomByIdQueryQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetClassroomByIdQueryQuery` returns an object from Apollo Client that contains loading, error, and data properties 
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetClassroomByIdQueryQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetClassroomByIdQueryQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<GetClassroomByIdQueryQuery, GetClassroomByIdQueryQueryVariables>) {
        return ApolloReactHooks.useQuery<GetClassroomByIdQueryQuery, GetClassroomByIdQueryQueryVariables>(GetClassroomByIdQueryDocument, baseOptions);
      }
export function useGetClassroomByIdQueryLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetClassroomByIdQueryQuery, GetClassroomByIdQueryQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<GetClassroomByIdQueryQuery, GetClassroomByIdQueryQueryVariables>(GetClassroomByIdQueryDocument, baseOptions);
        }
export type GetClassroomByIdQueryQueryHookResult = ReturnType<typeof useGetClassroomByIdQueryQuery>;
export type GetClassroomByIdQueryLazyQueryHookResult = ReturnType<typeof useGetClassroomByIdQueryLazyQuery>;
export type GetClassroomByIdQueryQueryResult = ApolloReactCommon.QueryResult<GetClassroomByIdQueryQuery, GetClassroomByIdQueryQueryVariables>;
export const CreateClassroomMutationDocument = gql`
    mutation CreateClassroomMutation($name: String!, $email: String!, $desks: String!, $students: [String!]!) {
  createClassroom(name: $name, email: $email, desks: $desks, students: $students) {
    id
  }
}
    `;
export type CreateClassroomMutationMutationFn = ApolloReactCommon.MutationFunction<CreateClassroomMutationMutation, CreateClassroomMutationMutationVariables>;
export type CreateClassroomMutationComponentProps = Omit<ApolloReactComponents.MutationComponentOptions<CreateClassroomMutationMutation, CreateClassroomMutationMutationVariables>, 'mutation'>;

    export const CreateClassroomMutationComponent = (props: CreateClassroomMutationComponentProps) => (
      <ApolloReactComponents.Mutation<CreateClassroomMutationMutation, CreateClassroomMutationMutationVariables> mutation={CreateClassroomMutationDocument} {...props} />
    );
    

/**
 * __useCreateClassroomMutationMutation__
 *
 * To run a mutation, you first call `useCreateClassroomMutationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateClassroomMutationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createClassroomMutationMutation, { data, loading, error }] = useCreateClassroomMutationMutation({
 *   variables: {
 *      name: // value for 'name'
 *      email: // value for 'email'
 *      desks: // value for 'desks'
 *      students: // value for 'students'
 *   },
 * });
 */
export function useCreateClassroomMutationMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreateClassroomMutationMutation, CreateClassroomMutationMutationVariables>) {
        return ApolloReactHooks.useMutation<CreateClassroomMutationMutation, CreateClassroomMutationMutationVariables>(CreateClassroomMutationDocument, baseOptions);
      }
export type CreateClassroomMutationMutationHookResult = ReturnType<typeof useCreateClassroomMutationMutation>;
export type CreateClassroomMutationMutationResult = ApolloReactCommon.MutationResult<CreateClassroomMutationMutation>;
export type CreateClassroomMutationMutationOptions = ApolloReactCommon.BaseMutationOptions<CreateClassroomMutationMutation, CreateClassroomMutationMutationVariables>;