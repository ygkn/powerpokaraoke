import {
  Avatar,
  Button,
  Container,
  Flex,
  Heading,
  Spinner,
} from '@chakra-ui/react';
import firebase from 'firebase';
import Router from 'next/router';
import { FC } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';

const login = async (): Promise<void> => {
  await firebase
    .auth()
    .signInWithPopup(new firebase.auth.TwitterAuthProvider());

  Router.push('/');
};

export const Layout: FC = ({ children }) => {
  const [user, loading, error] = useAuthState(firebase.auth());

  return (
    <>
      <Container height="screen" maxWidth="container" centerContent>
        <Flex as="header" p="2" width="full" alignItems="center">
          <Heading as="h1" fontSize="4xl" color="red.500" mr="auto">
            パワポカラオケ
          </Heading>
          {loading && <Spinner />}
          {!loading && user == null && (
            <Button colorScheme="red" onClick={login}>
              ログイン
            </Button>
          )}
          {!loading && user && (
            <Avatar name={user?.displayName} src={user?.photoURL} />
          )}
        </Flex>

        {children}
      </Container>
    </>
  );
};
