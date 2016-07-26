"use strict"
// generate the tk parameter for google translate

const http = require('http'),
      https = require('https'),
      execOld = require('child_process').exec

const cb = '&',
      k = '',
      Ff = '=',
      jd = '.',
      $b = "+-a^+6",
      Yb = '+',
      Zb = "+-3^+b+-f",
      Pb = "(",
      Ub = ")",
      googleJs = '!function(){window.google={},google.kHL="en",google.c={c:{a:!0}},google.time=function(){return(new Date).getTime()},google.timers={},google.startTick=function(o,e){var g=e&&google.timers[e].t?google.timers[e].t.start:google.time();google.timers[o]={t:{start:g},e:{},it:{},m:{}},(g=window.performance)&&g.now&&(google.timers[o].wsrt=Math.floor(g.now()))},google.tick=function(o,e,g){google.timers[o]||google.startTick(o),g=g||google.time(),e instanceof Array||(e=[e]);for(var t=0;t<e.length;++t)google.timers[o].t[e[t]]=g},google.afte=!0,google.aft=function(o){google.c.c.a&&google.afte&&google.tick("aft",o.id||o.src||o.name)}}();'

var lM = function(a) {
  return function() {
    return a
  }
}
, mM = function(a, b) {
  for (var c = 0; c < b.length - 2; c += 3) {
    var d = b.charAt(c + 2)
    // , d = d >= t ? d.charCodeAt(0) - 87 : Number(d)
    , d = d >= 'a' ? d.charCodeAt(0) - 87 : Number(d)
    , d = b.charAt(c + 1) == Yb ? a >>> d : a << d;
    a = b.charAt(c) == Yb ? a + d & 4294967295 : a ^ d
  }
  return a
}
// , nM = null 
, nM="405831.912621285"
, oM = function(a) {
  var b;
  if (null  !== nM)
    b = nM;
  else {
    b = lM(String.fromCharCode(84));
    var c = lM(String.fromCharCode(75));
    b = [b(), b()];
    b[1] = c();
    b = (nM = window[b.join(c())] || k) || k
  }
  var d = lM(String.fromCharCode(116))
  , c = lM(String.fromCharCode(107))
  , d = [d(), d()];
  d[1] = c();
  c = cb + d.join(k) + 
    Ff;
  d = b.split(jd);
  b = Number(d[0]) || 0;
  for (var e = [], f = 0, g = 0; g < a.length; g++) {
    var m = a.charCodeAt(g);
    128 > m ? e[f++] = m : (2048 > m ? e[f++] = m >> 6 | 192 : (55296 == (m & 64512) && g + 1 < a.length && 56320 == (a.charCodeAt(g + 1) & 64512) ? (m = 65536 + ((m & 1023) << 10) + (a.charCodeAt(++g) & 1023),e[f++] = m >> 18 | 240,e[f++] = m >> 12 & 63 | 128) : e[f++] = m >> 12 | 224,e[f++] = m >> 6 & 63 | 128),e[f++] = m & 63 | 128)
  }
  a = b;
  for (f = 0; f < e.length; f++)
    a += e[f],
  a = mM(a, $b);
  a = mM(a, Zb);
  a ^= Number(d[1]) || 0;
  0 > a && (a = (a & 2147483647) + 2147483648);
  a %= 1E6;
  return c + (a.toString() + jd + (a ^ b))
}
, rM = function(a) {
  // a = a.Wa(Gu).join(k);
  return oM(a)
}
, TK = function(a) {
  // console.log('>>>>>>>>', a.toString())
  console.log('>>> ', eval(Pb + a + Ub))
  return eval(Pb + a + Ub)
}
, QS_kga = function(a) {
  QS_gda = a;
  QS_le(QS_7d, QS_9d) || google.dclc(QS_d(a, QS_7d, !0))
}
, QS_jga = function(a) {
  return QS_jc().matchMedia("(-webkit-min-device-pixel-ratio: " + a + "),(min--moz-device-pixel-ratio: " + a + "),(min-resolution: " + a + "dppx)").matches ? a : 0
}
,QS_sga = function(a) {
  a = String(a);
  for (var b = ['"'], c = 0; c < a.length; c++) {
      var d = a.charAt(c), e = d.charCodeAt(0),
      f = c + 1, g;
      if (!(g = QS_kga[d])) {
          if (!(31 < e && 127 > e))
              if (d in QS_jga)
                  d = QS_jga[d];
              else if (d in QS_kga)
                  d = QS_jga[d] = QS_kga[d];
              else {
                  g = d.charCodeAt(0);
                  if (31 < g && 127 > g)
                      e = d;
                  else {
                      if (256 > g) {
                          if (e = "\\x",
                          16 > g || 256 < g)
                              e += "0"
                      } else
                          e = "\\u",
                          4096 > g && (e += "0");
                      e += g.toString(16).toUpperCase()
                  }
                  d = QS_jga[d] = e
              }
          g = d
      }
      b[f] = g
  }
  b.push('"');
  return b.join("")
}
, QS_Qla = function(a) {
    a = a.replace(/\\x([\d\w]{2})/gi, "\\u00$1");
    for (var b = [], c = a.split(/je\.api\(/), d = 0; d < c.length; ++d) {
        var e = c[d];
        if (e) {
            var f = e.lastIndexOf("});");
            0 < f && (e = e.substr(0, f) + "}",
            b.push(e))
        }
    }
    return b.map(function(b) {
        try {
            return JSON.parse(b)
        } catch (c) {
            throw QS_Zi("JPN", {
                d: b.substring(0, 200)
            }, c),
            c.EC = a,
            c;
        }
    })
}
, QS_Pla = function(a, b, c, d) {
    var e = QS_2d(b) == QS_Xi() ? 2 : 3
      , f = QS_je(b);
    d = d || {};
    d.url = b;
    d.rsn = c;
    QS_nla("#" + QS_ke(f.state) + "&sei=" + a, e, d)
}
, parseJEAPI = function (a) {
  let e = a,
      f = [],
      g,l,m,n;

  for (g = l = 0; -1 != l && g >= l; ) {
    l = e.indexOf("<script", g),
    -1 != l && (m = e.indexOf(">", l) + 1,
    g = e.indexOf("\x3c/script>", m),
    0 < m && g > m && f.push(e.substring(m, g)));
  }
  e = [];
  for (m = 0; m < f.length; ++m)
            g = f[m],
            g = g.replace(/location\.href/gi, QS_sga(l)),
            e.push(g);
  if (0 < e.length) {
    f = e.join(";");
    f = f.replace(/,"is":_loc/g, "");
    f = f.replace(/,"ss":_ss/g, "");
    f = f.replace(/,"fp":fp/g, "");
    f = f.replace(/,"r":dr/g, "");
    e = [];
    f = eval("var __r=[];var QS=function (){};QS.prototype.api=function(o){__r.push(o)};var je=new QS;" + f + ';__r;')
    // console.log(f)
    for (let i = 0, max = f.length; i < max; i++) {
      if (f[i].i === 'search')
        e.push(f[i].h)
      if (f[i].i === 'lfoot')
        e.push(f[i].h)
    }
    // f.forEach((a) => {
    //   console.log(a)
    //   a.h && e.push(a.h)
    // })
    return `<script>${googleJs}</script>` + e.join('')
    // try {
    //     var t = QS_Qla(f)
    // } catch (w) {
    //     f = w.EC,
    //     e = {},
    //     f && (e.EC = f.substr(0, 200)),
    //     QS_Pla(k, c, "P", e)
    // }
    // try {
    //     ba = b.ha,
    //     QS_lka(t, ba)
    // } catch (w) {
    //     QS_Pla(k, c, "X")
    // }
  }
  // if (d)
  //     c = a.lastIndexOf("\x3c/script>"),
  //     b.$ = 0 > c ? a : a.substr(c + 9);
  // else if ('"NCSR"' == a)
  //     return QS_Pla(k, c, "C"),
  //     !1;
}
, request = function(options, protocol='http') {
  // console.log(`Use Protocol: ${protocol}`)
  // console.log(options)
  if (['http', 'https'].indexOf(protocol) < 0) {
    console.error(`The protocol: ${protocol} is not supported!`)
    return
  }
  let [_request, _port] = protocol === 'http' ?
      [http.request, 80] :
      [https.request, 443]

  options.port = _port
  return new Promise( (resolve, reject) => {
    let req = _request(options, (res) => {
      // console.log(`>Code: ${res.statusCode} ->`)
      let chunks = [], size = 0
      res.on('data', (chunk) => {
        chunks.push(chunk)
        size += chunk.length
      })
      res.on('end', () => {
        // console.log(Buffer.concat(chunks, size))
        resolve(Buffer.concat(chunks, size))
      })
    })
    req.on('error', (e) => {
      if (e) {
        console.log(`problem with request: ${e.message}`)
        reject(e) 
      }
    })
    req.end()
  })
}
, exec = function(command) {
  // Wrap the origin exec to the Promise
  return new Promise((resolve, reject) => {
    execOld(command, function(err, stdout, stderr) {
      if (err!==null) {
        console.log(`exec error: ${err}`)
        reject(err)
      } else {
        resolve()
      }
    })
  })
}
, deepClone = function (o) {
  return JSON.parse(JSON.stringify(o))
}

module.exports = {
  USER_AGENT: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/49.0.2623.110 Safari/537.36',
  rM: rM,
  TK: TK,
  request: request,
  exec: exec,
  parseJEAPI: parseJEAPI,
  deepClone: deepClone
}

// test
// console.log(oM('srcrom') == '&tk=712807.839968')
// console.log(oM('testt') == '&tk=408435.2612')
// console.log(oM('cdrom') == '&tk=535944.924879')
// console.log(oM('bring') == '&tk=422101.16786')
