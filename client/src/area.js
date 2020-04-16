import React from 'react';
import {
  List,
  DateField,
  Datagrid,
  TextField,
  NumberField,
  SimpleForm,
  Edit,
  EditButton,
  SimpleFormIterator,
  DateInput,
  NumberInput,
  TextInput,
  ArrayInput,
  Create,
  Show,
} from 'react-admin';

export const AreaList = (props) => (
  <List {...props}>
    <Datagrid>
      <TextField source='name' />
      <NumberField source='financeStatus' />
      <TextField source='policy1' />
      <TextField source='policy2' />
      <TextField source='policy3' />
      <TextField source='description' />
      <NumberField source='tax' />
      <NumberField source='citizens.length' />
      <DateField source='date' />
      <EditButton />
    </Datagrid>
  </List>
);

export const AreaEdit = (props) => (
  <Edit {...props}>
    <SimpleForm>
      <NumberInput source='financeStatus' />
      <TextInput source='name' />
      <TextInput multiline source='policy1' fullWidth={true} />
      <TextInput multiline source='policy2' fullWidth={true} />
      <TextInput multiline source='policy3' fullWidth={true} />
      <TextInput source='description' fullWidth={true} />
      <NumberInput disabled source='tax' />
      <TextInput source='user' />
      <ArrayInput source='citizens'>
        <SimpleFormIterator>
          <TextInput source='user' />
        </SimpleFormIterator>
      </ArrayInput>
      <DateInput disabled source='date' />
    </SimpleForm>
  </Edit>
);

export const AreaCreate = (props) => (
  <Create {...props}>
    <SimpleForm redirect='list'>
      <TextInput source='name' />
      <TextInput multiline source='policy1' fullWidth={true} />
      <TextInput multiline source='policy2' fullWidth={true} />
      <TextInput multiline source='policy3' fullWidth={true} />
      <TextInput source='description' fullWidth={true} />
      <NumberInput source='tax' />
    </SimpleForm>
  </Create>
);
export const AreaShow = (props) => (
  <Show {...props}>
    <SimpleForm redirect='show'>
      <TextInput source='name' />
      <TextInput multiline source='policy1' fullWidth={true} />
      <TextInput multiline source='policy2' fullWidth={true} />
      <TextInput multiline source='policy3' fullWidth={true} />
      <TextInput source='description' fullWidth={true} />
      <NumberInput source='tax' />
    </SimpleForm>
  </Show>
);
