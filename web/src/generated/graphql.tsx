import gql from 'graphql-tag';
import * as Urql from 'urql';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type FieldError = {
  __typename?: 'FieldError';
  field: Scalars['String'];
  message: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  addUser: Scalars['Boolean'];
  createRoom: Room;
  updateRoom?: Maybe<Room>;
  deleteRoom: Scalars['Boolean'];
  updateTrack: RoomSound;
  concat: Scalars['Boolean'];
  changePassword: UserResponse;
  forgotPassword: Scalars['Boolean'];
  register: UserResponse;
  login: UserResponse;
  logout: Scalars['Boolean'];
  setLocation: Scalars['Boolean'];
  createSound: Sound;
};


export type MutationAddUserArgs = {
  usernameOrEmail: Scalars['String'];
  roomId: Scalars['Int'];
};


export type MutationCreateRoomArgs = {
  input: Scalars['String'];
};


export type MutationUpdateRoomArgs = {
  name: Scalars['String'];
  id: Scalars['Float'];
};


export type MutationDeleteRoomArgs = {
  id: Scalars['Float'];
};


export type MutationUpdateTrackArgs = {
  track: Array<Scalars['String']>;
  trackId: Scalars['Int'];
  roomId: Scalars['Int'];
};


export type MutationConcatArgs = {
  roomId: Scalars['Int'];
};


export type MutationChangePasswordArgs = {
  newPassword: Scalars['String'];
  token: Scalars['String'];
};


export type MutationForgotPasswordArgs = {
  email: Scalars['String'];
};


export type MutationRegisterArgs = {
  options: UsernamePasswordInput;
};


export type MutationLoginArgs = {
  password: Scalars['String'];
  usernameOrEmail: Scalars['String'];
};


export type MutationSetLocationArgs = {
  location: Scalars['String'];
};


export type MutationCreateSoundArgs = {
  input: Scalars['String'];
};

export type PaginatedRooms = {
  __typename?: 'PaginatedRooms';
  rooms: Array<Room>;
  hasMore: Scalars['Boolean'];
};

export type Query = {
  __typename?: 'Query';
  hello: Scalars['String'];
  rooms: PaginatedRooms;
  room?: Maybe<Room>;
  me?: Maybe<User>;
  sounds: SoundsLength;
};


export type QueryRoomsArgs = {
  cursor?: Maybe<Scalars['String']>;
  limit: Scalars['Int'];
};


export type QueryRoomArgs = {
  id: Scalars['Int'];
};

export type Room = {
  __typename?: 'Room';
  id: Scalars['Float'];
  name: Scalars['String'];
  creatorId: Scalars['Float'];
  userRooms: Array<UserRoom>;
  roomSounds: Array<RoomSound>;
  creator: User;
  createdAt: Scalars['String'];
  updatedAt: Scalars['String'];
  nameSnippet: Scalars['String'];
};

export type RoomSound = {
  __typename?: 'RoomSound';
  roomId: Scalars['Int'];
  room: Room;
  track: Array<Scalars['String']>;
  trackId: Scalars['Float'];
};

export type Sound = {
  __typename?: 'Sound';
  id: Scalars['Int'];
  path: Scalars['String'];
  creatorId: Scalars['Int'];
  creator: User;
  createdAt: Scalars['String'];
  updatedAt: Scalars['String'];
};

export type Subscription = {
  __typename?: 'Subscription';
  roomChanges: Room;
  userChanges: User;
};

export type User = {
  __typename?: 'User';
  id: Scalars['Int'];
  email: Scalars['String'];
  username: Scalars['String'];
  location?: Maybe<Scalars['String']>;
  createdAt: Scalars['String'];
  updatedAt: Scalars['String'];
};

export type UserResponse = {
  __typename?: 'UserResponse';
  errors?: Maybe<Array<FieldError>>;
  user?: Maybe<User>;
};

export type UserRoom = {
  __typename?: 'UserRoom';
  userId: Scalars['Int'];
  user: User;
  roomId: Scalars['Int'];
  room: Room;
};

export type UsernamePasswordInput = {
  username: Scalars['String'];
  email: Scalars['String'];
  password: Scalars['String'];
};

export type SoundsLength = {
  __typename?: 'soundsLength';
  sounds: Array<Sound>;
  length: Scalars['Float'];
};

export type RegularErrorFragment = (
  { __typename?: 'FieldError' }
  & Pick<FieldError, 'field' | 'message'>
);

export type RegularUserFragment = (
  { __typename?: 'User' }
  & Pick<User, 'id' | 'username' | 'location' | 'email'>
);

