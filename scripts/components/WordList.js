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
                    this.renderHeaderTitle('form1', "Form 1"),
                    this.renderHeaderTitle('form2', "Form 2"),
                    this.renderHeaderTitle('form3', "Form 3"),
                    this.renderHeaderTitle('form4', "Form 4"),
                    this.renderHeaderTitle('sform', "S-form"),
                    this.renderHeaderTitle('translation', "Translation")
                ),
                sortedData.map(row => (
                    h(`div`, {
                        key: row.id,
                        onClick: () => this.onWordClick(row.id),
                        className: "word-list__row" + (row.id === currentWordId ? " selected" : "")
                    },
                        h("div.word-list__cell.word__top", row.top),
                        h("div.word-list__cell.word__form1", this.renderWordForm(row.form1)),
                        h("div.word-list__cell.word__form2", this.renderWordForm(row.form2)),
                        h("div.word-list__cell.word__form3", this.renderWordForm(row.form3)),
                        h("div.word-list__cell.word__form4", this.renderWordForm(row.form4)),
                        h("div.word-list__cell.word__sform", this.renderWordForm(row.sform)),
                        h("div.word-list__cell.word__translation", row.translation)
                    )
                ))
            )
        )
    }

})