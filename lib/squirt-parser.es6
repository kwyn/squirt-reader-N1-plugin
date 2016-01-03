const Readability = require('readabilitySAX').Readability;
const Parser = require('htmlparser2/lib/Parser.js');
import _ from 'lodash';

export default class SquirtParser {
  constructor() {
  }

  parse(html) {
    const readbilityConfig = { type: 'text' };
    return new Promise((resolve, reject) => {
      if (! _.isString(html)) {
        reject(new Error('Empty Email'));
        return;
      }
      const readbaility = new Readability(readbilityConfig);
      const parser = new Parser(readbaility, {});
      parser.write(html);
      const article = readbaility.getArticle();
      if (!_.isString(article.text) || article.text.length === 0) {
        reject(new Error('No Article Text Found'));
        return;
      }
      resolve(article.text);
    });
  }

  _text2Words(text) {
    return text
      .replace(/[\,\.\!\:\;](?![\"\'\)\]\}])/g, '$& ')
      .split(/[\s]+/g)
      .filter((word) => { return word.length; });
  }

  _buildNode(nodes, word) {
    if (word.length === 1) {
      nodes.push({
        word,
        ORP: word,
        start: ' ',
        end: ' ',
        length: word.length,
      });
      return nodes;
    }
    const ORP = this._getORPIndex(word);
    nodes.push({
      word,
      ORP: word[ORP] || ' ',
      start: word.slice(0, ORP),
      end: word.slice(ORP + 1) || ' ',
      length: word.length,
    });
    return nodes;
  }

  // Optimal Regonition Point Calculation
  _getORPIndex(word) {
    const punctuation = ',.?!:;';
    if (!_.isString(word)) {
      return 0;
    }
    // find last meaninful character
    let length = word.length;
    let lastChar = word[word.length - 1];
    if (lastChar === '\n') {
      length--;
      lastChar = word[word.length - 2];
    }
    if (_.contains(punctuation, lastChar)) length--;
    // Edge case ORP for short words
    if (length <= 1) return 0;
    if (length === 2 || length === 3) return 1;
    // Standard ORP Calclation
    // letter just to the left of center
    return Math.floor(length / 2 - 1);
  }

  buildNodes(text) {
    const startSequence = '3\n 2\n 1\n ';
    const cleanedText = startSequence + text.trim('\n').replace(/\s+\n/g, '\n');
    const words = this._text2Words(cleanedText);
    return _.reduce(words, this._buildNode.bind(this), []);
  }

}
