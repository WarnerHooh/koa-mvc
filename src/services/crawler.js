import url from 'url';
import superagent from 'superagent';
import cheerio from 'cheerio';

import promiser from '../utils/promiser';
import Queuer from '../utils/queuer';
import connection from '../utils/connection'
import { insertPod, queryPods, updatePodAudio } from './pod'

const conf = {
  baseUrl: 'http://www.tingroom.com/',
  pageNum: 1
};

let superGet = promiser(superagent.get, superagent);
let queuer = new Queuer();

function getListPageLink(i) {
  return `${conf.baseUrl}lesson/englishpod/list_${i}.html`
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

  episodeTitle = pageTitle.replace(noChinesePattern, '');
  episodeId = parseInt(episodeTitle.match(podIdPattern)[0]);
  audioPageId = parseInt(link.match(pageIdPattern)[0]);
  paragraphs = $('#zoom p');

  paragraphs.each(function (index) {
    paragraphsList.push($(this).text());
  });

  // Then Scan Audio
  audioPageLink = getAudioLink(audioPageId);
  queuer.add(scanAudioPage.bind(null, audioPageLink, episodeId));
  queuer.wake();

  await insertPod({
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

  await updatePodAudio(mp3url, podId);

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

queuer.run();

