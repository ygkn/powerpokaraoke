import { Center, Spinner } from '@chakra-ui/react';
import firebase from 'firebase/app';
import { VFC } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';

type RenderProps = () => JSX.Element;

type Props = {
  renderWhenLoggedIn: RenderProps;
  uid?: string | string[];
};

export const PrivatePage: VFC<Props> = ({ renderWhenLoggedIn, uid }) => {
  const [user, isLoading] = useAuthState(firebase.auth());

  if (isLoading) {
    return (
      <Center flexGrow={1}>
        <Spinner />
      </Center>
    );
  }

  if (user == null) {
    return (
      <Center flexGrow={1}>
        <p>ログインしてね</p>
      </Center>
    );
  }

  if (uid !== undefined && !([] as string[]).concat(uid).includes(user.uid)) {
    return <Center flexGrow={1}>このページを見る権限がないよ</Center>;
  }

  return renderWhenLoggedIn();
};
