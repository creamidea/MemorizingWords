"use strict";

import React from 'react';
import SubmitArticle from './submit-article';
import Fetch from './fetch';

const { Component } = React;

/**
 * File Object
 *   filename size date
 */
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

/**
 * Show Google Translation
 * Component: Translation
 * + Definitions
 * + Synonyms
 */
class Definitions extends Component {
  render () {
    let {data} = this.props, container = [];
    if (!data || data.length === 0) return (<div>-</div>);
    for (let [dIndex, d] of data.entries()) {
      let list = [];
      for (let [defIndex,def] of d[1].entries()) {
        list.push((
            <li key={defIndex}><p>{def[0]}</p><p style={{color: "#777"}}>{def[2]}</p></li>
        ));
      }
      container.push((
          <div key={dIndex}>
          <p>{d[0]}</p>
          <ul>{list}</ul>
          </div>
      ));
    }
    return (<div>{container}</div>);
  }
}
class Synonyms extends Component {
  render () {
    let {data} = this.props, container = [];
    if (!data || data.length === 0) return (<div>-</div>);
    for (let [dIndex, d] of data.entries()) {
      let list = [];
      for (var [sIndex, syn] of d[1].entries()) {
        list.push((
            <li key={sIndex}>{syn[0].join(', ')}</li>
        ));
      }
      container.push((
          <div key={dIndex}>
          <p>{d[0]}</p>
          <ul>{list}</ul>
          </div>
      ));
    }
    return (<div>{container}</div>);
  }
}
class Examples extends Component {
  render () {
    let {data} = this.props, container = [];
    if (!data || data.length === 0) return (<div>-</div>);
    for (let [eIndex, exm] of data[0].entries()) {
      container.push((<p key={eIndex}>{exm[0]}</p>));
    }
    return (
        <div>
        <button style={{marginBottom: "6px"}} className="btn btn-primary" data-toggle="collapse" href="#translate-examples" aria-expanded="false" aria-controls="translate-examples">See more.</button>
        <div className="collapse" id="translate-examples"><div className="well">{container}</div></div>
        </div>);
  }
}

class Translation extends React.Component {
  constructor (props) {
    super(props);
    this.state = {word: "", translation: [], display: 'none', marginTop: 0};
  }
  // @param translation array 15
  // 0: word && pos
  // 11: synonyms
  // 12: definitions
  // 13: more examples
  // 14: see also
  show (word, translation) {
    // console.log(`handle ${word} and ${translation}`);
    this.setState({word: word, translation: translation, display:'block', marginTop: $(document).scrollTop()});
  }

  hide () {
    this.setState({display: 'none'});
  }

  render () {
    let {word, translation, display, marginTop} = this.state;
    let word2, wordColor = "#777";
    if (translation.length === 0) return (<div></div>);
    let definitions = translation[12],
        synonyms    = translation[11],
        examples    = translation[13],
        seeAlso     = translation[14];
    // <div style={{width: "345px", position: "fixed", right: "4px"}}>
    if (definitions && definitions[0] && definitions[0][2]) {
      word2 = definitions[0][2];
      if (word2 !== word) {
        wordColor = "#D9534F";
        word = word2;
      }
    }

    return (
        <div style={{display: display, marginTop: marginTop - 168 + 'px', transition: "all 0.44s"}}>
        <p>一天不学习，浑身就难受。</p>
        <p>I prefer to die if I don't study at a day.</p>
        <div>
          <h3><span>Definitions of</span><span style={{color: wordColor}}> {word}</span></h3>
          <Definitions data={definitions}/>
        </div>
        <div>
          <h3>Synonyms</h3>
          <Synonyms data={synonyms}/>
        </div>
        <div>
          <h3>Examples</h3>
          <Examples data={examples}/>
        </div>
        <div>
          <h3>See Also</h3>
          <div>{seeAlso ? seeAlso[0].join(', ') : "-"}</div>
        </div>
      </div>
    );
  }
}

/**
 * Pronunciation
 * paly the pronunicaion audio
 */
class Pronunciation extends React.Component {
  constructor (props) {
    super(props);
    this.state = {playing: false};
  }
  play (word, source, e) {
    let p, elt = e.target;
    switch(source) {
    case "local":
      p = new Audio(`/reviews/words/${word}.mp3`);
      break;
    case "online":
      p = new Audio(`https://ssl.gstatic.com/dictionary/static/sounds/de/0/${this.props.word}.mp3`);
      break;
    }
    p.addEventListener('ended', ((elt) => {
      let top = $(elt).offset().top;
      $("html, body").stop().animate({scrollTop: top - 3}, '500', 'swing');
      this.setState({playing: false});
    }).bind(this, elt));
    p.addEventListener('error', (() => {
      let {online} = this.refs;
      this.setState({playing: false});
      online.disabled = true;
      online.innerHTML = "FAILD";
    }).bind(this));
    this.setState({playing: true});
    p.play();
  }
  render () {
    return (
        <div style={{display: "inline-block", marginRight: "10px"}} className="btn-group" role="group">
          <button type="button" className="btn btn-success" onClick={this.play.bind(this, this.props.word, 'local')} disabled={this.state.playing} tabIndex={this.props.tabindex}>&#x23f5;local</button>
          <button ref="online" type="button" className="btn btn-success" onClick={this.play.bind(this, this.props.word, 'online')} disabled={this.state.playing}>&#x23f5;online</button>
        </div>
    );
  }
}

/**
 * Show a question. There are some components below:
 * + button:paly button:DAFT
 * + word && POS
 * + translation
 */
class Topic extends Fetch(React.Component) {

