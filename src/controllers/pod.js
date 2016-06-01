import { queryPods } from '../services/pod';

const getPods = async (podName) => {
  let rs = await queryPods(podName);
  return rs;
};

export {
  getPods
};