export type RegularUserResponseFragment = (
  { __typename?: 'UserResponse' }
  & { errors?: Maybe<Array<(
    { __typename?: 'FieldError' }
    & RegularErrorFragment
  )>>, user?: Maybe<(
    { __typename?: 'User' }
    & RegularUserFragment
  )> }
);

export type RoomSnippetFragment = (
  { __typename?: 'Room' }
  & Pick<Room, 'id' | 'nameSnippet' | 'createdAt' | 'updatedAt'>
  & { creator: (
    { __typename?: 'User' }
    & Pick<User, 'id' | 'username'>
  ) }
);

export type AddUserMutationVariables = Exact<{
  usernameOrEmail: Scalars['String'];
  roomId: Scalars['Int'];
}>;


export type AddUserMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'addUser'>
);

export type ChangePasswordMutationVariables = Exact<{
  token: Scalars['String'];
  newPassword: Scalars['String'];
}>;


export type ChangePasswordMutation = (
  { __typename?: 'Mutation' }
  & { changePassword: (
    { __typename?: 'UserResponse' }
    & RegularUserResponseFragment
  ) }
);

export type ConcatMutationVariables = Exact<{
  roomId: Scalars['Int'];
}>;


export type ConcatMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'concat'>
);

export type CreateRoomMutationVariables = Exact<{
  input: Scalars['String'];
}>;


export type CreateRoomMutation = (
  { __typename?: 'Mutation' }
  & { createRoom: (
    { __typename?: 'Room' }
    & Pick<Room, 'id' | 'name' | 'creatorId' | 'createdAt' | 'updatedAt'>
  ) }
);

export type CreateSoundMutationVariables = Exact<{
  input: Scalars['String'];
}>;


export type CreateSoundMutation = (
  { __typename?: 'Mutation' }
  & { createSound: (
    { __typename?: 'Sound' }
    & Pick<Sound, 'path' | 'id'>
  ) }
);

export type ForgotPasswordMutationVariables = Exact<{
  email: Scalars['String'];
}>;


export type ForgotPasswordMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'forgotPassword'>
);

export type LoginMutationVariables = Exact<{
  usernameOrEmail: Scalars['String'];
  password: Scalars['String'];
}>;


export type LoginMutation = (
  { __typename?: 'Mutation' }
  & { login: (
    { __typename?: 'UserResponse' }
    & RegularUserResponseFragment
  ) }
);

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'logout'>
);

export type RegisterMutationVariables = Exact<{
  options: UsernamePasswordInput;
}>;


export type RegisterMutation = (
  { __typename?: 'Mutation' }
  & { register: (
    { __typename?: 'UserResponse' }
    & RegularUserResponseFragment
  ) }
);

export type SetLocationMutationVariables = Exact<{
  location: Scalars['String'];
}>;


export type SetLocationMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'setLocation'>
);

export type UpdateTrackMutationVariables = Exact<{
  roomId: Scalars['Int'];
  trackId: Scalars['Int'];
  track: Array<Scalars['String']> | Scalars['String'];
}>;


export type UpdateTrackMutation = (
  { __typename?: 'Mutation' }
  & { updateTrack: (
    { __typename?: 'RoomSound' }
    & Pick<RoomSound, 'roomId' | 'track' | 'trackId'>
  ) }
);

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = (
  { __typename?: 'Query' }
  & { me?: Maybe<(
    { __typename?: 'User' }
    & RegularUserFragment
  )> }
);

export type RoomQueryVariables = Exact<{
  id: Scalars['Int'];
}>;


export type RoomQuery = (
  { __typename?: 'Query' }
  & { room?: Maybe<(
    { __typename?: 'Room' }
    & Pick<Room, 'name'>
    & { userRooms: Array<(
      { __typename?: 'UserRoom' }
      & Pick<UserRoom, 'userId'>
      & { user: (
        { __typename?: 'User' }
        & Pick<User, 'username' | 'location' | 'id'>
      ) }
    )>, roomSounds: Array<(
      { __typename?: 'RoomSound' }
      & Pick<RoomSound, 'roomId' | 'track' | 'trackId'>
    )> }
    & RoomSnippetFragment
  )> }
);

export type RoomsQueryVariables = Exact<{
  limit: Scalars['Int'];
  cursor?: Maybe<Scalars['String']>;
}>;


