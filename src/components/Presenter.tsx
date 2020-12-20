import { Avatar, Box, Flex, Text } from '@chakra-ui/react';
import firebase from 'firebase/app';
import React, { VFC } from 'react';
import { useDocumentData } from 'react-firebase-hooks/firestore';

import type { User } from '../util/user';

export const Presenter: VFC<{ uid: string; theme?: string }> = ({
  uid,
  theme,
}) => {
  const [user] = useDocumentData<User>(
    firebase.firestore().doc(`users/${uid}`)
  );
  return (
    <Flex>
      <Avatar size="md" name={user?.name} src={user?.photoURL} mr="2" />
      <Box flexGrow={1}>
        <Text as="p" fontWeight="bold">
          {user?.name ?? '???'}
        </Text>
        <Text as="p">{theme ?? '???'}</Text>
      </Box>
    </Flex>
  );
};
