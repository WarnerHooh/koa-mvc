import url from 'url';
import superagent from 'superagent';
import cheerio from 'cheerio';

import promiser from '../utils/promiser';
import Queuer from '../utils/queuer';
import connection from '../utils/connection'
import { insertPod, checkPod, createPod, clearPod, queryPods, updatePodAudio } from './pod'

const conf = {
  baseUrl: 'http://www.tingroom.com/',
  podName: 'ellenShow',  //englishpod
  pageNum: 4
};

// CREATE TABLE `test`.`Pods` (
//   `id` INT NOT NULL AUTO_INCREMENT,
//   `title` VARCHAR(45) NULL,
//   `description` VARCHAR(200) NULL,
//   `image` VARCHAR(200) NULL,
//   PRIMARY KEY (`id`));

async function setupAndRun() {
  let result = await checkPod(conf.podName);

  if(result.length) {
    console.log('clear table');
    await clearPod(conf.podName);
  } else {
    console.log('create table');
    await createPod(conf.podName);
    await insertPod('Pods', {
      title: conf.podName,
      description: 'English Podcast'
    });
  }

  queuer.run();
}

setupAndRun();


let superGet = promiser(superagent.get, superagent);
let queuer = new Queuer();

function getListPageLink(i) {
  return `${conf.baseUrl}lesson/${conf.podName}/list_${i}.html`
}

function getArticlePageLink(partial) {
  return url.resolve(conf.baseUrl, partial);
}

function getAudioLink(i) {
  return `${conf.baseUrl}play.php?id=${i}`;
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
async function scanListPage (link) {
  let $,
      articleList,
      articleLink;

  $ = await detachData(link);

  articleList = $('ul.e2 li a');

  articleList.each((i, article) => {
    articleLink = article.attribs.href;
    articleLink = getArticlePageLink(articleLink);

    // Then Scan Article
    queuer.add(scanArticlePage.bind(null, articleLink));
  });

  queuer.wake();

  return articleLinkList;
}

/**
 * @description get article detail by article page link
 */
async function scanArticlePage (link) {
  let $;

  $ = await detachData(link);

  let dividingChar = String.fromCharCode(0x12),
      noChinesePattern = /[^u4E00-u9FA5]/g,
      podIdPattern = /\d+$/,
      pageIdPattern = /\d+(?=\.html)/,
      pageTitle = $('.title_viewbox h2').text(),
      episodeTitle = '',
      episodeId = '',
      audioPageId = '',
      paragraphs = [],
      paragraphsList = [],
      audioPageLink = '';

  // episodeTitle = pageTitle.replace(noChinesePattern, '');
  episodeTitle = pageTitle;
  // episodeId = parseInt(episodeTitle.match(podIdPattern)[0]);
  episodeId = pageTitle.replace(noChinesePattern, '');
  audioPageId = parseInt(link.match(pageIdPattern)[0]);
  paragraphs = $('#zoom p');

  paragraphs.each(function (index) {
    paragraphsList.push($(this).text());
  });

  // Then Scan Audio
  audioPageLink = getAudioLink(audioPageId);
  queuer.add(scanAudioPage.bind(null, audioPageLink, episodeId));
  queuer.wake();

  await insertPod(conf.podName, {
    podId: episodeId,
    podTitle: episodeTitle,
    podParagraph: paragraphsList.join(dividingChar)
  });

  console.log(`Insert article [${pageTitle}].`);
}

/**
 * @description get audio link by audio page link
 */
async function scanAudioPage (link, podId) {
  let $;

  $ = await detachData(link);

  let mp3data = $("#dewplayer-vol").attr('data'),
      mp3url = mp3data.split('=')[1];

  await updatePodAudio(conf.podName, mp3url, podId);

  console.log(`Insert audio for pod [${podId}].`);
}

/**
 * @description set up the task queue
 */
queuer.on('drain', () => {
  connection.end();
})

for (var i = 1; i <= conf.pageNum; i++) {
  queuer.add(scanListPage.bind(null, getListPageLink(i)));
};