export type RoomsQuery = (
  { __typename?: 'Query' }
  & { rooms: (
    { __typename?: 'PaginatedRooms' }
    & Pick<PaginatedRooms, 'hasMore'>
    & { rooms: Array<(
      { __typename?: 'Room' }
      & Pick<Room, 'name'>
      & { userRooms: Array<(
        { __typename?: 'UserRoom' }
        & Pick<UserRoom, 'userId'>
        & { user: (
          { __typename?: 'User' }
          & Pick<User, 'username' | 'id'>
        ) }
      )> }
      & RoomSnippetFragment
    )> }
  ) }
);

export type SoundsQueryVariables = Exact<{ [key: string]: never; }>;


export type SoundsQuery = (
  { __typename?: 'Query' }
  & { sounds: (
    { __typename?: 'soundsLength' }
    & Pick<SoundsLength, 'length'>
    & { sounds: Array<(
      { __typename?: 'Sound' }
      & Pick<Sound, 'id' | 'path'>
    )> }
  ) }
);

export type RoomChangesSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type RoomChangesSubscription = (
  { __typename?: 'Subscription' }
  & { roomChanges: (
    { __typename?: 'Room' }
    & Pick<Room, 'name'>
    & { userRooms: Array<(
      { __typename?: 'UserRoom' }
      & Pick<UserRoom, 'userId'>
      & { user: (
        { __typename?: 'User' }
        & Pick<User, 'username' | 'location' | 'id'>
      ) }
    )>, roomSounds: Array<(
      { __typename?: 'RoomSound' }
      & Pick<RoomSound, 'roomId' | 'track' | 'trackId'>
    )> }
    & RoomSnippetFragment
  ) }
);

export type UserChangesSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type UserChangesSubscription = (
  { __typename?: 'Subscription' }
  & { userChanges: (
    { __typename?: 'User' }
    & Pick<User, 'id' | 'username' | 'location'>
  ) }
);

export const RegularErrorFragmentDoc = gql`
    fragment RegularError on FieldError {
  field
  message
}
    `;
export const RegularUserFragmentDoc = gql`
    fragment RegularUser on User {
  id
  username
  location
  email
}
    `;
export const RegularUserResponseFragmentDoc = gql`
    fragment RegularUserResponse on UserResponse {
  errors {
    ...RegularError
  }
  user {
    ...RegularUser
  }
}
    ${RegularErrorFragmentDoc}
${RegularUserFragmentDoc}`;
export const RoomSnippetFragmentDoc = gql`
    fragment RoomSnippet on Room {
  id
  nameSnippet
  createdAt
  updatedAt
  creator {
    id
    username
  }
}
    `;
export const AddUserDocument = gql`
    mutation AddUser($usernameOrEmail: String!, $roomId: Int!) {
  addUser(usernameOrEmail: $usernameOrEmail, roomId: $roomId)
}
    `;

export function useAddUserMutation() {
  return Urql.useMutation<AddUserMutation, AddUserMutationVariables>(AddUserDocument);
};
export const ChangePasswordDocument = gql`
    mutation ChangePassword($token: String!, $newPassword: String!) {
  changePassword(token: $token, newPassword: $newPassword) {
    ...RegularUserResponse
  }
}
    ${RegularUserResponseFragmentDoc}`;

export function useChangePasswordMutation() {
  return Urql.useMutation<ChangePasswordMutation, ChangePasswordMutationVariables>(ChangePasswordDocument);
};
export const ConcatDocument = gql`
    mutation Concat($roomId: Int!) {
  concat(roomId: $roomId)
}
    `;

export function useConcatMutation() {
  return Urql.useMutation<ConcatMutation, ConcatMutationVariables>(ConcatDocument);
};
export const CreateRoomDocument = gql`
    mutation CreateRoom($input: String!) {
  createRoom(input: $input) {
    id
    name
    creatorId
    createdAt
    updatedAt
  }
}
    `;

export function useCreateRoomMutation() {
  return Urql.useMutation<CreateRoomMutation, CreateRoomMutationVariables>(CreateRoomDocument);
};
export const CreateSoundDocument = gql`
    mutation CreateSound($input: String!) {
  createSound(input: $input) {
    path
    id
  }
}
    `;

export function useCreateSoundMutation() {
  return Urql.useMutation<CreateSoundMutation, CreateSoundMutationVariables>(CreateSoundDocument);
};
export const ForgotPasswordDocument = gql`
    mutation ForgotPassword($email: String!) {
  forgotPassword(email: $email)
}
    `;

