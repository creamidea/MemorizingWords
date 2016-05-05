"use strict"
	 
const fs = require('fs'),
	  utils = require('./goog-utils.js'),
	  request = utils.request,
	  // HOSTNAME = "www.laiguge.com",
	  HOSTNAME = "0s.o53xo.m5xw6z3mmuxgg33n.erenta.ru",
	  USER_AGENT = utils.USER_AGENT,
	  rJEAPI = /je\.api(.+)?/g

let google_option = {
  hostname: HOSTNAME,
  method: 'GET',
  headers: {
    'User-Agent': USER_AGENT,
    'Cookie': '_UMID=kbAhsYemE2WGWV1hsLj5bBxwWVbaYhzp'
  }
}

function query (word) {
	// TODO: 是否需要深度拷贝
	let option = google_option
	// option.path = `/search?q=define%3Asecret&hl=en&ie=UTF-8&oe=UTF-8&num=1&start=0`
	option.path = `/search?num=1&start=0&hl=en&fp=1&q=define%3A${encodeURIComponent(word)}`
	return new Promise ( (resolve, reject) => {
		request(option, 'http').then((data) => {
			resolve([data, word])
		}).catch((e)=>{reject(e)})
	})
}

query('class').then((a)=>{
	const writeStream = fs.createWriteStream(`${a[1]}.html`)
	writeStream.write(utils.parseJEAPI(a[0].toString()), (e) => {
		e && console.log(e)
	})
}).catch((err)=>{
	console.log(err)
})
query('secret').then((a)=>{
	const writeStream = fs.createWriteStream(`${a[1]}.html`)
	writeStream.write(utils.parseJEAPI(a[0].toString()), (e) => {
		e && console.log(e)
	})
}).catch((err)=>{
	console.log(err)
})
