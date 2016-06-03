import { queryPods, queryPodList } from '../services/pod';

const getPods = async (podName) => {
  let rs = await queryPods(podName);
  return rs;
};

const getPodList = async (podName) => {
  let rs = await queryPodList(podName);
  return rs;
};

export {
  getPods,
  getPodList
};
