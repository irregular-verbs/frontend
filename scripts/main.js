"use strict";
/**
 * Copyright (c) 2016 Nikolai Mavrenkov <koluch@koluch.ru>
 *
 * Distributed under the MIT License (See accompanying file LICENSE or copy at http://opensource.org/licenses/MIT).
 *
 * Created: 04.03.2016 22:18
 */
import ReactDOM from 'react-dom'
import {h1} from 'react-hyperscript-helpers'

document.addEventListener('DOMContentLoaded', () => {
    ReactDOM.render(
        h1("Hello world"),
        document.getElementById('react')
    )
});
