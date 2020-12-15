import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';
import firebase from 'firebase/app';
import { useFormik } from 'formik';
import { nanoid } from 'nanoid';
import { useRouter } from 'next/router';
import { useCallback, useState, VFC } from 'react';
import { FaPlus } from 'react-icons/fa';

import { Room, RoomPrivate } from '../util/room';
import { useUser } from '../util/user';

type NewFormData = {
  name: string;
};

export const NewRoom: VFC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const router = useRouter();
  const { user } = useUser();

  const close = useCallback(() => setIsOpen(false), []);
  const open = useCallback(() => setIsOpen(true), []);

  const onSubmit = useCallback(
    async (data: NewFormData) => {
      if (data.name.trim().length === 0 || user === undefined) {
        return;
      }

      const roomId = nanoid();
      const newRoom: Omit<Room, 'createdAt' | 'updatedAt'> & {
        createdAt: firebase.firestore.FieldValue;
        updatedAt: firebase.firestore.FieldValue;
      } = {
        name: data.name,
        owner: user.id,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
        participants: [],
        presentedParticipants: [],
        showedSlideRefs: [],
        endTime: null,
        enableSound: true,
        maxSlideCount: null,
        presentedThemes: [],
      };

      await firebase.firestore().doc(`rooms/${roomId}`).set(newRoom);

      const newRoomsPrivate: RoomPrivate = {
        themes: [],
        slideRefs: [],
      };

      await firebase
        .firestore()
        .doc(`rooms_private/${roomId}`)
        .set(newRoomsPrivate);

      router.push(`/rooms/${roomId}/setting`);
    },
    [router, user]
  );

  const form = useFormik<NewFormData>({
    initialValues: {
      name: '',
    },
    onSubmit,
    onReset: close,
  });

  return (
    <Box>
      <Button color="ButtonText" onClick={open} leftIcon={<FaPlus />}>
        作成
      </Button>
      <Modal isOpen={isOpen} onClose={close}>
        <ModalOverlay />
        <ModalContent as="form" onSubmit={form.handleSubmit} color="WindowText">
          <ModalHeader>新規作成</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl id="name">
              <FormLabel>ルームの名前</FormLabel>
              <Input
                type="text"
                name="name"
                required
                onChange={form.handleChange}
                value={form.values.name}
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button type="submit" colorScheme="blue" mr={3}>
              送信
            </Button>
            <Button type="reset" variant="ghost" onClick={close}>
              キャンセル
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};
