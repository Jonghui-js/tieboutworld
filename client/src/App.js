import React from 'react';
import { Admin, Resource } from 'react-admin';
import authProvider from './authProvider';
import jsonServer from 'ra-data-json-server';
import simpleServer from 'ra-data-simple-rest';
import { AreaList, AreaEdit, AreaCreate, AreaShow } from './area';
import { UserList, UserEdit } from './user';

const App = () => (
  <Admin authProvider={authProvider} dataProvider={jsonServer('/api/v1')}>
    <Resource
      name='areas'
      list={AreaList}
      show={AreaShow}
      edit={AreaEdit}
      create={AreaCreate}
    />
    <Resource name='users' list={UserList} edit={UserEdit} />
  </Admin>
);
export default App;