export function useForgotPasswordMutation() {
  return Urql.useMutation<ForgotPasswordMutation, ForgotPasswordMutationVariables>(ForgotPasswordDocument);
};
export const LoginDocument = gql`
    mutation Login($usernameOrEmail: String!, $password: String!) {
  login(usernameOrEmail: $usernameOrEmail, password: $password) {
    ...RegularUserResponse
  }
}
    ${RegularUserResponseFragmentDoc}`;

export function useLoginMutation() {
  return Urql.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument);
};
export const LogoutDocument = gql`
    mutation Logout {
  logout
}
    `;

export function useLogoutMutation() {
  return Urql.useMutation<LogoutMutation, LogoutMutationVariables>(LogoutDocument);
};
export const RegisterDocument = gql`
    mutation Register($options: UsernamePasswordInput!) {
  register(options: $options) {
    ...RegularUserResponse
  }
}
    ${RegularUserResponseFragmentDoc}`;

export function useRegisterMutation() {
  return Urql.useMutation<RegisterMutation, RegisterMutationVariables>(RegisterDocument);
};
export const SetLocationDocument = gql`
    mutation SetLocation($location: String!) {
  setLocation(location: $location)
}
    `;

export function useSetLocationMutation() {
  return Urql.useMutation<SetLocationMutation, SetLocationMutationVariables>(SetLocationDocument);
};
export const UpdateTrackDocument = gql`
    mutation UpdateTrack($roomId: Int!, $trackId: Int!, $track: [String!]!) {
  updateTrack(roomId: $roomId, trackId: $trackId, track: $track) {
    roomId
    track
    trackId
  }
}
    `;

export function useUpdateTrackMutation() {
  return Urql.useMutation<UpdateTrackMutation, UpdateTrackMutationVariables>(UpdateTrackDocument);
};
export const MeDocument = gql`
    query Me {
  me {
    ...RegularUser
  }
}
    ${RegularUserFragmentDoc}`;

export function useMeQuery(options: Omit<Urql.UseQueryArgs<MeQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<MeQuery>({ query: MeDocument, ...options });
};
export const RoomDocument = gql`
    query Room($id: Int!) {
  room(id: $id) {
    ...RoomSnippet
    name
    userRooms {
      userId
      user {
        username
        location
        id
      }
    }
    roomSounds {
      roomId
      track
      trackId
    }
  }
}
    ${RoomSnippetFragmentDoc}`;

export function useRoomQuery(options: Omit<Urql.UseQueryArgs<RoomQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<RoomQuery>({ query: RoomDocument, ...options });
};
export const RoomsDocument = gql`
    query Rooms($limit: Int!, $cursor: String) {
  rooms(limit: $limit, cursor: $cursor) {
    hasMore
    rooms {
      ...RoomSnippet
      name
      userRooms {
        userId
        user {
          username
          id
        }
      }
    }
  }
}
    ${RoomSnippetFragmentDoc}`;

export function useRoomsQuery(options: Omit<Urql.UseQueryArgs<RoomsQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<RoomsQuery>({ query: RoomsDocument, ...options });
};
export const SoundsDocument = gql`
    query Sounds {
  sounds {
    sounds {
      id
      path
    }
    length
  }
}
    `;

export function useSoundsQuery(options: Omit<Urql.UseQueryArgs<SoundsQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<SoundsQuery>({ query: SoundsDocument, ...options });
};
export const RoomChangesDocument = gql`
    subscription RoomChanges {
  roomChanges {
    ...RoomSnippet
    name
    userRooms {
      userId
      user {
        username
        location
        id
      }
    }
    roomSounds {
      roomId
      track
      trackId
    }
  }
}
    ${RoomSnippetFragmentDoc}`;

export function useRoomChangesSubscription<TData = RoomChangesSubscription>(options: Omit<Urql.UseSubscriptionArgs<RoomChangesSubscriptionVariables>, 'query'> = {}, handler?: Urql.SubscriptionHandler<RoomChangesSubscription, TData>) {
  return Urql.useSubscription<RoomChangesSubscription, TData, RoomChangesSubscriptionVariables>({ query: RoomChangesDocument, ...options }, handler);
};
export const UserChangesDocument = gql`
    subscription UserChanges {
  userChanges {
    id
    username
    location
  }
}
    `;

export function useUserChangesSubscription<TData = UserChangesSubscription>(options: Omit<Urql.UseSubscriptionArgs<UserChangesSubscriptionVariables>, 'query'> = {}, handler?: Urql.SubscriptionHandler<UserChangesSubscription, TData>) {
  return Urql.useSubscription<UserChangesSubscription, TData, UserChangesSubscriptionVariables>({ query: UserChangesDocument, ...options }, handler);
};