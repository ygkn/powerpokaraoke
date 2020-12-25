import {
  AspectRatio,
  Box,
  Center,
  Grid,
  Image,
  Spinner,
  Text,
} from '@chakra-ui/react';
import firebase from 'firebase/app';
import { VFC } from 'react';
import { useDownloadURL } from 'react-firebase-hooks/storage';

const Item: VFC<{ path: string }> = ({ path }) => {
  const [url, loading, error] = useDownloadURL(firebase.storage().ref(path));

  return (
    <AspectRatio ratio={4 / 3} key={url}>
      {loading ? (
        <Center width="full" height="full">
          <Spinner />
        </Center>
      ) : (
        <Image objectFit="contain" width="full" height="full" src={url} />
      )}
    </AspectRatio>
  );
};

export const SlideList: VFC<{ paths: string[] }> = ({ paths }) => (
  <Box p="2">
    <Text>合計 {paths.length} 枚</Text>
    <Grid templateColumns="repeat(4, 1fr)" gridGap="4">
      {paths.map((path) => (
        <Item key={path} path={path} />
      ))}
    </Grid>
  </Box>
);
