import { Box, Button, Flex, Heading, Text } from '@chakra-ui/react';
import firebase from 'firebase/app';
import Link from 'next/link';
import { VFC } from 'react';
import { useCollectionData } from 'react-firebase-hooks/firestore';

import { Room } from '../util/room';
import { useUser } from '../util/user';

import { NewRoom } from './NewRoom';

export const RoomList: VFC = () => {
  const { user } = useUser();
  const [rooms, isRoomLoading] = useCollectionData<Room & { id: string }>(
    user &&
      firebase.firestore().collection('rooms').where('owner', '==', user.id),
    { idField: 'id' }
  );

  return (
    <Box as="section">
      <Flex>
        <Heading flexGrow={1}>自分のルーム一覧</Heading>
        <NewRoom />
      </Flex>
      {rooms &&
        rooms.map((room) => (
          <Flex as="article" key={room.id}>
            <Text flexGrow={1}>{room.name}</Text>
            <Link href={`/rooms/${room.id}`}>
              <Button as="a" color="ButtonText">
                ルームへ
              </Button>
            </Link>
            <Link href={`/rooms/${room.id}/setting`}>
              <Button as="a" color="ButtonText">
                ルーム設定へ
              </Button>
            </Link>
          </Flex>
        ))}
    </Box>
  );
};
