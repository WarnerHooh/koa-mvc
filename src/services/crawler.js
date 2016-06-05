import url from 'url';
import superagent from 'superagent';
import cheerio from 'cheerio';

import promiser from '../utils/promiser';
import Queuer from '../utils/queuer';
import connection from '../utils/connection'
import { insertPod, checkPod, createPod, clearPod, queryPods, updatePodAudio, createPodSummary } from './pod'
import getCrawlerConf from '../config/crawlerConf'


const CONF = getCrawlerConf();

let superGet = promiser(superagent.get, superagent);
let queuer = new Queuer();

async function setupAndRun() {
  let podSummary = 'Pods',
    // to check if the Pod Summary table exists
    existedPodSummary = await checkPod(podSummary);

  if(!existedPodSummary.length) {
    await createPodSummary(podSummary);
  }

  for (var i = 0; i < CONF.pods.length; i++) {
    let _pod = CONF.pods[i],
        _podName = _pod.podName;

    // to check if the Pod table named by this exists
    let existedPod = await checkPod(_podName);

    if(existedPod.length) {
      console.log('clear table');
      console.log(_podName);
      await clearPod(_podName);
    } else {
      console.log('create table');
      await createPod(_podName);
      await insertPod(podSummary, {
        title: _podName,
        description: 'English Podcast'
      });
    }

    for (var j = 1; j <= _pod.podPages; j++) {
      queuer.add(scanListPage(_pod).bind(null, getPodArticleListPageLink(_podName, j)));
    }
  };

  queuer.run();
}

setupAndRun();

// Article List Page for Pod
function getPodArticleListPageLink(podName, pageIndex) {
  return `${CONF.baseUrl}lesson/${podName}/list_${pageIndex}.html`
}

// Article Page for Pod
function getPodArticlePageLink(partial) {
  return url.resolve(CONF.baseUrl, partial);
}

// Audio Page link for Pod
function getPodAudioLink(link) {
  const pageIdPattern = /\d+(?=\.html)/,
        audioPageId = parseInt(link.match(pageIdPattern)[0]);

  return `${CONF.baseUrl}play.php?id=${audioPageId}`;
}

/**
 * @description Get page data by superGet and return cherrio object
 * @return {[type]}
 */
async function detachData(page) {
  console.log(page);
  let rs = await superGet(page);
  console.log('fetch ' + page + ' successful');
  return cheerio.load(rs.text);
}

/**
 * @description get article pages url base on the list page
 */
const scanListPage = pod => async (link) => {
  let $,
      articleList,
      articleLink;

  $ = await detachData(link);

  articleList = $('ul.e2 li a');

  articleList.each((i, article) => {
    articleLink = article.attribs.href;
    articleLink = getPodArticlePageLink(articleLink);

    // Then Scan Article
    queuer.add(scanArticlePage(pod).bind(null, articleLink));
  });

  queuer.wake();

  return articleLinkList;
}

/**
 * @description get article detail by article page link
 */
const scanArticlePage = pod => async (link) => {
  let $;

  $ = await detachData(link);

  let episodeTitle,
      episodeId,
      episodeParagraph,
      episodeAudioPageLink = '';

  episodeTitle = pod.getPodTitle($);
  episodeId = pod.getPodId($);
  episodeParagraph = pod.getPodParagraphs($);

  // Then Scan Audio
  episodeAudioPageLink = getPodAudioLink(link);
  queuer.add(scanAudioPage(pod).bind(null, episodeAudioPageLink, episodeId));

  queuer.wake();

  await insertPod(pod.podName, {
    podId: episodeId,
    podTitle: episodeTitle,
    podParagraph: episodeParagraph
  });

  console.log(`Insert article [${episodeTitle}].`);
}

/**
 * @description get audio link by audio page link
 */
const scanAudioPage = pod => async (link, podId) => {
  let $;

  $ = await detachData(link);

  let mp3data = $("#dewplayer-vol").attr('data'),
      mp3url = mp3data.split('=')[1];

  await updatePodAudio(pod.podName, mp3url, podId);

  console.log(`Insert audio for pod [${podId}].`);
}

/**
 * @description set up the task queue
 */
queuer.on('drain', () => {
  connection.end();
})

// for (var i = 1; i <= fpod.podPages; i++) {
//   queuer.add(scanListPage.bind(null, getListPageLink(i)));
// };
