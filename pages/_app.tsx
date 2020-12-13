import { ChakraProvider } from '@chakra-ui/react';
import type { AppProps } from 'next/app';
import { VFC } from 'react';

const MyApp: VFC<AppProps> = ({ Component, pageProps }) => {
  return (
    <ChakraProvider>
      <Component
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...pageProps}
      />
    </ChakraProvider>
  );
};

export default MyApp;
