import ReactDOMServer from 'react-dom/server'
import React from 'react'
import fs from 'fs'

import WordList from './scripts/WordList'

import jsdom from 'jsdom'

jsdom.env(
  './static/index.html',
  [],
  function (err, window) {
      const reactOutput = ReactDOMServer.renderToString(React.createElement(WordList))
      window.document.getElementById('react').innerHTML =  reactOutput
      fs.writeFileSync("./debug/output.html",  window.document.documentElement.outerHTML)
  }
);

//$ babel-node --presets es2015 render.js