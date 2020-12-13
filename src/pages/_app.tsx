import { ChakraProvider } from '@chakra-ui/react';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import { DefaultSeo } from 'next-seo';
import type { AppProps } from 'next/app';
import { VFC } from 'react';

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

const MyApp: VFC<AppProps> = ({ Component, pageProps }) => {
  return (
    <ChakraProvider>
      <DefaultSeo title="パワポカラオケ" />
      <Component
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...pageProps}
      />
    </ChakraProvider>
  );
};

export default MyApp;
