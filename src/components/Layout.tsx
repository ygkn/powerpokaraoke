import {
  Avatar,
  Button,
  Container,
  Flex,
  Heading,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spinner,
} from '@chakra-ui/react';
import firebase from 'firebase';
import Router from 'next/router';
import { FC } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { FaChevronDown } from 'react-icons/fa';

const login = async (): Promise<void> => {
  await firebase
    .auth()
    .signInWithPopup(new firebase.auth.TwitterAuthProvider());

  Router.push('/');
};

const logout = async (): Promise<void> => {
  await firebase.auth().signOut();

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
            <Menu>
              <MenuButton>
                <Button rightIcon={<FaChevronDown />} variant="ghost">
                  <Avatar
                    name={user?.displayName}
                    src={user?.photoURL}
                    size="sm"
                  />
                </Button>
              </MenuButton>
              <MenuList color="gray.800">
                <MenuItem onClick={logout}>ログアウト</MenuItem>
              </MenuList>
            </Menu>
          )}
        </Flex>

        {children}
      </Container>
    </>
  );
};
