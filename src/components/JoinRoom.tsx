import { Button, Flex, Heading, Text } from '@chakra-ui/react';
import firebase from 'firebase/app';
import { useCallback, VFC } from 'react';

import { Room } from '../util/room';
import { useUser } from '../util/user';

export const JoinRoom: VFC<{ room: Room; roomId: string }> = ({
  room,
  roomId,
}) => {
  const { user } = useUser();
  const join = useCallback(
    () =>
      firebase.firestore().runTransaction(async (transaction) => {
        const roomRef = firebase.firestore().doc(`rooms/${roomId}`);

        const roomDoc = await transaction.get(roomRef);
        const oldRoom = roomDoc.data() as Room;

        const newRoom: Room = {
          ...oldRoom,
          participants: [...oldRoom.participants, user.id],
        };
        transaction.update(roomRef, newRoom);
      }),
    [roomId, user]
  );

  return (
    <Flex
      w="xl"
      flexGrow={1}
      flexDirection="column"
      alignItems="stretch"
      textAlign="center"
      mx="auto"
    >
      <Heading>{room.name}</Heading>
      <Text as="p">このルームに入室しますか？</Text>
      <Button colorScheme="red" onClick={join}>
        入室する
      </Button>
    </Flex>
  );
};
