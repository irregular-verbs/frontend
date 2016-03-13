"use strict"
/**
 * Copyright (c) 2016 Nikolai Mavrenkov <koluch@koluch.ru>
 *
 * Distributed under the MIT License (See accompanying file LICENSE or copy at http://opensource.org/licenses/MIT).
 *
 * Created: 05.03.2016 17:32
 */
import ReactDOMServer from 'react-dom/server'
import React from 'react'
import fs from 'fs'

import WordList from './components/WordList'
import data from './data'

export function renderState(rootElement, stateIterable, templateFileName) {
    let template = fs.readFileSync( templateFileName ).toString(); //todo:toString - bad
    for(let {props,fileName} of stateIterable) {
        var element = React.createElement(rootElement, props);
        const reactOutput = ReactDOMServer.renderToStaticMarkup(element)
        var serializeDocument = template.replace('<div id="react"></div>', '<div id="react">'+reactOutput+'</div>')
        fs.writeFile(fileName, serializeDocument, (err) => {
            if (err) throw err;
        })
    }
}

//$ babel-node --presets es2015 ./scripts/render.js