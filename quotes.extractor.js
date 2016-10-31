var clear = require('clear')(), // clear the console
    argv = require('minimist')(process.argv.slice(2)),
    testMode = argv.test || false,
    fileNames = testMode ? ['quotes.test.json'] : ['quotes.brainyquote.raw.json', 'quotes.goodreads.raw.json'],
    jsonfile = require('jsonfile'),
    quotesMap = {},
    query = '',
    maxLength = 83 // 118 // 118 characters (that's `#Data is the new 🎅` + `\n` + `""`) 

// to run this in testMode
// node quotes.extractor.js --test

fileNames.forEach(function(fileName)
{
  var json = jsonfile.readFileSync(fileName),
      quotes = json.results.quotes

  // loop through all quotes
  quotes.forEach(function(quote)
  {
    parseQuote(quote)
  })
})

function parseQuote(quote)
{
  // replace \n in keywords
  if (quote.keywords)
  {
    var keywords = quote.keywords
    keywords = keywords.replace(/(?:\r\n|\r|\n)/g,'')
    quote.keywords = keywords.toLowerCase()
  }

  // assign query in case the quote is missing it
  if (quote.query) query = quote.query.replace('Quotes About ','').toLowerCase()
  quote.query = query
  
  // sanitise the quote text
  var text = quote.text
  text = text.replace(/(U\.S\.)/gmi, 'US') // U.S. > US

  // split the text into sentences
  // http://stackoverflow.com/a/18914855/2928562
  var sentences = text.replace(/([.?!])\s*(?=[A-Z])/g, '$1|').split('|')
  // console.log(sentences)

  sentences.forEach(function(sentence)
  {
    parseSentence(sentence)
  })
}

function parseSentence(sentence)
{
  // don't bother if the sentece doesn't contain the query
  if (sentence.toLowerCase().indexOf(query) < 0) return

  // create misQuote by replacing query with 'data'
  var regex = new RegExp('\\b(' + query + ')\\b', 'gm')
  var misQuote = sentence.replace(regex, 'data')

  regex = new RegExp('\\b(' + toSentenceCase(query) + ')\\b', 'gm')
  misQuote = misQuote.replace(regex, 'Data')

  // check for plural -> 'datas'
  misQuote = misQuote.replace(/\b(datas)\b/gm, 'data')
  misQuote = misQuote.replace(/\b(Datas)\b/gm, 'Data')

  // check for 'an data'
  misQuote = misQuote.replace(/\b(an data)\b/gm, 'data')
  misQuote = misQuote.replace(/\b(an Data)\b/gm, 'Data')

  // check for 'a data'
  misQuote = misQuote.replace(/\b(a data)\b/gm, 'data')
  misQuote = misQuote.replace(/\b(a Data)\b/gm, 'Data')

  // commas ',' are special characters in Tracery grammars, dang!
  // using workaround https://github.com/galaxykate/tracery/issues/20 
  regex = new RegExp('(,)', 'gi')
  misQuote = misQuote.replace(regex, '‚')

  // colons are also special characters in Tracery grammars: dang!
  regex = new RegExp('(: )', 'gi')
  misQuote = misQuote.replace(regex, '：')
  // trying FULLWIDTH COLON Unicode: U+FF1A, UTF-8: EF BC 9A

  // trim + SentenceCase
  misQuote = misQuote.trim()
  misQuote = toSentenceCase(misQuote)

  // don't bother if mis-quote is longer than maxLength
  if (misQuote.length > maxLength) return

  // don't bother if mis-quote doesn't contain "data"
  if (misQuote.search(/(data)/gmi) < 0) return

  // console.log(misQuote.length + ' ' + quote.query + ' > ' + misQuote)

  addToQuotesMap(query, misQuote)
}

function toSentenceCase(string)
{
  return string.charAt(0).toUpperCase() + string.substring(1)
}

function addToQuotesMap(key, value)
{
  if (!quotesMap[key]) quotesMap[key] = []
  quotesMap[key].push(value)  
}

console.log(quotesMap)

// save to json
jsonfile.writeFileSync('quotes.map.json', quotesMap, {spaces: 2})