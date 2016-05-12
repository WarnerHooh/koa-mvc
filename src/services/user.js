import fs from 'fs';
import path from 'path';
import promiser from '../utils/promiser';
import { getConnection } from '../config/databaseConf';

const connection = getConnection();

const queryUsers = async () => { 
  
  let query = promiser(connection.query, connection);
  let rs = null;

  try {
    rs = await query('SELECT * FROM User', '');  
    console.log(rs)
  } catch(e) {
    console.log(e);
  }

  return rs;
};

export {
  queryUsers
}
