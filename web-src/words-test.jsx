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
    for (var d of data) {
      let list = [];
      for (var def of d[1]) {
        list.push((
            <li><p>{def[0]}</p><p style={{color: "#777"}}>{def[2]}</p></li>
        ));
      }
      container.push((
          <div>
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
    for (var d of data) {
      let list = [];
      for (var syn of d[1]) {
        list.push((
            <li>{syn[0].join(', ')}</li>
        ));
      }
      container.push((
          <div>
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
    for (var exm of data[0]) {
      container.push((<p>{exm[0]}</p>));
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
    this.state = {word: "", translation: [], display: 'none'};

  }
  // @param translation array 15
  // 0: word && pos
  // 11: synonyms
  // 12: definitions
  // 13: more examples
  // 14: see also
  show (word, translation) {
    // console.log(`handle ${word} and ${translation}`);
    this.setState({word: word, translation: translation, display:'block'});
  }

  hide () {
    this.setState({display: 'none'});
  }

  render () {
    let {word, translation, display} = this.state;
    if (translation.length === 0) return (<div></div>);
    let definitions = translation[12],
        synonyms    = translation[11],
        examples    = translation[13],
        seeAlso     = translation[14];
    // <div style={{width: "345px", position: "fixed", right: "4px"}}>
    return (
        <div style={{display: display}}>
        <p>一天不学习，浑身就难受。</p>
        <p>I prefer to die if I don't study at a day.</p>
        <div>
          <h3><span>Definitions of</span> {word}</h3>
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
  play (word) {
    let p = new Audio(`/reviews/words/${word}.mp3`);
    let _this = this;
    p.addEventListener('ended', (() => {this.setState({playing: false});}).bind(this));
    this.setState({playing: true});
    p.play();
  }
  render () {
    return (
        <div style={{display: "inline-block", marginRight: "10px"}}>
          <button className="btn btn-success" onClick={this.play.bind(this, this.props.word)} disabled={this.state.playing} tabindex={this.props.tabindex}>&#x23f5;play</button>
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
class Topic extends Fetch(React.ComponentFetch) {

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
  handleDAFT () {
    let btnDAFT = this.state.btnDAFT;
    if (btnDAFT.state === 'hide') {
      this.translate(this.props.word);
      this.setState({btnDAFT: {text: 'HIDE', state: 'show'}, refAnswerShowing: true});
    } else {
      this.setState({btnDAFT: {text: 'DAFT', state: 'hide'}, refAnswerShowing: false});
    }
  }

  handleClickWord (e) {
    e.preventDefault();
    const props = this.props;
    // callback
    if (typeof props.onClick === 'function') props.onClick(props.word, this.state.translation);
  }

  render () {
    const state = this.state;
    let display = "none";
    if (this.state.refAnswerShowing) {
      display = "block";
    }
    return (
        <li style={{margin: "4px auto", listStyleType: "decimal-leading-zero"}}>
        <Pronunciation word={this.props.word} tabindex={this.props.tabindex}/>
        <button onClick={this.answer.bind(this, 'y')} hidden>Yes</button>
        <button type="button" className="btn btn-danger" onClick={this.handleDAFT.bind(this)} disabled={state.fetching}>{state.btnDAFT.text}</button>
        <div style={{display: display}}>
          <h2 style={{margin: 0}}><a href="javascript:void(0)" onClick={this.handleClickWord.bind(this)}>{this.props.word}</a></h2>
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
        if (/\w{2,}/.test(value))
          topics.push(<Topic word={value} answer={this.answer.bind(this)} tabindex={index+1}
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
  handleClickWord (word, translation) {
    this.refs.translation.show(word, translation);
  }

  render () {
    return (
        <div className="words-test">
        <form onSubmit={this.handleSubmit.bind(this)}>
          <label for="words-list">Which word-list do you want to test?</label>
          <input type="text" id="words-list" ref="wordsList"/>
          <button type="submit">Go</button>
        </form>
        <div style={{marginTop: "4px"}} className="row">
          <div className="col-md-2"><SubmitArticle onSubmit={this.handleSubmitArticle.bind(this)}/></div>
          <div className="col-md-3"><ul>{this.state.files}</ul></div>
          <div className="col-md-2"><ul>{this.state.topics}</ul></div>
          <div className="col-md-5"><Translation ref="translation"/></div>
        </div>
        <p>{this.state.errorMsg}</p>
        </div>
    );
  }
}

// http://bbs.reactnative.cn/topic/15/react-react-native-%E7%9A%84es5-es6%E5%86%99%E6%B3%95%E5%AF%B9%E7%85%A7%E8%A1%A8
