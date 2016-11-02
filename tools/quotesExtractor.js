var clear = require('clear')(), // clear the console
    argv = require('minimist')(process.argv.slice(2)),
    testMode = argv.test || false,
    fileNames = testMode ? ['quotes.test.annotated.json'] : ['quotes.goodreads.annotated.json', 'quotes.brainyquote.annotated.json'],
    folder = '../data/',
    jsonfile = require('jsonfile'),
    quotesMap = {},
    query = '',
    maxLength = 115 // 115 characters (that's 140 - `#Data is the new 🎅` + `\n` + `“”` + `\n- `) 

// to run this in testMode
// node quotesExtractor.js --test

fileNames.forEach(function(fileName)
{
  var json = jsonfile.readFileSync(folder + fileName),
      quotes = json.results.quotes

  // loop through all quotes
  quotes.forEach(function(quote)
  {
    parseQuote(quote)
  })
})

function parseQuote(quote)
{
  // assign query in case the quote is missing it
  if (quote.query)
  {
    query = quote.query.replace('Quotes About ','') // from GoodReads
    query = query.toLowerCase()
  }
  quote.query = query

  // don't bother if text doesn't contain query
  var regex = new RegExp(query, 'gmi')
  if (quote.text.search(regex) < 0) return
  
  // generate misquote
  var misquote = generateMisquote(quote)

  // sanitise 
  misquote = sanitise(misquote)

  // add quote marks
  misquote = '“' + misquote + '”' 
    
  // add author
  misquote += '\\\n- ' + quote.author
  

  // don't bother if misquote is longer than maxLength
  if (misquote.length > maxLength) return

  // don't bother if misquote doesn't contain "data"
  if (misquote.search(/(data)/gmi) < 0) return

  // console.log(misquote.length + ' ' + quote.query + ' > ' + misquote)

  addToQuotesMap(query, misquote)

  /*
  // split misquote into sentences
  // http://stackoverflow.com/a/18914855/2928562
  var sentences = misquote.replace(/([.?!])\s*(?=[A-Z])/g, '$1|').split('|')
  // console.log(sentences)

  sentences.forEach(function(sentence)
  {
    var misquote = '“' + sentence + '”' 
    
    // add author
    misquote += '\\\n- ' + quote.author
    
    // don't bother if misquote is longer than maxLength
    if (misquote.length > maxLength) return

    // don't bother if misquote doesn't contain "data"
    if (misquote.search(/(data)/gmi) < 0) return

    // console.log(misquote.length + ' ' + quote.query + ' > ' + misquote)

    addToQuotesMap(query, misquote)
  })*/
}

function sanitise(string)
{
  // U.S. > US
  string = string.replace(/(U\.S\.)/gmi, 'US') 

  // “ ” " '
  string = string.replace(/["“”]/gm, '\'')

  // commas ',' are special characters in Tracery grammars, dang!
  // using workaround https://github.com/galaxykate/tracery/issues/20 
  regex = new RegExp('(,)', 'gi')
  string = string.replace(regex, '‚')

  // colons are also special characters in Tracery grammars: dang!
  regex = new RegExp('(: )', 'gi')
  string = string.replace(regex, '：')
  // FULLWIDTH COLON Unicode: U+FF1A, UTF-8: EF BC 9A

  return string
}

// generate misquote
function generateMisquote(quote)
{
  var misquote = ''

  console.log('\n' + quote.text)

  // selectively replace query with 'data'

    var lastIndex = 0,
        regex = new RegExp('\\b(' + quote.query + ')\\b', 'gmi')
    
    // see http://stackoverflow.com/a/2295681/2928562
    while ((match = regex.exec(quote.text)) != null) 
    {
      var index = match.index,
          token = quote.tokens[index],
          text = (token) ? token.text : undefined,
          pos = (token) ? token.pos : undefined

      console.log(quote.query + ' found at ' + index + ' > ' + pos)

      // don't replace query if it's not a NOUN
      // if (pos !== 'NOUN')  
      // don't replace query if it's a VERB
      if (pos == 'VERB')
      {
        misquote += quote.text.substring(lastIndex, index + quote.query.length)
      }
      else
      {
        var data = isSentenceCase(text) ? 'Data' : 'data'
        misquote += quote.text.substring(lastIndex, index) + data
      } 
      // update lastIndex
      lastIndex = index + quote.query.length
    }
    // add the last bit of the quote
    misquote += quote.text.substring(lastIndex)
  

  // check for plural -> 'datas'
  misquote = misquote.replace(/\b(datas)\b/gm, 'data')
  misquote = misquote.replace(/\b(Datas)\b/gm, 'Data')

  // check for 'an data'
  misquote = misquote.replace(/\b(an data)\b/gm, 'data')
  misquote = misquote.replace(/\b(an Data)\b/gm, 'Data')

  // check for 'a data'
  misquote = misquote.replace(/\b(a data)\b/gm, 'data')
  misquote = misquote.replace(/\b(a Data)\b/gm, 'Data')

  // trim + SentenceCase
  misquote = misquote.trim()
  misquote = toSentenceCase(misquote)

  console.log(misquote)

  return misquote
}

function isSentenceCase(string)
{
  if (!string) return false
  return (string[0].toUpperCase() === string[0])
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

// console.log(quotesMap)

// save to json
var path = folder + 'quotes.map.json'
jsonfile.writeFileSync(path, quotesMap)
console.log('\nDone! ' + path)