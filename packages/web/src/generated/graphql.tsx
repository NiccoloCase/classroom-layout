export type Maybe<T> = T | null;
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

