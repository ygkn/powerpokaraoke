import { Avatar, Spinner, Tooltip } from '@chakra-ui/react';
import firebase from 'firebase/app';
import React, { VFC } from 'react';
import { useDocumentData } from 'react-firebase-hooks/firestore';

import type { User } from '../util/user';

export const UserAvatar: VFC<{ uid: string }> = ({ uid }) => {
  const [user] = useDocumentData<User>(
    firebase.firestore().doc(`users/${uid}`)
  );

  if (user === undefined) {
    return <Spinner />;
  }

  return (
    <Tooltip label={user.name}>
      <Avatar name={user.name} src={user.photoURL} />
    </Tooltip>
  );
};
