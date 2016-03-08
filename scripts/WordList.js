"use strict";
/**
 * Copyright (c) 2016 Nikolai Mavrenkov <koluch@koluch.ru>
 *
 * Distributed under the MIT License (See accompanying file LICENSE or copy at http://opensource.org/licenses/MIT).
 *
 * Created: 05.03.2016 17:51
 */
import React from 'react'

import {h} from 'react-markup'


export default React.createClass({

    renderForm: function(data) {
        return h("div.word-list__word-form", data.map(variant => (
            h(`div.word-list__form-variant`, {key:variant}, variant)
        )))
    },

    render: function () {
        const {data} = this.props;

        return (
            h("div.word-list",
                h("div.word-list__header",
                    h("div.word-list__cell", "TOP"),
                    h("div.word-list__cell", "Form 1"),
                    h("div.word-list__cell", "Form 2"),
                    h("div.word-list__cell", "Form 3"),
                    h("div.word-list__cell", "Form 4"),
                    h("div.word-list__cell", "S-form"),
                    h("div.word-list__cell", "Translation")
                ),
                data.map(row => (
                    h(`div.word-list__row`, {key: row.top},
                        h("div.word-list__cell.word__top", row.top),
                        h("div.word-list__cell.word__form1", this.renderForm(row.form1)),
                        h("div.word-list__cell.word__form2", this.renderForm(row.form2)),
                        h("div.word-list__cell.word__form3", this.renderForm(row.form3)),
                        h("div.word-list__cell.word__form4", this.renderForm(row.form4)),
                        h("div.word-list__cell.word__sform", this.renderForm(row.sform)),
                        h("div.word-list__cell.word__translation", row.translation)
                    )
                ))
            )
        )
    }
})