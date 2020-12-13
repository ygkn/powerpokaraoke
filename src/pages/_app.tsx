import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import { DefaultSeo } from 'next-seo';
import type { AppProps } from 'next/app';
import { VFC } from 'react';

import { useScreenHeight } from '../util/screen-height';
import { UserProvider } from '../util/user';

const firebaseConfig = {
  apiKey: 'AIzaSyAvUkEUbLzjZlmlXOs0aDYZipsCAi_ZKZI',
  authDomain: 'powerpokaraoke.firebaseapp.com',
  projectId: 'powerpokaraoke',
  storageBucket: 'powerpokaraoke.appspot.com',
  messagingSenderId: '659447751310',
  appId: '1:659447751310:web:54908d1b7ead0bb43b9fdf',
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const theme = extendTheme({
  sizes: {
    screen: 'calc(var(--vh, 1vh) * 100);',
    container: '60rem',
  },
  styles: {
    global: () => ({
      'html, body': {
        backgroundColor: 'gray.900',
        color: 'gray.100',
      },
    }),
  },
});

const MyApp: VFC<AppProps> = ({ Component, pageProps }) => {
  useScreenHeight();

  return (
    <ChakraProvider theme={theme}>
      <DefaultSeo title="パワポカラオケ" />
      <UserProvider>
        <Component
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...pageProps}
        />
      </UserProvider>
    </ChakraProvider>
  );
};

export default MyApp;
