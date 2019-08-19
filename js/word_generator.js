
//object container that has the query parameter values
const requestObject = {
    apiLink:'https://api.wordnik.com/v4/words.json/randomWords?',
    key:'h685ijcht2bj8s57a0e7cbaorsz629w2yrw1z2cqwu8fuxi9h',
    minCorpus:2500,
    maxCorpus:-1,
    def:true,
    wordType:'verb',
    minDictionaryCount:1,
    maxDictionaryCount:-1,
    minLength:5,
    maxLength:11,
    wordLimit:20
};

 const url = requestObject.apiLink +
     'hasDictionaryDef=' + requestObject.def +
     '&includePartOfSpeech=' + requestObject.wordType +
     '&minCorpusCount=' + requestObject.minCorpus +
     '&maxCorpusCount=' + requestObject.maxCorpus +
     '&minDictionaryCount=' + requestObject.minDictionaryCount +
     '&maxDictionaryCount=' + requestObject.maxDictionaryCount +
     '&minLength=' + requestObject.minLength +
     '&maxLength=' + requestObject.maxLength +
     '&limit=' + requestObject.wordLimit +
     '&api_key=' + requestObject.key;

// get request to obtain the word from Wordnik
const wordData = fetch(url)
    .then(response => response.json())
    .then(data => data )
    .catch(() => alert('Server did not return any response, please refresh the page to fire a new request'));
