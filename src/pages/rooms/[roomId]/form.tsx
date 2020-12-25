import {
  AspectRatio,
  Box,
  Button,
  Center,
  Flex,
  FormControl,
  FormLabel,
  Grid,
  Heading,
  Image,
  Spinner,
  Text,
  Textarea,
} from '@chakra-ui/react';
import firebase from 'firebase/app';
import { useFormik } from 'formik';
import { nanoid } from 'nanoid';
import React, { useCallback, useEffect, useState, VFC } from 'react';
import { useDropzone } from 'react-dropzone';
import { useDocumentData } from 'react-firebase-hooks/firestore';

import { Layout } from '../../../components/Layout';
import { PrivatePage } from '../../../components/PrivatePage';
import { Room, RoomPrivate } from '../../../util/room';
import { useQueryString } from '../../../util/router';
import { useUser } from '../../../util/user';

type RoomFormData = {
  themes: string;
  slides: File[];
};

const RoomFormPage: VFC = () => {
  const roomId = useQueryString('roomId');
  const [room] = useDocumentData<Room>(
    firebase.firestore().doc(`rooms/${roomId}`)
  );

  const { user } = useUser();

  const onSubmit = useCallback(
    async (data: RoomFormData) => {
      if (user === undefined) {
        return;
      }

      const themes = data.themes
        .split('\n')
        .map((text) => text.trim())
        .filter((text) => text !== '');

      const storage = firebase.storage();

      const slidePaths = data.slides.map(
        () => `users/${user.id}/slides/${nanoid()}`
      );

      await Promise.all(
        data.slides.map((file, index) =>
          storage.ref(slidePaths[index]).put(file)
        )
      );

      await firebase.firestore().runTransaction(async (transaction) => {
        const roomPrivateRef = firebase
          .firestore()
          .doc(`rooms_private/${roomId}`);

        const roomPrivateDoc = await transaction.get(roomPrivateRef);
        const oldRoomPrivate = roomPrivateDoc.data() as RoomPrivate;

        const newRoomPrivate: RoomPrivate = {
          ...oldRoomPrivate,
          themes: [...oldRoomPrivate.themes, ...themes],
          slideRefs: [...oldRoomPrivate.slideRefs, ...slidePaths],
        };
        transaction.update(roomPrivateRef, newRoomPrivate);
      });
    },
    [roomId, user]
  );

  const form = useFormik<RoomFormData>({
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
  const { getRootProps, getInputProps } = useDropzone({
    accept: 'image/*',
    onDrop,
  });

  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  useEffect(() => {
    setPreviewUrls(form.values.slides.map((file) => URL.createObjectURL(file)));
  }, [form.values.slides]);

  return (
    <Layout>
      <PrivatePage
        renderWhenLoggedIn={() =>
          room === undefined || user === undefined ? (
            <Center flexGrow={1}>
              <Spinner />
            </Center>
          ) : (
            <Flex
              w="xl"
              flexGrow={1}
              flexDirection="column"
              alignItems="stretch"
              textAlign="center"
              mx="auto"
            >
              <Heading>{room.name}</Heading>
              <form onSubmit={form.handleSubmit}>
                <Box p="4">
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
                              width="full"
                              height="full"
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
                  <Button colorScheme="red" type="submit">
                    送信
                  </Button>
                </Box>
              </form>
            </Flex>
          )
        }
      />
    </Layout>
  );
};

export default RoomFormPage;
