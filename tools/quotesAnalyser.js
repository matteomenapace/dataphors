var clear = require('clear')(), // clear the console
    async = require('async'),
    jsonfile = require('jsonfile'),
    argv = require('minimist')(process.argv.slice(2)),
    testMode = argv.test || false,
    fileNames = testMode ? ['quotes.test.json'] : [/*'quotes.brainyquote.raw.json',*/ 'quotes.goodreads.raw.json'],
    folder = '../data/',
    gcloud = require('google-cloud'),
    language = gcloud.language,
    keyFilename = 'dataphors-6247d388d1d4.json',
    projectId = 'dataphors',
    languageClient = language({ projectId: projectId, keyFilename: keyFilename }),
    query = '',
    annotatedQuotes = []

// to run this in testMode
// node quotesAnalyser.js --test

fileNames.forEach(function(fileName)
{
  var json = jsonfile.readFileSync(folder + fileName),
      quotes = json.results.quotes

  // loop through all quotes using async
  async.eachOfSeries(quotes, function(quote, index, nextItem) 
  {
    console.log('Parsing ' + (index+1) + '/' + quotes.length)
    parseQuote(quote, nextItem)
  },
  function(err)
  {
    if (err) console.error('Failed to process > ' + quote.text)
    else writeJSON() // done
  })
})

function parseQuote(quote, nextItem)
{
  // assign query in case the quote is missing it
  if (quote.query) query = quote.query.replace('Quotes About ','').toLowerCase()
  quote.query = query

  // remove testing notes
  delete quote.testCase

  // ask Google 
  var document = languageClient.document(quote.text)
  document.annotate(function(err, result) 
  {
    if(!err)
    {
      // console.log(result)
      quote.sentiment = result.sentiment
      quote.entities = result.entities
      quote.language = result.language
      quote.tokens = {} 

      var lastIndex = 0
      result.tokens.forEach(function(token)
      {
        // key will be the index of token in the quote text
        // then, when analysing the quote text, we will be able to easily retrieve the token for it
        // see http://stackoverflow.com/questions/2295657/return-positions-of-a-regex-match-in-javascript 
        var key = quote.text.indexOf(token.text, lastIndex)
        lastIndex = key // update lastIndex to avoid overriding tokens

        quote.tokens[key] = 
        { 
          text:token.text, 
          pos:token.partOfSpeechTag 
        }
      })

      annotatedQuotes.push(quote)
    }
    else console.error(err) 

    nextItem() // parse the next quote :) 
  })
}

function writeJSON()
{
  var path = folder
  path += (testMode) ? 'quotes.test.annotated.json' : 'quotes.annotated.json'

  // to keep the data structure consistend with what Kimono outputs...
  var json = 
  {
    name: 'Annotated Quotes',
    results:
    {
      quotes: annotatedQuotes
    }
  }

  jsonfile.writeFileSync(path, json, {spaces: 2})
  console.log('\nDone! ' + path)
}