import {
  AspectRatio,
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Grid,
  Heading,
  Image,
  Text,
  Textarea,
} from '@chakra-ui/react';
import firebase from 'firebase/app';
import { useFormik } from 'formik';
import { nanoid } from 'nanoid';
import { useCallback, useEffect, useState, VFC } from 'react';
import { useDropzone } from 'react-dropzone';

import { Room, RoomPrivate } from '../util/room';
import { useUser } from '../util/user';

type JoinRoomFormData = {
  themes: string;
  slides: File[];
};

export const JoinRoom: VFC<{ room: Room; roomId: string }> = ({
  room,
  roomId,
}) => {
  const { user } = useUser();
  const onSubmit = useCallback(
    async (data: JoinRoomFormData) => {
      if (user === undefined) {
        return;
      }

      if (data.slides.length === 0) {
        alert('スライドは必須です');
        return;
      }

      const themes = data.themes
        .split('\n')
        .map((text) => text.trim())
        .filter((text) => text !== '');

      if (themes.length === 0) {
        alert('スライドは必須です');
        return;
      }

      const storage = firebase.storage();

      const slidePaths = data.slides.map(
        () => `users/${user.id}/slides/${nanoid()}`
      );

      await Promise.all(
        data.slides.map((file, index) =>
          storage.ref(slidePaths[index]).put(file)
        )
      );

      await Promise.all([
        firebase.firestore().runTransaction(async (transaction) => {
          const roomPrivateRef = firebase
            .firestore()
            .doc(`rooms_private/${roomId}`);

          const roomPrivateDoc = await transaction.get(roomPrivateRef);
          const oldRoomPrivate = roomPrivateDoc.data() as RoomPrivate;

          const newRoomPrivate: RoomPrivate = {
            ...oldRoomPrivate,
            themes: [...oldRoomPrivate.themes, ...data.themes.split('\n')],
            slideRefs: [...oldRoomPrivate.slideRefs, ...slidePaths],
          };
          transaction.update(roomPrivateRef, newRoomPrivate);
        }),
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
      ]);
    },
    [roomId, user]
  );

  const form = useFormik<JoinRoomFormData>({
    initialValues: {
      themes: '',
      slides: [],
    },
    onSubmit,
  });

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      form.setFieldValue('slides', [...form.values.slides, ...acceptedFiles]);
    },
    [form]
  );
  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  useEffect(() => {
    setPreviewUrls(form.values.slides.map((file) => URL.createObjectURL(file)));
  }, [form.values.slides]);

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
      <form onSubmit={form.handleSubmit}>
        <Box p="4">
          <Button colorScheme="red" type="submit">
            入室する
          </Button>
          <Box py="4">
            <Box
              p={4}
              border={1}
              borderStyle="solid"
              borderRadius="base"
              // eslint-disable-next-line react/jsx-props-no-spreading
              {...getRootProps()}
            >
              <Text as="p" p="4">
                クリックかドロップでスライドを追加……
              </Text>
              <Grid templateColumns="repeat(5, 1fr)" gridGap="4">
                {previewUrls.map((url, i) => (
                  <AspectRatio ratio={4 / 3} key={url}>
                    <Image
                      objectFit="contain"
                      src={url}
                      alt={`${i}枚めのスライド`}
                    />
                  </AspectRatio>
                ))}
              </Grid>
              <input
                type="file"
                name="theme"
                // eslint-disable-next-line react/jsx-props-no-spreading
                {...getInputProps()}
              />
            </Box>
          </Box>
          <FormControl id="theme">
            <FormLabel>テーマ（改行区切り）</FormLabel>
            <Textarea
              value={form.values.themes}
              onChange={form.handleChange}
              name="themes"
              required
            />
          </FormControl>
        </Box>
      </form>
    </Flex>
  );
};
