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

import WordPopup from './WordPopup'

//todo: move to helpers
const flatten = (arrays) => arrays.reduce((acc,x) => {x.forEach(y => acc.push(y)); return acc}, [])

export default React.createClass({

    getInitialState: function() {
        const {initialState} = this.props
        return Object.assign({
            sortField: "top",
            sortDirection: 1,
            currentWordId: null
        }, initialState)
    },

    componentDidMount: function() {
        window.addEventListener('popstate', (historyStateRecord) => {
            this.replaceState(historyStateRecord.state)
        })
    },

    renderWordForm: function(data) {
        return h("div.word-list__word-form", data.map(variant => (
            h(`div.word-list__form-variant`, {key:variant.text}, variant.text)
        )))
    },

    renderTranslation: function(data) {
        return h("div.word-list__word-form", data.map(variant => (
            h(`div.word-list__form-variant`, {key:variant}, variant)
        )))
    },

    onHeaderClick: function(newField) {
        const {sortField,sortDirection} = this.state
        this.setState({
            sortField: newField,
            sortDirection: sortField === newField ? sortDirection * -1 : sortDirection
        })
    },

    onWordClick: function(wordId) {
        const {data} = this.props
        const wordSearch = data.filter(x => x.id === wordId)
        if(wordSearch.length > 0) {
            const word = wordSearch[0]
            this.setState({
                currentWordId: word.id
            }, () => {
                document.title = "Irregular verbs: “" + wordId + "”"
                window.history.pushState(this.state, wordId, "/" + wordId + ".html")
            })
        }
    },

    onCloseCurrentWordModal: function() {
        this.setState({
            currentWordId: null
        }, () => {
            document.title = "Irregular verbs"
            window.history.pushState(this.state, "Irregular verbs", "/")
        })
    },

    renderHeaderTitle: function(field, title) {
        const {sortField,sortDirection} = this.state
        const newTitle = title + ((field === sortField) ? (sortDirection > 0 ? "↓" : "↑") : "")
        return h("div.word-list__cell", {onClick:() => {this.onHeaderClick(field)}}, newTitle )
    },

    render: function () {
        const {data} = this.props
        const {sortField,sortDirection, currentWordId} = this.state

        const sortedData = data.slice().sort((x,y) => {
            let result = x[sortField] > y[sortField] ? 1 : x[sortField] < y[sortField] ? -1 : 0;
            result *= sortDirection
            return result
        })

        let currentWordModal = null
        if(currentWordId !== null) {
            const currentWord = data.filter(x => x.id === currentWordId);
            if(currentWord.length > 0) {
                currentWordModal = h(WordPopup, {word:currentWord[0],onClose:this.onCloseCurrentWordModal})
            }
        }

        return (
            h("div.word-list",
                currentWordModal,
                h("div.word-list__header",
                    this.renderHeaderTitle('top', "TOP"),
                    this.renderHeaderTitle('infinitive', "Infinitive (I)"),
                    this.renderHeaderTitle('past_simple', "Past Simple (II)"),
                    this.renderHeaderTitle('past_participle', "Past Participle (III)"),
                    this.renderHeaderTitle('translation', "Translation")
                ),
                flatten(sortedData.map((row,i) =>
                    row.meanings.map( (meaning,j) => (
                        h(`div`, {
                            key: row.id + "," + j,
                            onClick: () => this.onWordClick(row.id),
                            className: "word-list__row" + (i % 2 == 0 ? " word-list__row--even" : " word-list__row--odd")
                        },
`                            h("div.word-list__cell.word-list__cell-top", j === 0 ? row.top : ""),
                            h("div.word-list__cell.word-list__cell-infinitive", j === 0 ? this.renderWordForm(meaning.infinitive) : ""),
                            h("div.word-list__cell.word-list__cell-past-simple", this.renderWordForm(meaning.past_simple)),
                            h("div.word-list__cell.word-list__cell-past-participle", this.renderWordForm(meaning.past_participle)),
                            h("div.word-list__cell.word-list__cell-translation",  this.renderTranslation(meaning.translation))
                        )
                ))))
            )
        )
    }

})