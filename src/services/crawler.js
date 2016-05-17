import http from 'http';
import url from 'url';
import superagent from 'superagent';
import cheerio from 'cheerio';
import async from 'async';
import eventproxy from 'eventproxy';

import promiser from '../utils/promiser';
import Queuer from '../utils/queuer';

const conf = {
  baseUrl: 'http://www.tingroom.com/',
  pageNum: 10,
  startDate: new Date(),
  endDate: false
}

let catchData = [],
    pageUrls = [];

let ep = new eventproxy();
let superGet = promiser(superagent.get, superagent);

for (let i = conf.pageNum; i >= 1; i--) {
    pageUrls.push(`http://www.tingroom.com/lesson/englishpod/list_${i}.html`);
}

// pageUrls.forEach(function (pageUrl) {

// })


async function scanPage (page) {
  let rs = await superGet(page);

  console.log('fetch ' + page + ' successful');

  let $ = cheerio.load(rs.text);
  let articleList = $('ul.e2 li a');

  articleList.forEach((article) => {
    let articleLink = article.attr('href');
    ep.emit('ArticleHtml', articleLink);
  });
}

let queuer = new Queuer();
// scanPage(pageUrls[0]);
pageUrls.forEach((page) => {
  queuer.add(superGet('https://www.facebook.com/'));
});
queuer.run();