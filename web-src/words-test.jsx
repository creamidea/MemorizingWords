"use strict";

import React from 'react';

class File extends React.Component {
  handleClick () {
    let props = this.props;
    props.getWordsList(props.filename.split('.')[0]);
  }

  render () {
    let props = this.props;
    let {filename, size, date} = props;
    return (
        <li>
        <strong style={{marginRight: "10px"}}><a onClick={this.handleClick.bind(this)} href="javascript:void(0)">{filename}</a></strong>
        <span style={{marginRight: "10px"}}>{size}B</span>
        <span>{date}</span>
        </li>
    );
  }
}

class Pronunciation extends React.Component {
  constructor (props) {
    super(props);
    this.state = {playing: false};
  }
  play (word) {
    let p = new Audio(`/reviews/words/${word}.mp3`);
    let _this = this;
    p.addEventListener('ended', (() => {this.setState({playing: false});}).bind(this));
    this.setState({playing: true});
    p.play();
  }
  render () {
    // console.log('play...: ', this.props.word);
    // console.log(this.props.tabindex);
    return (
        <div style={{display: "inline-block"}}>
        <button onClick={this.play.bind(this, this.props.word)} disabled={this.state.playing} tabindex={this.props.tabindex}>&#x23f5;playing...</button>
        </div>
    );
  }
}

class Topic extends React.Component {

  constructor (props) {
    super(props);
    this.state = {refAnswerShowing: false, pos: "", fetching: false};
  }

  answer (choice) {
    switch(choice) {
    case 'y':
      break;
    case 'n':
      this.translate(this.props.word);
      break;
    default:
      break;
    }
  }

  translate (word) {
    this.setState({fetching: true});
    fetch(`/reviews/words/${word}.txt`).then( (res) => {
      return res.text();
    }).then( ((text)=> {
      let d = eval(`(${text})`);
      let pos = d[0][1] && d[0][1].slice(-1)[0];
      this.setState({pos: pos});
      this.setState({refAnswerShowing: true, fetching: false});
    }).bind(this));
  }

  render () {
    let display = "none";
    if (this.state.refAnswerShowing) {
      display = "inline-block";
    }
    return (
        <li style={{magin: "2px auto", listStyleType: "decimal-leading-zero"}}>
        <Pronunciation word={this.props.word} tabindex={this.props.tabindex}/>
        <button onClick={this.answer.bind(this, 'y')}>Yes</button>
        <button onClick={this.answer.bind(this, 'n')} disabled={this.state.fetching}>DAFT</button>
        <div style={{display: display}} >
        <h2 style={{display: "inline"}}>{this.props.word}</h2>
        <p style={{display: "inline"}}>/{this.state.pos}/</p>
        </div>
        </li>
    );
  }
}

export default class WordsTest extends React.Component {
  constructor(props) {
    super(props);
    this.state = {topics: [], errorMsg: "", files: []};
  }

  fetch (url) {
    return new Promise( (resolve, reject) => {
      fetch(url).then( (res) => {
        let contentType = res.headers.get('Content-Type');
        if (res.ok) {
          if (/text/.test(contentType))
            return res.text();
          else if (/json/.test(contentType))
            return res.json();
        } else {
          reject(res.statusText);
        }
      }).then( (content) => {
        resolve(content);
      });
    });
  }

  getWordsList (wordsList) {
    this.setState({topics: []});
    this.fetch(`/reviews/${wordsList}.txt`).then( (txt) => {
      let topics = this.state.topics;
      txt.split(/\r?\n/g).forEach((value, index) => {
        if (/\w{2,}/.test(value))
          topics.push((<Topic word={value} answer={this.answer.bind(this)} tabindex={index+1}/>));
      });
      this.setState({topics: topics, errorMsg: ""});
    }).catch( (err) => {
      this.setState({topics:[], errorMsg: `${err}`});
    });
  }

  getWordsListContent () {
    this.fetch(`/words-test/content`).then( ((files) => {
      let _d = [];
      for (var file of files) {
        let _f = file.split(/\s+/);
        let size = _f.shift();
        let filename = _f.pop();
        let date = _f.join(' ');
        _d.push(<File size={size} filename={filename} date={date} getWordsList={this.getWordsList.bind(this)}/>);
      }
      this.setState({files: _d});
    }).bind(this)).catch( (err) => {
      console.log(`...${err}...`);
    });
  }

  componentDidMount () {
    this.getWordsListContent();
  }

  answer (choice, word) {
  }

  handleSubmit (e) {
    e.preventDefault();
    let wordsList = this.refs.wordsList.value.trim();
    if (!wordsList) {
      return;
    }
    this.getWordsList(wordsList);
  }

  render () {
    return (
      <div className="words-test">
        <form onSubmit={this.handleSubmit.bind(this)}>
          <label for="words-list">Which word-list do you want to test?</label>
          <input type="text" id="words-list" ref="wordsList"/>
          <button type="submit">Go</button>
        </form>
        <div style={{display: "flex"}}>
          <ul>{this.state.files}</ul>
          <ul>{this.state.topics}</ul>
        </div>
        <p>{this.state.errorMsg}</p>
      </div>
    );
  }
}


// http://bbs.reactnative.cn/topic/15/react-react-native-%E7%9A%84es5-es6%E5%86%99%E6%B3%95%E5%AF%B9%E7%85%A7%E8%A1%A8
