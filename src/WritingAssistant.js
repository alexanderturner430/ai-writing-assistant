const natural = require('natural');
const nlp = require('compromise');
const Sentiment = require('sentiment');

class WritingAssistant {
  constructor() {
    this.tokenizer = new natural.WordTokenizer();
    this.sentiment = new Sentiment();
    this.spellcheck = new natural.Spellcheck();
  }

  analyze(text) {
    return {
      grammar: this.checkGrammar(text),
      style: this.analyzeStyle(text),
      tone: this.analyzeTone(text),
      sentiment: this.analyzeSentiment(text),
      suggestions: this.generateSuggestions(text)
    };
  }

  checkGrammar(text) {
    const doc = nlp(text);
    return {
      passiveVoice: doc.verbs().isPassive().out('array'),
      duplicateWords: this.findDuplicateWords(text),
      spellingErrors: this.checkSpelling(text)
    };
  }

  analyzeStyle(text) {
    const doc = nlp(text);
    return {
      sentenceCount: doc.sentences().length,
      wordCount: this.tokenizer.tokenize(text).length,
      readabilityScore: this.calculateReadability(text),
      complexWords: this.findComplexWords(text)
    };
  }

  analyzeTone(text) {
    const doc = nlp(text);
    return {
      formal: this.calculateFormalityScore(text),
      questions: doc.questions().length,
      statements: doc.statements().length,
      commands: doc.imperatives().length
    };
  }

  analyzeSentiment(text) {
    return this.sentiment.analyze(text);
  }

  generateSuggestions(text) {
    const suggestions = [];
    const doc = nlp(text);

    // Check for weak words
    const weakWords = doc.match('(very|really|things|stuff)').out('array');
    if (weakWords.length > 0) {
      suggestions.push({
        type: 'style',
        message: 'Consider replacing weak words with more specific alternatives',
        words: weakWords
      });
    }

    // Check sentence length
    const longSentences = doc.sentences().filter(s => s.words().length > 25).out('array');
    if (longSentences.length > 0) {
      suggestions.push({
        type: 'readability',
        message: 'Consider breaking down long sentences for better readability',
        sentences: longSentences
      });
    }

    return suggestions;
  }

  findDuplicateWords(text) {
    const words = this.tokenizer.tokenize(text);
    return words.filter((word, index) => words[index - 1] === word);
  }

  checkSpelling(text) {
    return this.tokenizer.tokenize(text)
      .filter(word => !this.spellcheck.isCorrect(word));
  }

  calculateReadability(text) {
    const words = this.tokenizer.tokenize(text);
    const sentences = nlp(text).sentences().length;
    return (words.length / sentences).toFixed(2);
  }

  findComplexWords(text) {
    return this.tokenizer.tokenize(text)
      .filter(word => word.length > 12);
  }

  calculateFormalityScore(text) {
    const formalWords = nlp(text).match('(therefore|moreover|consequently|thus)').length;
    const informalWords = nlp(text).match('(like|just|pretty|kind of)').length;
    return (formalWords - informalWords) / (formalWords + informalWords + 1);
  }
}

module.exports = WritingAssistant;
