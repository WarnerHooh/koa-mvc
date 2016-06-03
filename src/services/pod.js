import connection from '../utils/connection';

const { query, insert } = connection;

// query all pods
const queryPodList = async (podName) => {
  let rs = null;

  try {
    rs = await query('SELECT * FROM ?? ORDER BY `id`', podName);
  } catch(e) {
    console.log(e);
  }
  return rs;
};

// query all episodes in a pod
const queryPods = async (podName) => {
  let rs = null;

  try {
    rs = await query('SELECT * FROM ?? ORDER BY `podId`', podName);
  } catch(e) {
    console.log(e);
  }
  return rs;
};

// check if a pod exists
const checkPod = async (podName) => {
  let rs = null;

  try {
    rs = await query('SHOW TABLES LIKE ?', podName);
  } catch(e) {
    console.log(e);
  }
  return rs;
};

// create a pod
const createPod = async (podName) => {
  let rs = null;

  try {
    await query('CREATE TABLE ?? (' +
                      ' id int(11) AUTO_INCREMENT,' +
                      ' podId int(11),' +
                      ' podTitle VARCHAR(45),' +
                      ' podParagraph VARCHAR(1000),' +
                      ' podAudio VARCHAR(200),' +
                      ' PRIMARY KEY(id))'
                      , podName);
    rs = true;
  } catch(e) {
    console.log(e);
  }
  return rs;
};

//clear a table
const clearPod = async (podName) => {
  let rs = false;

  try {
    await query('TRUNCATE TABLE ??', podName);
    rs = true;
  } catch(e) {
    console.log(e);
  }

  return rs;
}

//insert a pod
const insertPod = async (podName, pod) => {
  let rs = false;

  try {
    await query('INSERT INTO ?? SET ?', [podName, pod]);
    rs = true;
  } catch(e) {
    console.log(e);
  }

  return rs;
}

//update the audio of pod
const updatePodAudio = async (podName, podAudio, podId) => {
  let rs = false;

  try {
    await query('UPDATE ?? SET podAudio = ? WHERE podId = ?', [podName, podAudio, podId]);
    rs = true;
  } catch(e) {
    console.log(e);
  }

  return rs;
}

export {
  queryPodList,
  queryPods,
  checkPod,
  createPod,
  clearPod,
  insertPod,
  updatePodAudio
}
