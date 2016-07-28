"use strict";

import React from 'react';

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
    return (
        <div style={{display: "inline-block"}}>
        <button onClick={this.play.bind(this, this.props.word)} disabled={this.state.playing}>&#x23f5;playing...</button>
        </div>
    );
  }
}

class Topic extends React.Component {

  constructor (props) {
    super(props);
    this.state = {RefAnswerShowing: false};
  }

  answer (choice) {
    switch(choice) {
    case 'y':
      break;
    case 'n':
      this.setState({RefAnswerShowing: true});
      break;
    default:
      break;
    }
  }

  render () {
    let display = "none";
    if (this.state.RefAnswerShowing) {
      display = "inline-block";
    }
    return (
        <div style={{magin: "2px auto"}}>
        <Pronunciation word={this.props.word}/>
        <button onClick={this.answer.bind(this, 'y')}>Yes</button>
        <button onClick={this.answer.bind(this, 'n')}>No</button>
        <input className="ref-answer" style={{display: display}} disabled value={this.props.word}/>
        </div>
    );
  }
}

export default class WordsTest extends React.Component {
  constructor(props) {
    super(props);
    this.state = {topics: []};
  }

  componentDidMount () {
    fetch('/reviews/3-5.txt').then( (res) => {
      return res.text();
    }).then( (txt) => {
      let topics = this.state.topics;
      for (let t of txt.split(/\r?\n/g)) {
        console.log(t);
        topics.push((<Topic word={t} answer={this.answer.bind(this)}/>));
      }
      this.setState({topics: topics});
    });
  }

  answer (choice, word) {

  }

  render () {
    return (
      <div className="words-test">
        {this.state.topics}
      </div>
    );
  }
}


// http://bbs.reactnative.cn/topic/15/react-react-native-%E7%9A%84es5-es6%E5%86%99%E6%B3%95%E5%AF%B9%E7%85%A7%E8%A1%A8
