import {
  Avatar,
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spinner,
} from '@chakra-ui/react';
import firebase from 'firebase/app';
import NextLink from 'next/link';
import Router from 'next/router';
import { FC } from 'react';
import { FaChevronDown } from 'react-icons/fa';

import { useUser } from '../util/user';

const login = async (): Promise<void> => {
  await firebase
    .auth()
    .signInWithPopup(new firebase.auth.TwitterAuthProvider());
};

const logout = async (): Promise<void> => {
  await firebase.auth().signOut();
};

export const Layout: FC = ({ children }) => {
  const userState = useUser();

  return (
    <>
      <Container
        height="screen"
        maxWidth="container"
        display="flex"
        flexDir="column"
      >
        <Flex as="header" p="2" width="full" alignItems="center">
          <Heading as="h1" fontSize="4xl" color="red.500" mr="auto">
            <NextLink href="/" passHref>
              <Link>パワポカラオケ</Link>
            </NextLink>
          </Heading>
          {(userState.state === 'LOADING_AUTH' ||
            userState.state === 'LOADING_DB') && <Spinner />}
          {userState.state === 'UNAUTHORIZED' && (
            <Button colorScheme="red" onClick={login}>
              ログイン
            </Button>
          )}
          {(userState.state === 'LOADED' ||
            userState.state === 'LOADING_DB') && (
            <Menu>
              <MenuButton
                as={Button}
                rightIcon={<FaChevronDown />}
                variant="ghost"
                _hover={{ bg: 'gray.500' }}
              >
                {userState.state === 'LOADED' && (
                  <Avatar
                    name={userState.user.name}
                    src={userState.user.photoURL}
                    size="sm"
                  />
                )}
                {userState.state === 'LOADING_DB' && <Spinner size="sm" />}
              </MenuButton>
              <MenuList>
                <MenuItem onClick={logout}>ログアウト</MenuItem>
              </MenuList>
            </Menu>
          )}
        </Flex>
        <Box as="main" display="flex" flexDir="column" flexGrow={1} px="4">
          {children}
        </Box>
      </Container>
    </>
  );
};
