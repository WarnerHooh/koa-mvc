import mysql from 'mysql';

const connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'test'
});

//init connect
export const initConnection = () => {
  connection.connect();
}

export const getConnection = () => connection;