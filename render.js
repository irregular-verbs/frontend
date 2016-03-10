import ReactDOMServer from 'react-dom/server'
import React from 'react'
import fs from 'fs'

import WordList from './scripts/WordList'
import data from './scripts/data'

var template = fs.readFileSync( './static/index.html').toString(); //todo:toString - bad

var last = [0,0]

function dif() {
    var diff = process.hrtime(last);
    var nano = diff[0] * 10e9 + diff[1]
    var micro = Math.floor(nano / 1000)
    var result = `${micro / 1e6}`;
    last = process.hrtime()
    return result;
}

data.forEach(word => {
    const initialState = {
        currentWordId: word.id
    }
    console.log(`${word.id}: create element`, dif());
    var element = React.createElement(WordList, {initialState});
    console.log(`${word.id}: render html`, dif());
    const reactOutput = ReactDOMServer.renderToStaticMarkup(element)
    console.log(`${word.id}: put output to document`, dif());
    var serializeDocument = template.replace('<div id="react"></div>', '<div id="react">'+reactOutput+'</div>')
    console.log(`${word.id}: write`, dif());
    fs.writeFile(`./debug/${word.id}.html`, serializeDocument, (err) => {
        if (err) throw err;
        //console.log(`${word.id}: written`);
    })
})


//$ babel-node --presets es2015 render.js