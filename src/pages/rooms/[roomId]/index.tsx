import {
  Box,
  Button,
  Center,
  Flex,
  Heading,
  Image,
  Spinner,
  Text,
} from '@chakra-ui/react';
import dayjs from 'dayjs';
import firebase from 'firebase/app';
import Link from 'next/link';
import { useEffect, useRef, useState, VFC } from 'react';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { FaCog } from 'react-icons/fa';

import { JoinRoom } from '../../../components/JoinRoom';
import { Layout } from '../../../components/Layout';
import { PrivatePage } from '../../../components/PrivatePage';
import { UserAvatar } from '../../../components/User';
import { Room, RoomPrivate } from '../../../util/room';
import { useQueryString } from '../../../util/router';
import { useUser } from '../../../util/user';

const last = <T extends any>(array: T[]): T | undefined =>
  array.length !== 0 ? array[array.length - 1] : undefined;

const RoomPage: VFC = () => {
  const { user } = useUser();
  const roomId = useQueryString('roomId');
  const [room] = useDocumentData<Room>(
    firebase.firestore().doc(`rooms/${roomId}`)
  );
  const [roomPrivate] = useDocumentData<RoomPrivate>(
    firebase.firestore().doc(`rooms_private/${roomId}`)
  );

  const [restTime, setRestTime] = useState<string | undefined>();

  const [slideUrl, setSlideUrl] = useState<string | undefined>();

  const slideUrlMapRef = useRef<Map<string, string>>(new Map());

  useEffect(() => {
    roomPrivate?.slideRefs.forEach(async (slideRef: string) => {
      const url = await firebase.storage().ref(slideRef).getDownloadURL();

      slideUrlMapRef.current.set(slideRef, url);

      const cacheImg = new window.Image();
      cacheImg.src = url;
    });
  }, [roomPrivate?.slideRefs]);

  useEffect(() => {
    const slidePath = room?.showedSlideRefs && last(room?.showedSlideRefs);
    const newSlideUrl = slideUrlMapRef.current.get(slidePath);
    setSlideUrl(newSlideUrl);
    if (newSlideUrl === undefined && slidePath !== undefined) {
      firebase
        .storage()
        .ref(slidePath)
        .getDownloadURL()
        .then((url) => {
          setSlideUrl(url);
          slideUrlMapRef.current.set(slidePath, url);
        });
    }
  }, [room?.showedSlideRefs]);

  useEffect(() => {
    if (room?.endTime == null) {
      if (restTime !== undefined) {
        setRestTime(undefined);
      }
      return;
    }

    const endTime = room.endTime.toMillis();

    const getCountDownStr = (): string => {
      const now = dayjs();

      if (now.isAfter(endTime)) {
        return '00:00';
      }

      return dayjs(endTime - now.valueOf())
        .subtract(dayjs().utcOffset(), 'minute')
        .format('mm:ss');
    };

    const countDownStr = getCountDownStr();

    setRestTime(countDownStr);

    if (countDownStr === '00:00') {
      return;
    }

    const intervalId = setInterval(() => {
      const newCountDownStr = getCountDownStr();

      setRestTime(newCountDownStr);

      if (newCountDownStr === '00:00') {
        clearInterval(intervalId);
      }
    }, 1000);

    // eslint-disable-next-line consistent-return
    return () => {
      clearInterval(intervalId);
    };
  }, [restTime, room?.endTime]);

  const goNextSlide = async () => {
    if (
      last(room.presentedParticipants) !== user.id ||
      (room.endTime !== null && dayjs().isAfter(room.endTime.toMillis()))
    ) {
      return;
    }

    const restSlides = roomPrivate.slideRefs.filter(
      (userId) => !room.showedSlideRefs.includes(userId)
    );

    const slidesCandidates =
      restSlides.length === 0 ? roomPrivate.slideRefs : restSlides;

    const nextSlide =
      slidesCandidates[Math.floor(Math.random() * slidesCandidates.length)];

    const endTime =
      room.endTime ??
      firebase.firestore.Timestamp.fromMillis(dayjs().add(5, 'm').valueOf());

    const newRoom: Room = {
      ...room,
      showedSlideRefs: [...room.showedSlideRefs, nextSlide],
      endTime,
    };

    firebase.firestore().doc(`rooms/${roomId}`).set(newRoom);
  };

  return (
    <Layout>
      <PrivatePage
        renderWhenLoggedIn={() =>
          room === undefined || user === undefined ? (
            <Center flexGrow={1}>
              <Spinner />
            </Center>
          ) : (
            <>
              {[...room.participants, room.owner].includes(user.id) ? (
                <>
                  <Flex>
                    <Heading flexGrow={1}>{room.name}</Heading>
                    {user.id === room.owner && (
                      <Link href={`/rooms/${roomId}/setting`} passHref>
                        <Button leftIcon={<FaCog />} as="a">
                          設定へ
                        </Button>
                      </Link>
                    )}
                  </Flex>
                  <Flex flexGrow={1}>
                    <Flex
                      width="40"
                      flexDirection="column-reverse"
                      justifyContent="flex-end"
                    >
                      <Box>{restTime}</Box>
                      {room.presentedParticipants.map((userId, index) => (
                        <Box key={userId}>
                          <UserAvatar uid={userId} />
                          <Text as="p">
                            {room.presentedThemes[index] ?? '???'}
                          </Text>
                        </Box>
                      ))}
                    </Flex>
                    <Box flexGrow={1} h="full">
                      <Button
                        variant="ghost"
                        onClick={goNextSlide}
                        h="full"
                        w="full"
                        _hover={{ background: 'none' }}
                        p="0"
                        borderRadius="0"
                      >
                        <Image
                          src={slideUrl}
                          h="full"
                          w="full"
                          objectFit="contain"
                        />
                      </Button>
                    </Box>
                  </Flex>
                </>
              ) : (
                <JoinRoom room={room} roomId={roomId} />
              )}
            </>
          )
        }
      />
    </Layout>
  );
};

export default RoomPage;
