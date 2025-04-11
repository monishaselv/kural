import SQLite from 'react-native-sqlite-storage';

export const DbStorage = SQLite.openDatabase(
  {
    name: 'KuralDatabase',
    location: 'default',
  },
  () => {
    console.log('Database opened successfully');
  },
  (error:any) => {
    console.error('Error opening database: ', error);
  }
);
