/**
 * Copyright (c) 2016 Nikolai Mavrenkov <koluch@koluch.ru>
 *
 * Distributed under the MIT License (See accompanying file LICENSE or copy at http://opensource.org/licenses/MIT).
 *
 * Created: 08.03.2016 21:31
 */
"use strict";
import React from 'react'

import {h} from 'react-markup'

export default React.createClass({

    onClose: function(e) {
        console.log(e.target);
        if(e.target === this.refs.root && this.props.onClose) {
            this.props.onClose()
        }
    },

    render: function () {
        return (
            h("div.modal", {onClick: this.onClose, ref:"root"},
                h("div.modal__content",
                    this.props.children
                )
            )
        )
    }

})