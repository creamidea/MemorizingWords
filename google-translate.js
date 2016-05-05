"use strict"
// google translate tools
// Download and save google translate pronunciation
const fs = require('fs'),
      EventEmitter = require('events'),
      utils = require('./goog-utils.js'),
      tk = utils.rM,
      resParser = utils.TK,
      request = utils.request,
      exec = utils.exec,
      HOSTNAME = "translate.google.cn",
      PORT = 80,
      USER_AGENT = utils.USER_AGENT,
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

// query one word
function query (word) {
  let options = google_translate_option
  word = word.replace(/\s|[_]/g, ' ')
  options.path = '/translate_a/single?client=t&sl=en&tl=zh-CN&hl=en&dt=at&dt=bd&dt=ex&dt=ld&dt=md&dt=qca&dt=rw&dt=rm&dt=ss&dt=t&ie=UTF-8&oe=UTF-8&source=btn&rom=1&srcrom=1&ssel=3&tsel=6&kc=0' + tk(word) + '&q=' + encodeURIComponent(word)
  return new Promise ((resolve, reject) => {
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

// parse the content of the specify file
function parseFileContent(filename) {
  var content = fs.readFileSync(filename),
      words = []
  try {
    words = JSON.parse(content.toString())
  } catch (err) {
    if (err instanceof SyntaxError) {
      words = content.toString().split(/\r?\n/)
    } else {
      throw err
    }
  }
  return words
}

function savePronunciation (filename) {
  const writeStream = fs.createWriteStream(`${filename.split('.')[0]}.mp3`),
        writeEvent = new EventEmitter(),
        words = parseFileContent(filename),
        wordsCount = words.length
  let buffer = [],
        size = 0
  
  function writePronunciation (word) {
    // exclude the null string
    if (typeof word !== 'string' || word === '') {
      writeEvent.emit('write-end')
      return
    }
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
      console.log('Speaking Error: ' + e)
    });
  }
  writeEvent.on('write-end', () => {
    if (words.length > 0) {
      writePronunciation(words.shift())
    } else {
      writeStream.write(Buffer.concat(buffer, size), (e) => {
        e && console.log(e)
        writeEvent.removeListener('write-end', () => {})
        process.nextTick(() => {
          writeStream.end()
        })
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
