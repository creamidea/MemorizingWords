"use strict"
// generate the tk parameter for google translate

const cb = '&',
      k = '',
      Ff = '=',
      jd = '.',
      $b = "+-a^+6",
      Yb = '+',
      Zb = "+-3^+b+-f",
      Pb = "(",
      Ub = ")"

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
  // console.log('>>>>>>>>', a)
  return oM(a)
}
, TK = function(a) {
  return eval(Pb + a + Ub)
}

module.exports = {
  rM: rM,
  TK: TK
}

// test
// console.log(oM('srcrom') == '&tk=712807.839968')
// console.log(oM('testt') == '&tk=408435.2612')
// console.log(oM('cdrom') == '&tk=535944.924879')
// console.log(oM('bring') == '&tk=422101.16786')
