import { queryPods } from '../services/pod';

const getPods = async () => {
  let rs = await queryPods();
  return rs;
};

export {
  getPods
};