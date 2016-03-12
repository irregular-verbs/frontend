import ReactDOMServer from 'react-dom/server'
import React from 'react'
import fs from 'fs'

import WordList from './components/WordList'
import data from './data'

var template = fs.readFileSync( './static/index.html').toString(); //todo:toString - bad

function renderState(rootElement, props, fileName) {
    var element = React.createElement(rootElement, props);
    const reactOutput = ReactDOMServer.renderToStaticMarkup(element)
    var serializeDocument = template.replace('<div id="react"></div>', '<div id="react">'+reactOutput+'</div>')
    fs.writeFile(fileName, serializeDocument, (err) => {
        if (err) throw err;
    })
}

data.forEach(function(word)  {
    var props = {
        initialState: {
            currentWordId: word.id
        },
        data
    };
    var fileName = `./debug/${word.id}.html`;
    renderState(WordList, props, fileName)
})



//$ babel-node --presets es2015 render.js