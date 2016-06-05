import url from 'url';

//Overwrite your different rule here
const crawlerConf = {
  baseUrl: "http://www.tingroom.com/",
  pods: [
    {
      podName: "ellenShow",

      podPages: 1
    }, {
      podName: "englishpod",

      podPages: 1,

      getPodId: function($) {
        let podTitle = getPodTitle($),
        podIdPattern = /\d+$/,
        podId = podTitle.match(podIdPattern)[0];
        return parseInt(podId);
      },

      getPodTitle: function($) {
        let podTitle = getPodTitle($);
        return podTitle.replace(noChinesePattern, '');
      }
    }
  ]
};

const dividingChar = String.fromCharCode(0x12),
      noChinesePattern = /[^u4E00-u9FA5]/g;

// Pod Ttitle
const getPodTitle = $ => (
  $('.title_viewbox h2').text()
);

// Pod ID
const getPodId = $ => {
  let podId,
      podTitle = getPodTitle($);

  podId = podTitle.replace(noChinesePattern, '');
  return parseInt(podId)
}

// Pod Paragraph
const getPodParagraphs = $ => {
  let paragraphs = [],
      paragraphsList = [];

  paragraphs = $('#zoom p');
  paragraphs.each(function (index) {
    paragraphsList.push($(this).text());
  });
  return paragraphsList.join(dividingChar);
}


//Apply Config
export default () => {
  let _pods = [],
      _defaultPod = { getPodId, getPodTitle, getPodParagraphs };

  _pods = crawlerConf.pods.map(pod => (
    Object.assign({ ..._defaultPod }, pod)
  ))

  return Object.assign(crawlerConf, { pods: _pods });
};
