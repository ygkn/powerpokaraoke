import {
  Box,
  Button,
  ButtonGroup,
  Center,
  Flex,
  Heading,
  IconButton,
  Spinner,
  Tooltip,
  useClipboard,
} from '@chakra-ui/react';
import firebase from 'firebase/app';
import NextLink from 'next/link';
import { VFC } from 'react';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { FaClipboard } from 'react-icons/fa';

import { Layout } from '../../../components/Layout';
import { PrivatePage } from '../../../components/PrivatePage';
import { SlideList } from '../../../components/SlideList';
import { UserAvatar } from '../../../components/UserAvatar';
import { Room, RoomPrivate } from '../../../util/room';
import { useQueryString } from '../../../util/router';

const RoomSettingPage: VFC = () => {
  const roomId = useQueryString('roomId');
  const roomRef = firebase.firestore().doc(`rooms/${roomId}`);
  const [room] = useDocumentData<Room>(roomRef);
  const [roomPrivate] = useDocumentData<RoomPrivate>(
    firebase.firestore().doc(`rooms_private/${roomId}`)
  );

  const { hasCopied: hasCopiedRoomUrl, onCopy: copyRoomUrl } = useClipboard(
    roomId && typeof window !== 'undefined'
      ? `${window.location.origin}/rooms/${roomId}`
      : ''
  );

  const {
    hasCopied: hasCopiedRoomFormUrl,
    onCopy: copyRoomFormUrl,
  } = useClipboard(
    roomId && typeof window !== 'undefined'
      ? `${window.location.origin}/rooms/${roomId}/form`
      : ''
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
        return;
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
          room === undefined || roomPrivate === undefined ? (
            <Center flexGrow={1}>
              <Spinner />
            </Center>
          ) : (
            <>
              <Flex>
                <Heading my="2" flexGrow={1}>
                  {room.name} の設定
                </Heading>
                <ButtonGroup spacing="2" mr="4">
                  <NextLink href={`/rooms/${roomId}`} passHref>
                    <Button as="a">ルームへ</Button>
                  </NextLink>
                  <Tooltip
                    label={
                      hasCopiedRoomUrl ? 'コピーされました' : 'URL をコピー'
                    }
                    isOpen={hasCopiedRoomUrl}
                    closeDelay={1000}
                  >
                    <IconButton
                      onClick={copyRoomUrl}
                      aria-label="URL をコピー"
                      icon={<FaClipboard />}
                    />
                  </Tooltip>
                </ButtonGroup>
                <ButtonGroup spacing="2">
                  <NextLink href={`/rooms/${roomId}/form`} passHref>
                    <Button as="a">フォームへ</Button>
                  </NextLink>
                  <Tooltip
                    label={
                      hasCopiedRoomFormUrl ? 'コピーされました' : 'URL をコピー'
                    }
                    isOpen={hasCopiedRoomFormUrl}
                    closeDelay={1000}
                  >
                    <IconButton
                      onClick={copyRoomFormUrl}
                      aria-label="URL をコピー"
                      icon={<FaClipboard />}
                    />
                  </Tooltip>
                </ButtonGroup>
              </Flex>

              <Box
                as="section"
                p="4"
                border="1px"
                borderStyle="solid"
                borderRadius="md"
                my="2"
              >
                <Flex alignItems="center">
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

              <Flex my="2" flexGrow={1}>
                <Flex
                  as="section"
                  p="4"
                  border="1px"
                  borderStyle="solid"
                  borderRadius="md"
                  flexGrow={1}
                  flexShrink={0}
                  mr="4"
                  flexDir="column"
                  overflowY="scroll"
                >
                  <Flex alignItems="center">
                    <Heading fontSize="2xl" flexGrow={1}>
                      スライド
                    </Heading>
                    <NextLink href={`/rooms/${roomId}/form`} passHref>
                      <Button as="a">追加</Button>
                    </NextLink>
                  </Flex>
                  <SlideList paths={roomPrivate.slideRefs} />
                </Flex>
                <Flex
                  as="section"
                  p="4"
                  border="1px"
                  borderStyle="solid"
                  borderRadius="md"
                  flexGrow={1}
                  flexShrink={0}
                  flexDir="column"
                  overflowY="scroll"
                >
                  <Flex alignItems="center">
                    <Heading fontSize="2xl" flexGrow={1}>
                      テーマ
                    </Heading>
                    <NextLink href={`/rooms/${roomId}/form`} passHref>
                      <Button as="a">追加</Button>
                    </NextLink>
                  </Flex>

                  {roomPrivate.themes.map((theme) => (
                    <Box key={theme}>{theme}</Box>
                  ))}
                </Flex>
              </Flex>
            </>
          )
        }
      />
    </Layout>
  );
};

export default RoomSettingPage;
