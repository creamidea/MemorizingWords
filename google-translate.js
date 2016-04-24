"use strict"
// google translate tools

const http = require('http'),
      https = require('https'),
      fs = require('fs'),
      EventEmitter = require('events'),
      execOld = require('child_process').exec,
      utils = require('./goog-utils.js'),
      tk = utils.rM,
      resParser = utils.TK,
      HOSTNAME = "translate.google.cn",
      PORT = 80,
      USER_AGENT = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/49.0.2623.110 Safari/537.36',
      args = process.argv

let google_translate_option = {
  hostname: HOSTNAME,
  port: PORT,
  method: 'GET',
  headers: {
    'User-Agent': USER_AGENT
  }
}

function parseMp3(data) {
  let header = data.slice(0, 4)
  console.log(header)
}

// Wrap the origin exec to the Promise
function exec(command) {
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

function request(options) {
  // console.log(options)
  return new Promise( (resolve, reject) => {
    let req = http.request(options, (res) => {
      // console.log(`> ${options.path} ${res.statusCode}`)
      let chunks = [], size = 0
      res.on('data', (chunk) => {
        chunks.push(chunk)
        size += chunk.length
      })
      res.on('end', () => {
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

// query one word
function query (word) {
  let options = google_translate_option
  word = word.replace(/\s|[_]/g, ' ')
  options.path = '/translate_a/single?client=t&sl=en&tl=zh-CN&hl=en&dt=at&dt=bd&dt=ex&dt=ld&dt=md&dt=qca&dt=rw&dt=rm&dt=ss&dt=t&ie=UTF-8&oe=UTF-8&source=btn&rom=1&srcrom=1&ssel=3&tsel=6&kc=0' + tk(word) + '&q=' + encodeURIComponent(word)
  return new Promise ( (resolve, reject) => {
    request(options).then( (data) => {
      resolve(data)
    }).catch((e) => {
      reject(e)
    });
  })
}

// speak one word prounciation
function speak (word, tl) {
  let options = google_translate_option
  if(!tl) tl = 'en'
  word = word.replace(/\s|[_]/g, ' ')
  // console.log(word)
  console.log('> Start looking for: ' + word)
  options.path = '/translate_tts?ie=UTF-8&total=1&idx=0&client=t' + '&tl=' + tl + tk(word) + '&q=' + encodeURIComponent(word)
  return new Promise( (resolve, reject) => {
    request(options).then( (data) => {
      resolve(data)
    }).catch( (e) => {
      reject(e)
    });
  })
}

class FilenameNoodle {
  constructor () {
    this.pool = new Map
  }
  set (word, tl, filename) {
    let _w = this.pool.get(word)
    if (_w) {
      _w[tl] = filename
    } else {
      _w = {}
      _w[tl] = filename
    }
    this.pool.set(word, _w)
  }
  toFFmpegString () {
    let result = []
    for (let word of this.pool.values()) {
      result.push(word.en)
      result.push(word.cn)
    }
    return result.join('|')
  }
  generateMp3File (filename) {
    exec(`rm -rf ${filename}.mp3`).then(() => {
      exec(`ffmpeg -i "concat:${this.toFFmpegString()}" -acodec copy ${filename}.mp3`).then(()=>{
        console.log(`FFmpeg Completed: ${filename}.mp3.`)
      })
    });
  }
}

function savePronunciation2 (filename) {
  const words = JSON.parse(fs.readFileSync(filename).toString()),
        foldername = filename + '.folder',
        filenamenoodle = new FilenameNoodle

  try {
    fs.mkdirSync(`./${foldername}`)    
  } catch (e) {
    console.log(`Overwite the ${foldername}.`)
  }

  words.forEach((word, index) => {
    speak(word).then((data) => {
      fs.writeFile(`./${foldername}/${word}.mp3`, data, () => {
        filenamenoodle.set(word, 'en', `./${foldername}/${word}.mp3`)
      })
      
      query(word).then((data) => {
        let d = resParser(data),
            word_cn = d[0][0][0]
        speak(word_cn, 'zh-CN').then((data) => {
          fs.writeFile(`./${foldername}/${word_cn}.mp3`, data, () => {
            filenamenoodle.set(word, 'cn', `./${foldername}/${word_cn}.mp3`)
            
            // download and write all words when finish
            if (index === words.length - 1) {
              filenamenoodle.generateMp3File(filename)
            }
          })
        })
      })
    })
  })
}

function savePronunciation (filename) {
  const writeStream = fs.createWriteStream(`${filename.split('.')[0]}.mp3`),
        writeEvent = new EventEmitter(),
        words = JSON.parse(fs.readFileSync(filename).toString()),
        wordsCount = words.length
  let buffer = [],
        size = 0
  
  function writePronunciation (word) {
    speak(word).then((data) => {
      buffer.push(data)
      size += data.length
      // parseMp3(data)
      query(word).then((data) => {
        let d = resParser(data),
            word_cn = d[0][0][0]
        speak(word_cn, 'zh-CN').then((data) => {
          buffer.push(data)
          size += data.length
          console.log(`Complete: ${wordsCount - words.length}/${wordsCount}`)
          writeEvent.emit('write-end')
        })
      })
    }).catch((e) =>{
      console.log('Speak Error: ' + e)
    });
  }
  writeEvent.on('write-end', () => {
    if (words.length > 0) {
      writePronunciation(words.shift())
    } else {
      writeStream.write(Buffer.concat(buffer, size))
      writeEvent.unbind('write-end')
      process.nextTick(() => {
        writeStream.end()
      })
    }
  });
  writeEvent.emit('write-end')
}

if (args.length === 3) {
  savePronunciation(args[2])
} else {
  let message = `Usage: ${args[0]} ${args[1]} <filename>`;
  console.log(message)
}

// speak('hello world').then((data) => {console.log(data)})


// 11111111111
// 10 MPEG-2
// 01 Layer-3
// 1 has-crc
// 0100 32kbps bitrate
// 01 24kHz
// 0 frame is not padded
// 0 Private bit. This one is only informative.
// 11 Single channel
// 00 mode extension
// 0 Audio is not copyrighted
// 1 Original media
// 00 none


// 3,840 bytes

// 8 * 4 = 32 bytes -> header
// 16 -> crc

// 3792 bytes -> audio data

// 192 FrameSize
