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


function deduplicateForms(wordFormList) {
    var result = []
    for (let wordForm of wordFormList) {
        let exists = false;
        for (var existsWordForm of result) {
            if (existsWordForm.length === wordForm.length) {
                let allVariantsEquals = true;
                for (var i = 0; i < existsWordForm.length; ++i) {
                    if (existsWordForm[i].text !== wordForm[i].text
                        || existsWordForm[i].ipa !== wordForm[i].ipa) {
                        allVariantsEquals = false;
                        break
                    }
                }
                if (allVariantsEquals) {
                    exists = true;
                    break;
                }
            }
        }
        if (!exists) {
            result.push(wordForm)
        }
    }
    return result
}

export default React.createClass({

    renderWordForm: function (wordForm) {
        return (
            h("div.word-modal__word-form",
                h("div.word-modal__variant-list",
                    wordForm.map(variant => (
                        h(`div.word-modal__word-variant`, {key: variant.text}, variant.text + " [" + variant.ipa + "]")
                    ))
                )
            )
        )
    },

    renderTranslation: function (wordForm) {
        return (
            h("div.word-modal__word-form",
                h("div.word-modal__variant-list",
                    wordForm.map(variant => (
                        h(`div.word-modal__word-variant`, {key: variant}, variant)
                    ))
                )
            )
        )
    },

    renderWordFormField: function (title, wordForm) {
        const {word} = this.props
        return h('div.word-modal__field',
            h('div.word-modal__title', title),
            h('div.word-modal__value',
                h('div.word-modal__word-form-list',
                    deduplicateForms(word.meanings.map(meaning => meaning[wordForm])).map((wordForm, i) => (
                        this.renderWordForm(wordForm)
                    ))
                )
            )
        )
    },

    render: function () {
        const {word} = this.props

        return (
            h(Modal, {onClose: this.props.onClose},
                h('div.word-modal',
                    this.renderWordFormField('Form 1', 'form1'),
                    this.renderWordFormField('Form 2', 'form2'),
                    this.renderWordFormField('Form 3', 'form3'),
                    this.renderWordFormField('Form 4', 'form4'),
                    this.renderWordFormField('S-form', 'sform'),
                    h('div.word-modal__field',
                        h('div.word-modal__title', 'Translation'),
                        h('div.word-modal__value',
                            h('div.word-modal__word-form-list',
                                word.meanings.map(meaning => meaning.translation).map((wordForm, i) => (
                                    this.renderTranslation(wordForm)
                                ))
                            )
                        )
                    )
                )
            )
        )
    }
})