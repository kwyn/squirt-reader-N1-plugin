import { expect } from 'chai';
import _ from 'lodash';
import SquirtParser from './../lib/squirt-parser';
import fs from 'fs';
const ipsumhtml = fs.readFileSync('resources/loremipsum.html', 'UTF-8');
let parser = {};

describe('SquirtParser', () => {
  beforeEach(() => {
    parser = new SquirtParser();
  });
  it('should return a promise', (done) => {
    const promise = parser.parse(ipsumhtml);
    expect(promise).to.exist;
    promise.then((text) => {
      console.log(text);
      done();
    }).catch((error) => {
      console.error(error);
      done();
    });
  });
  describe('._getORPIndex', () => {
    it('should return appropriate index for given words', () => {
      expect(parser._getORPIndex('foo')).to.equal(1);
      expect(parser._getORPIndex('')).to.equal(0);
      expect(parser._getORPIndex('bar;')).to.equal(1);
      expect(parser._getORPIndex('bar;\n')).to.equal(1);
      expect(parser._getORPIndex('testing')).to.equal(2);
    });
  });
  describe('._buildNode', () => {
    it('Should buidl appropriate node objects for a given long word', () => {
      const expected = [{ start: 'te', ORP: 's', end: 'ting', length: 'testing'.length, word: 'testing' }];
      expect(parser._buildNode([], 'testing')).to.deep.equal(expected);
    });
    it('should handle single letters', () => {
      const expected = [{ start: '', ORP: 'I', end: '', length: 1, word: 'I' }];
      expect(parser._buildNode([], 'I')).to.deep.equal(expected);
    });
  });

  describe('.buildNodes', () => {
    it('sould build appropriate nodes for given string', () => {
      const testText = 'I love testing';
      const expectedNodes = [
        {
          word: '3',
          start: '',
          ORP: '3',
          end: '',
          length: 1,
        },
        {
          word: '2',
          start: '',
          ORP: '2',
          end: '',
          length: 1,
        },
        {
          word: '1',
          start: '',
          ORP: '1',
          end: '',
          length: 1,
        },
        {
          word: 'I',
          start: '',
          ORP: 'I',
          end: '',
          length: 1,
        },
        {
          word: 'love',
          start: 'l',
          ORP: 'o',
          end: 've',
          length: 4,
        },
        {
          word: 'testing',
          start: 'te',
          ORP: 's',
          end: 'ting',
          length: 7,
        },
      ];
      const nodes = parser.buildNodes(testText);
      expect(nodes).to.deep.equal(expectedNodes);
    });
  });

  describe('._text2Words', () => {
    it('should create an array of strings', (done) => {
      const promise = parser.parse(ipsumhtml);
      promise.then((text) => {
        const words = parser._text2Words(text);
        expect(words).to.be.an.instanceof(Array);
        expect(_.sample(words)).to.be.a('string');
        done();
      })
      .catch((error) => {
        console.error(error);
        done();
      });
    });
  });
});