  constructor (props) {
    super(props);
    this.state = {pos: "", translation: [],
                  fetching: false, refAnswerShowing: false,
                  btnDAFT: {text: 'DAFT', state: 'hide'}};
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
    this.fetch(`/reviews/words/${word}.txt`).then( ((text)=> {
      let d = eval(`(${text})`);
      let pos = d[0][1] && d[0][1].slice(-1)[0];
      this.setState({pos: pos, translation: d}); // TODO: memory leak?
      this.setState({refAnswerShowing: true, fetching: false});
    }).bind(this)).catch( (err) => {
      console.log(`translate error: ${err}`);
    });
  }

  // toggle the DAFT button (DAFT || HIDE)
  handleDAFT (e) {
    let btnDAFT = this.state.btnDAFT;
    if (btnDAFT.state === 'hide') {
      this.translate(this.props.word);
      this.setState({btnDAFT: {text: 'HIDE', state: 'show'}, refAnswerShowing: true});
      let top = $(e.target).offset().top;
      $("html, body").stop().animate({scrollTop: top - 3}, '500', 'swing');
    } else {
      this.setState({btnDAFT: {text: 'DAFT', state: 'hide'}, refAnswerShowing: false});
    }
  }

  handleClickWord (e) {
    e.preventDefault();
    const props = this.props;
    // callback
    if (typeof props.onClick === 'function') props.onClick(props.word, this.state.translation, e.target.offsetHeight);
  }

  render () {
    const state = this.state, props = this.props;
    let display = "none";
    if (this.state.refAnswerShowing) {
      display = "block";
    }
    return (
        <li style={{margin: "4px auto", listStyleType: "decimal-leading-zero"}}>
          <Pronunciation word={props.word} tabIndex={props.tabindex}/>
          <button onClick={this.answer.bind(this, 'y')} hidden>Yes</button>
          <button type="button" className="btn btn-danger" onClick={this.handleDAFT.bind(this)} disabled={state.fetching}>{state.btnDAFT.text}</button>
          <div style={{display: display}}>
            <h2 style={{margin: 0}}><a href="javascript:void(0)" onClick={this.handleClickWord.bind(this)}>{props.word}</a></h2>
            <p style={{margin: 0}}>/{state.pos}/</p>
          </div>
        </li>
    );
  }
}

/**
 * Components:
 * + Submit Words(article)
 * + Content(files)
 * + Topics(words)
 * + Translation Layout
 */
export default class WordsTest extends Fetch(React.Component) {
  constructor(props) {
    super(props);
    this.state = {topics: [], errorMsg: "", files: []};
  }

  // get the words list
  // show when click the filename(File)
  getWordsList (wordsList) {
    this.setState({topics: []});
    this.fetch(`/reviews/${wordsList}.txt`).then( (txt) => {
      let topics = this.state.topics;
      txt.split(/\r?\n/g).forEach((value, index) => {
        // remove comment && blank column
        if (value.startsWith('#')) return;
        if (/\w{2,}/.test(value))
          topics.push(<Topic key={index} word={value} answer={this.answer.bind(this)} tabIndex={index+1}
                      onClick={this.handleClickWord.bind(this)}/>);
      });
      this.setState({topics: topics, errorMsg: ""});
    }).catch( (err) => {
      this.setState({topics:[], errorMsg: `${err}`});
    });
  }
  // get the content or filenames you create
  getWordsListContent () {
    this.fetch(`/words-test/content`).then( ((files) => {
      if (typeof files === 'string') {
        this.setState({files: files});
        return;
      }
      let _d = [];
      for (let [index, file] of files.entries()) {
        let _f = file.split(/\s+/);
        let size = _f.shift();
        let filename = _f.pop();
        let date = _f.join(' ');
        _d.push(<File key={index} size={size} filename={filename} date={date} getWordsList={this.getWordsList.bind(this)}/>);
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

  // search form submit handler
  handleSubmit (e) {
    e.preventDefault();
    let wordsList = this.refs.wordsList.value.trim();
    if (!wordsList) {
      return;
    }
    this.getWordsList(wordsList);
  }
  // the callback of submiting article(words)
  handleSubmitArticle () {
    this.getWordsListContent();
  }
  // the callback of clicking the word to show the translation
  handleClickWord (word, translation, marginTop) {
    this.refs.translation.show(word, translation);
  }

  render () {
    let state = this.state;
    return (
        <div className="words-test">
          <SubmitArticle onSubmit={this.handleSubmitArticle.bind(this)}/>
          <form onSubmit={this.handleSubmit.bind(this)}>
            <label htmlFor="words-list">Which word-list do you want to test?</label>
            <input type="text" id="words-list" ref="wordsList"/>
            <button type="submit">Go</button>
          </form>
          <div style={{marginTop: "4px"}} className="row">
            <div className="col-md-3">
              <h2>Content</h2>
              <p>There are {state.files.length} files:</p>
              <ul>{state.files}</ul></div>
            <div className="col-md-3">
              <h2>Topics</h2>
              <p>There are {state.topics.length} words:</p>
              <ul>{state.topics}</ul></div>
            <div className="col-md-6"><Translation ref="translation"/></div>
          </div>
          <p>{state.errorMsg}</p>
          <div>
            <h2>Resources</h2>
            <a href="/resources/PhoneticSymbol.swf" target="_blank">PhoneticSymbol</a>
          </div>
        </div>
    );
  }
}

// http://bbs.reactnative.cn/topic/15/react-react-native-%E7%9A%84es5-es6%E5%86%99%E6%B3%95%E5%AF%B9%E7%85%A7%E8%A1%A8
