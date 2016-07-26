const http = require('http');

// var url = 'http://x-team.1course.cn/Task/DisplayFinish?id=812062&tqId=7024&ticks=635971128930504139&token=9F5CB8A7CE55BC1D916ACDABB6178C42&saveUrl=&finishUrl=%2fAssignment%2fTaskFinish%3fuserNodeId%3d812062'
// parse the url
// break down: protocol, hostname, path, port, query
// function resolveUrl (url) {
//   let [a, b] = url.split('?')
// }
// http://translate.google.cn/translate_tts?ie=UTF-8&q=break%20down&tl=en&total=1&idx=0&textlen=10&tk=822809.704350&client=t
// http://translate.google.cn/translate_tts?ie=UTF-8&q=%E5%88%86%E8%A7%A3&tl=zh-CN&total=1&idx=0&textlen=2&tk=649847.1039152&client=t&prev=input&ttsspeed=0.24
var options = {
  hostname: "x-team.1course.cn",
  port: 80,
  path: '/Task/DisplayFinish',
  method: 'GET',
  headers: {
    'User-Agent':'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/49.0.2623.110 Safari/537.36'
  }
};
http.request(options, (res) => {
})

function getWordList() {
  var list = $.find('[gi=suggestAnswerE]')
  var words = []
  Array.prototype.forEach.call(list, function(word) {
    words.push(word.innerText.replace(/\s/g, '_'))
  })
  copy(words)
}

function PlayInOrder() {
  var btnPlays = $('[gi=btnPlay]')
  setTimeout(function () {
    
  }, 2000)
  Array.prototype.forEach.call(btnPlays, function (btn) {
    
  })
}

// http://translate.google.cn/translate_a/single?client=t&sl=zh-CN&tl=en&hl=en&dt=at&dt=bd&dt=ex&dt=ld&dt=md&dt=qca&dt=rw&dt=rm&dt=ss&dt=t&ie=UTF-8&oe=UTF-8&otf=1&rom=0&srcrom=0&ssel=3&tsel=3&kc=2&tk=649847.1039152&q=%E5%88%86%E8%A7%A3

