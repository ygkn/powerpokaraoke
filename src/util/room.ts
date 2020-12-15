import type firebase from 'firebase/app';

export type Room = {
  name: string;
  createdAt: Date;
  updatedAt: Date;
  owner: string;
  participants: string[];
  presentedParticipants: string[];
  showedSlideRefs: string[];
  endTime: firebase.firestore.Timestamp | null;
  enableSound: boolean;
  maxSlideCount: number | null;
  presentedThemes: string[];
};

export type RoomPrivate = {
  themes: string[];
  slideRefs: string[];
};
