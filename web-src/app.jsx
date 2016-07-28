import React from 'react';
import ReactDOM from 'react-dom';
import WordsTest from './words-test';

ReactDOM.render(
    <div>
      <h1>
        Test your words have been learned
      </h1>
      <WordsTest />
    </div>,
    document.getElementById('words-test')
);
