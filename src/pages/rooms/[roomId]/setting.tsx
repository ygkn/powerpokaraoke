import { Box, Button, Center, Flex, Heading, Spinner } from '@chakra-ui/react';
import dayjs from 'dayjs';
import firebase from 'firebase/app';
import { VFC } from 'react';
import { useDocumentData } from 'react-firebase-hooks/firestore';

import { Layout } from '../../../components/Layout';
import { PrivatePage } from '../../../components/PrivatePage';
import { UserAvatar } from '../../../components/User';
import { Room, RoomPrivate } from '../../../util/room';
import { useQueryString } from '../../../util/router';

const RoomSettingPage: VFC = () => {
  const roomId = useQueryString('roomId');
  const roomRef = firebase.firestore().doc(`rooms/${roomId}`);
  const [room] = useDocumentData<Room>(roomRef);
  const [roomPrivate] = useDocumentData<RoomPrivate>(
    firebase.firestore().doc(`rooms_private/${roomId}`)
  );

  const goNextPresenter = async () =>
    firebase.firestore().runTransaction(async (transaction) => {
      const roomDoc = await transaction.get(roomRef);
      const oldRoom = roomDoc.data() as Room;

      const presenterCandidate = oldRoom.participants.filter(
        (userId) => !oldRoom.presentedParticipants.includes(userId)
      );

      if (presenterCandidate.length === 0) {
        alert('次の発表者がいません。');
      }

      const nextPresenter =
        presenterCandidate[
          Math.floor(Math.random() * presenterCandidate.length)
        ];

      const roomPrivateDoc = await transaction.get(
        firebase.firestore().doc(`rooms_private/${roomId}`)
      );
      const oldRoomPrivate = roomPrivateDoc.data() as RoomPrivate;

      const themeCandidate = oldRoomPrivate.themes.filter(
        (userId) => !oldRoom.presentedThemes.includes(userId)
      );

      if (themeCandidate.length === 0) {
        alert('次の発表者がいません。');
      }

      const nextTheme =
        themeCandidate[Math.floor(Math.random() * themeCandidate.length)];

      const newRoom: Room = {
        ...oldRoom,
        presentedParticipants: [
          ...oldRoom.presentedParticipants,
          nextPresenter,
        ],
        presentedThemes: [...oldRoom.presentedThemes, nextTheme],
        endTime: null,
      };
      transaction.update(roomRef, newRoom);
    });
  return (
    <Layout>
      <PrivatePage
        uid={room?.owner}
        renderWhenLoggedIn={() =>
          room === undefined ? (
            <Center flexGrow={1}>
              <Spinner />
            </Center>
          ) : (
            <Box as="section">
              <Heading>{room.name} の設定</Heading>

              <Box as="section" p="4" border={1}>
                <Flex>
                  <Heading fontSize="2xl" flexGrow={1}>
                    参加者
                  </Heading>
                  <Button onClick={goNextPresenter}>次の発表者へ</Button>
                </Flex>
                <Heading fontSize="xl">全ての参加者</Heading>
                <Flex>
                  {room.participants.map((participantId) => (
                    <UserAvatar key={participantId} uid={participantId} />
                  ))}
                </Flex>

                <Heading fontSize="xl">発表した参加者</Heading>
                <Flex>
                  {room.presentedParticipants.map((participantId) => (
                    <UserAvatar key={participantId} uid={participantId} />
                  ))}
                </Flex>
              </Box>
            </Box>
          )
        }
      />
    </Layout>
  );
};

export default RoomSettingPage;
