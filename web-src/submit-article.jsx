"use strict";

import React from 'react';
import Fetch from './fetch';

class Alert extends React.Component {
  constructor (props) {
    super(props);
    this.state = {display: 'none', text: props.text,
                  level: props.level || 'danger'};
  }

  show (text, level='danger') {
    this.setState({display: 'block', text: text, level: level});
  }

  render () {
    const state = this.state;
    let className = `alert alert-${state.level} alert-dismissible fade in`;

    return (
        <div className={className} role="alert" style={{display: state.display}}>
        <button type="button" className="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button>
        {state.text}
      </div>
    );
  }
}

export default class SubmitArticle extends Fetch(React.Component) {
  constructor (props) {
    super(props);
    this.state = {title: null, article: ""};
  }

  componentDidMount () {
    this.showAlert = this.refs.alert.show.bind(this.refs.alert);
  }

  handleSubmit (e) {
    e.preventDefault();
    const {title, article} = this.refs;
    if (!title.value || !article.value) {
      this.showAlert('Title or article cannot be null.');
      return;
    }
    this.fetch(`/words-test/words`, {method: 'POST', body: {title: title.value, article: article.value}}).then( (message) => {
      console.log(message);

    }).catch( (err) => {
      this.showAlert(`[submit]: ${err}`);
    });
    // callback
    this.props.onSubmit();
  }

  applyOrder (e) {
    e.preventDefault();
    let filename = this.refs.title.value;
    if (filename === "") {
      this.showAlert('Filename cannot be none.');
    }
    this.fetch(`/words-test/order/${filename}`).then( (stdout)=> {
      this.showAlert(stdout, 'info');
    }).catch( ((err) => {
      this.showAlert(`[apply order]: ${err}`);
    }).bind(this));
  }

  render () {
    const state = this.state;
    return (
        <div style={{width: '20%'}}>
        <Alert ref="alert"/>
        <form onSubmit={this.handleSubmit.bind(this)}>

        <div className="form-group">
          <label for="submit-article-title">Title</label>
          <input id="submit-article-title" type="text" className="title form-control" ref="title" value={state.title}/>
        </div>

        <div className="form-group">
          <label for="submit-article-article">Article</label>
          <textarea id="submit-article-article" className="article form-control" ref="article" rows={16}>{state.article}</textarea>
        </div>

        <button type="submit" className="btn btn-default" style={{marginRight: "5px"}}>Submit</button>
        <button className="btn btn-danger" onClick={this.applyOrder.bind(this)}>Pronunciation</button>

        </form>
        </div>
    );
  }
}
