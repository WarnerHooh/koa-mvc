import connection from '../utils/connection';

const { query, insert } = connection;

// query all pods
const queryPods = async () => { 
  let rs = null;

  try {
    rs = await query('SELECT * FROM `Pod` ORDER BY `podId`');  
    console.log(rs)
  } catch(e) {
    console.log(e);
  }

  return rs;
};

//insert a pod
const insertPod = async (pod) => {
  let rs = false;

  try {
    await query('INSERT INTO `Pod` SET ?', pod);
    rs = true;
  } catch(e) {
    console.log(e);
  }

  return rs;
}

//update the audio of pod
const updatePodAudio = async (podAudio, podId) => {
  let rs = false;

  try {
    await query('UPDATE `Pod` SET podAudio = ? WHERE podId = ?', [podAudio, podId]);
    rs = true;
  } catch(e) {
    console.log(e);
  }

  return rs;
}

export {
  queryPods,
  insertPod,
  updatePodAudio
}
