import connection from '../utils/connection';

const { query, insert } = connection;


// query all users
const queryUsers = async () => { 
  let rs = null;

  try {
    rs = await query('SELECT * FROM `User`');  
    console.log(rs)
  } catch(e) {
    console.log(e);
  }

  return rs;
};

// query some user by userId
const queryUserById = async (id) => {
  let rs = null;

  try {
    rs = await query('SELECT * FROM `User` WHERE `id` = ?', [id]);  
    console.log(rs)
  } catch(e) {
    console.log(e);
  }

  return rs;
}

//insert an user
const insertUser = async (user) => {
  let rs = false;

  try {
    await query('INSERT INTO `User` SET ?', user);
    rs = true;
  } catch(e) {
    console.log(e);
  }

  return rs;
}

export {
  queryUsers,
  queryUserById,
  insertUser
}
