"use strict";
/**
 * Copyright (c) 2016 Nikolai Mavrenkov <koluch@koluch.ru>
 *
 * Distributed under the MIT License (See accompanying file LICENSE or copy at http://opensource.org/licenses/MIT).
 *
 * Created: 08.03.2016 23:53
 */
import React from 'react'

import {h} from 'react-markup'

import Modal from './Modal'

export default React.createClass({

    renderWordForm: function(wordForm) {
        return h("div.word-modal__word-form", wordForm.map(variant => (
            h(`div.word-modal__word-variant`, {key:variant}, variant)
        )))
    },

    render: function () {
        const {word} = this.props

        return (
            h(Modal, {onClose:this.props.onClose},
                h('div.word-modal',
                    h('div.word-modal__field',
                        h('div.word-modal__title','Form 1'),
                        h('div.word-modal__value', this.renderWordForm(word.form1))
                    ),
                    h('div.word-modal__field',
                        h('div.word-modal__title','Form 2'),
                        h('div.word-modal__value', this.renderWordForm(word.form2))
                    ),
                    h('div.word-modal__field',
                        h('div.word-modal__title','Form 3'),
                        h('div.word-modal__value', this.renderWordForm(word.form3))
                    ),
                    h('div.word-modal__field',
                        h('div.word-modal__title','Form 4'),
                        h('div.word-modal__value', this.renderWordForm(word.form4))
                    ),
                    h('div.word-modal__field',
                        h('div.word-modal__title','S-form'),
                        h('div.word-modal__value', this.renderWordForm(word.sform))
                    ),
                    h('div.word-modal__field',
                        h('div.word-modal__title','Translation'),
                        h('div.word-modal__value',word.translation)
                    )

                )
            )
        )
    }
})