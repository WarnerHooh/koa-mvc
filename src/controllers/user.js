import { queryUsers } from '../services/user';

const getUsers = async () => {
  let rs = await queryUsers();
  return rs;
};

const getUserById = (id) => {
  return {name: 'Warner'};
};

export {
  getUsers,
  getUserById
};