### Data, data everywhere!

**Data** is immaterial and untangible, so it's described with [metaphors](http://dismagazine.com/discussion/73298/sara-m-watson-metaphors-of-big-data). Yet those metaphors are extractivist and industrial, pushed by those who control *big data*, rather than those who produce *small data* every day. 

Can we frame our relationship with data through different metaphors? 

To spark your imagination, new metaphors are deployed to your Twitter feed via *emojis* + famous *mis-quotes*.

For example:

```
#Data is the new 🎅
"Data has the right idea - visit people only once a year"
```

## :hatching_chick: [@dataphors](https://twitter.com/@dataphors)

### Where is the data coming from?

Emoji data from [Unicode](http://www.unicode.org/emoji/charts/emoji-list.html)

Quotes data from [BrainyQuote](http://www.brainyquote.com), [GoodReads](https://www.goodreads.com/quotes), ~~[WikiQuotes](https://en.wikiquote.org/wiki/Main_Page),~~ [Sun-Tzu quotes](https://github.com/mattdesl/sun-tzu-quotes/blob/master/quotes.json) and [Shakespeare quotes](https://github.com/dariusk/corpora/blob/master/data/words/literature/shakespeare_phrases.json)

Mined with [Kimono](https://www.kimonolabs.com/) and Node.js

### TODO

- [x] Processing quotes

  Create a map object for (mis)quotes to be stored by their `query`  

  For each quote:

  * [x] Split `text` into sentences (`.?!`)
  * [x] If a sentence is longer than 118 characters (that's `#Data is the new 🎅` + `\n` + `""`), filter it out 
  * [ ] If the `query` (e.g. `Santa`, `face` or `cool`) is used as a *verb* in the sentence, filter it out (maybe with https://www.npmjs.com/package/node-stanford-postagger or https://cloud.google.com/natural-language?)
  * [x] Create the mis-quote by replacing `query` with `data` in the sentence
  * [x] Check for both plural and singular of `query` (eg: `eyes` and `eye`)
  * [x] Check for past tense of verbs in `query` (eg: `love` and `loved`)
  * [x] Add the mis-quote to the map object, with key set as `query`

- [x] Generating Tracery grammar, combining emojis and quotes

- [x] Add quotes from Goodreads

- [ ] Add wildcard quotes from Shakespeare and Sun-Tzu

- [x] Experiment: keep only the shorter mis-quotes

- [x] Experiment: include original quote authors?
  - [x] Need author from BrainyQuote

- [ ] Experiment: hashtag one or more (key) words in the mis-quote? 

##### Problematic misquotes

- `Where the hell is your data?" She shouts.`
- `This piece was too small for data‚ but it was just right for me.' \nBran laughed a little unsteadly. 'Mel.`