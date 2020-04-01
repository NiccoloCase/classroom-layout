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
  desks: Array<Desk>;
  students: Array<Scalars['String']>;
};

export type Desk = {
   __typename?: 'Desk';
  id: Scalars['ID'];
  x: Scalars['Int'];
  y: Scalars['Int'];
  orientation: Scalars['Int'];
};

export type DeskInput = {
  x: Scalars['Int'];
  y: Scalars['Int'];
  orientation: Scalars['Int'];
};

export type Mutation = {
   __typename?: 'Mutation';
  createClassroom: Classroom;
  editClassroom: Classroom;
  shuffleDesks: Classroom;
};


export type MutationCreateClassroomArgs = {
  email: Scalars['String'];
  name: Scalars['String'];
  desks: Array<DeskInput>;
  students: Array<Scalars['String']>;
};


export type MutationEditClassroomArgs = {
  id: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
  desks?: Maybe<Array<DeskInput>>;
  students?: Maybe<Array<Scalars['String']>>;
};


export type MutationShuffleDesksArgs = {
  classId: Scalars['ID'];
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
    & Pick<Classroom, 'name' | 'email' | 'students'>
    & { desks: Array<(
      { __typename?: 'Desk' }
      & Pick<Desk, 'x' | 'y' | 'orientation'>
    )> }
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
  desks: Array<DeskInput>;
  students: Array<Scalars['String']>;
};


export type CreateClassroomMutation = (
  { __typename?: 'Mutation' }
  & { createClassroom: (
    { __typename?: 'Classroom' }
    & Pick<Classroom, 'id'>
  ) }
);

export type ShuffleDesksMutationVariables = {
  id: Scalars['ID'];
};


export type ShuffleDesksMutation = (
  { __typename?: 'Mutation' }
  & { shuffleDesks: (
    { __typename?: 'Classroom' }
    & Pick<Classroom, 'students'>
  ) }
);

export type EditClassroomMutationVariables = {
  id: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
  desks?: Maybe<Array<DeskInput>>;
  students?: Maybe<Array<Scalars['String']>>;
};


export type EditClassroomMutation = (
  { __typename?: 'Mutation' }
  & { editClassroom: (
    { __typename?: 'Classroom' }
    & Pick<Classroom, 'name' | 'email' | 'students'>
    & { desks: Array<(
      { __typename?: 'Desk' }
      & Pick<Desk, 'x' | 'y' | 'orientation'>
    )> }
  ) }
);


export const GetClassroomByIdDocument = gql`
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
    mutation CreateClassroom($name: String!, $email: String!, $desks: [DeskInput!]!, $students: [String!]!) {
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
export const ShuffleDesksDocument = gql`
    mutation ShuffleDesks($id: ID!) {
  shuffleDesks(classId: $id) {
    students
  }
}
    `;
export type ShuffleDesksMutationFn = ApolloReactCommon.MutationFunction<ShuffleDesksMutation, ShuffleDesksMutationVariables>;
export type ShuffleDesksComponentProps = Omit<ApolloReactComponents.MutationComponentOptions<ShuffleDesksMutation, ShuffleDesksMutationVariables>, 'mutation'>;

    export const ShuffleDesksComponent = (props: ShuffleDesksComponentProps) => (
      <ApolloReactComponents.Mutation<ShuffleDesksMutation, ShuffleDesksMutationVariables> mutation={ShuffleDesksDocument} {...props} />
    );
    

/**
 * __useShuffleDesksMutation__
 *
 * To run a mutation, you first call `useShuffleDesksMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useShuffleDesksMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [shuffleDesksMutation, { data, loading, error }] = useShuffleDesksMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useShuffleDesksMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<ShuffleDesksMutation, ShuffleDesksMutationVariables>) {
        return ApolloReactHooks.useMutation<ShuffleDesksMutation, ShuffleDesksMutationVariables>(ShuffleDesksDocument, baseOptions);
      }
export type ShuffleDesksMutationHookResult = ReturnType<typeof useShuffleDesksMutation>;
export type ShuffleDesksMutationResult = ApolloReactCommon.MutationResult<ShuffleDesksMutation>;
export type ShuffleDesksMutationOptions = ApolloReactCommon.BaseMutationOptions<ShuffleDesksMutation, ShuffleDesksMutationVariables>;
export const EditClassroomDocument = gql`
    mutation EditClassroom($id: ID!, $name: String, $desks: [DeskInput!], $students: [String!]) {
  editClassroom(id: $id, name: $name, desks: $desks, students: $students) {
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
export type EditClassroomMutationFn = ApolloReactCommon.MutationFunction<EditClassroomMutation, EditClassroomMutationVariables>;
export type EditClassroomComponentProps = Omit<ApolloReactComponents.MutationComponentOptions<EditClassroomMutation, EditClassroomMutationVariables>, 'mutation'>;

    export const EditClassroomComponent = (props: EditClassroomComponentProps) => (
      <ApolloReactComponents.Mutation<EditClassroomMutation, EditClassroomMutationVariables> mutation={EditClassroomDocument} {...props} />
    );
    

/**
 * __useEditClassroomMutation__
 *
 * To run a mutation, you first call `useEditClassroomMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useEditClassroomMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [editClassroomMutation, { data, loading, error }] = useEditClassroomMutation({
 *   variables: {
 *      id: // value for 'id'
 *      name: // value for 'name'
 *      desks: // value for 'desks'
 *      students: // value for 'students'
 *   },
 * });
 */
export function useEditClassroomMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<EditClassroomMutation, EditClassroomMutationVariables>) {
        return ApolloReactHooks.useMutation<EditClassroomMutation, EditClassroomMutationVariables>(EditClassroomDocument, baseOptions);
      }
export type EditClassroomMutationHookResult = ReturnType<typeof useEditClassroomMutation>;
export type EditClassroomMutationResult = ApolloReactCommon.MutationResult<EditClassroomMutation>;
export type EditClassroomMutationOptions = ApolloReactCommon.BaseMutationOptions<EditClassroomMutation, EditClassroomMutationVariables>;