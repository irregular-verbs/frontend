"use strict";
/**
 * Copyright (c) 2016 Nikolai Mavrenkov <koluch@koluch.ru>
 *
 * Distributed under the MIT License (See accompanying file LICENSE or copy at http://opensource.org/licenses/MIT).
 *
 * Created: 04.03.2016 22:18
 */
import React from 'react'
import ReactDOM from 'react-dom'
import {h} from 'react-markup'
import data from './data'

import WordList from './components/WordList'

document.addEventListener('DOMContentLoaded', () => {

    let currentWordId = window.location.pathname.substr(1).replace(/\.html$/, "")
    currentWordId = currentWordId !== "" ? currentWordId : null

    const initialState = {currentWordId}

    ReactDOM.render(
        h(WordList, {data, initialState}),
        document.getElementById('react')
    )
});
