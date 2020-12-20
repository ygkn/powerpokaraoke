import { VFC } from 'react';

import { Layout } from '../components/Layout';
import { PrivatePage } from '../components/PrivatePage';
import { RoomList } from '../components/RoomList';

const IndexPage: VFC = () => {
  return (
    <Layout>
      <PrivatePage renderWhenLoggedIn={() => <RoomList />} />
    </Layout>
  );
};

export default IndexPage;
