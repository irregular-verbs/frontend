"use strict";
/**
 * Copyright (c) 2016 Nikolai Mavrenkov <koluch@koluch.ru>
 *
 * Distributed under the MIT License (See accompanying file LICENSE or copy at http://opensource.org/licenses/MIT).
 *
 * Created: 08.03.2016 23:53
 */
import React from 'react'

import {h,span} from 'react-markup'

import Modal from './Modal'

// do nothing for now
function deduplicateForms(wordFormList) {
    return wordFormList
}

export default React.createClass({

    renderField: function (title, children) {
        const {word} = this.props
        return h('div.word-modal__field',
            h('div.word-modal__title', title),
            h('div.word-modal__value',
                h('div.word-modal__word-form-list', children)
            )
        )
    },

    renderWordFormField: function (title, wordForm) {
        const {word} = this.props
        return this.renderField(title,
            deduplicateForms(word.meanings.map(meaning => meaning[wordForm])).map((wordForm, i) => (
                h("div.word-modal__word-form", {key:i},
                    h("div.word-modal__variant-list",
                        wordForm.map(variant => (
                            h(`div.word-modal__variant`, {key: variant.text},
                                h("div", variant.text),
                                h("div.word-modal__ipa", "[" + variant.ipa + "]")
                            )
                        ))
                    )
                )
            ))
        )
    },

    renderTranslations: function () {
        const {word} = this.props
        return this.renderField('Translation',
            word.meanings.map(meaning => meaning.translation).map((wordForm, i) => (
                h("div.word-modal__word-form", {key:i},
                    h("div.word-modal__variant-list",
                        wordForm.map(variant => (
                            h(`div.word-modal__variant`, {key: variant}, variant)
                        ))
                    )
                )
            ))
        )
    },


    render: function () {
        const {word} = this.props

        return (
            h(Modal, {onClose: this.props.onClose},
                h('div.word-modal',
                    this.renderWordFormField('Infinitive', 'infinitive'),
                    this.renderWordFormField('Past Simple', 'past_simple'),
                    this.renderWordFormField('Past Participle', 'past_participle'),
                    this.renderWordFormField('-ing form', 'ing'),
                    this.renderWordFormField('-s form', 'sform'),
                    this.renderTranslations()
                )
            )
        )
    }
})