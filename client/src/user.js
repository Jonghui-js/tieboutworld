import React from 'react';
import {
  List,
  DateField,
  Datagrid,
  EmailField,
  TextField,
  ReferenceField,
  NumberField,
  Edit,
  SimpleForm,
  TextInput,
  NumberInput,
  DateInput,
  EditButton,
  Create,
} from 'react-admin';

export const UserList = (props) => (
  <List {...props}>
    <Datagrid rowClick='edit'>
      <TextField source='id' />
      <TextField source='name' />
      <TextField source='role' />
      <NumberField source='balance' />
      <EmailField source='email' />
      <ReferenceField source='currentArea' reference='areas'>
        <TextField source='_id' />
      </ReferenceField>
      <DateField source='date' />
      <EditButton />
    </Datagrid>
  </List>
);

export const UserEdit = (props) => (
  <Edit {...props}>
    <SimpleForm>
      <TextInput source='role' />
      <NumberInput source='balance' />
      <TextInput source='currentArea' />
      <TextInput source='name' />
      <TextInput source='email' />
    </SimpleForm>
  </Edit>
);
