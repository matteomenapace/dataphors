### Data, data everywhere!

**Data** is immaterial and untangible, so it's described with [metaphors](http://dismagazine.com/discussion/73298/sara-m-watson-metaphors-of-big-data). Yet those metaphors are extractivist and industrial, pushed by those who control *big data*, rather than those who produce *small data* every day. 

Can we frame our relationship with data through different metaphors? 

To spark your imagination, new metaphors are deployed to your Twitter feed via *emojis* + famous *mis-quotes*.

For example:

```
#Data is the new 🎅
“Data has the right idea: visit people only once a year”
- Oscar Wilde
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

  * [x] Create the mis-quote by [selectively](https://github.com/GoogleCloudPlatform/google-cloud-node#google-cloud-natural-language-beta) replacing `query` with `data` in the sentence
  * [x] Check for both plural and singular of `query` (eg: `eyes` and `eye`)
  * [x] Check for past tense of verbs in `query` (eg: `love` and `loved`)
  * [x] If the misquote can't fit within a tweet, filter it out 
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