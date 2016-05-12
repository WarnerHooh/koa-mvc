import { queryUsers, queryUserById, insertUser } from '../services/user';

const getUsers = async () => {
  let rs = await queryUsers();
  return rs;
};

const getUserById = async (id) => {
  let rs = await queryUserById(id);
  return rs;
};

const addUser = async (user) => {
  let rs = await insertUser(user);
  return rs;
}

export {
  getUsers,
  getUserById,
  addUser
};