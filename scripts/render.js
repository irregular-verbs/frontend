import ReactDOMServer from 'react-dom/server'
import React from 'react'
import fs from 'fs'

import WordList from './components/WordList'
import data from './data'

function renderState(rootElement, stateIterable, templateFileName) {
    let template = fs.readFileSync( templateFileName ).toString(); //todo:toString - bad
    for(let {props,fileName} of stateIterable) {
        var element = React.createElement(rootElement, props);
        const reactOutput = ReactDOMServer.renderToStaticMarkup(element)
        var serializeDocument = template.replace('<div id="react"></div>', '<div id="react">'+reactOutput+'</div>')
        console.log(`write ${fileName}`);
        fs.writeFile(fileName, serializeDocument, (err) => {
            if (err) throw err;
        })
    }
}

function* generator(data) {
    for(let word of data) {
        var props = {
            initialState: {
                currentWordId: word.id
            },
            data
        };
        var fileName = `./debug/${word.id}.html`;
        yield {
            props,
            fileName
        }
    }
}

renderState(WordList, generator(data), './static/index.html')
//$ babel-node --presets es2015 ./scripts/render.js