const distance = require('../src/index').distance
const compare = require('../src/index').compare
const prepare = require('../src/index').prepare

test('Preparing phrase', () => {
  const tests = [
    ['Hello World', 'hello world'],
    ['Basic, punct. should - be removed.. ', 'basic punct should be removed '],
    ['the excluded words and stuff', 'excluded words stuff'],
    ['application console terminal empty unfilled starter', 'app cli cli null null module']
  ]

  tests.forEach(v => expect(prepare(v[0])).toBe(v[1]))
})

test('Comparing phrases', () => {
  const tests = [
    [true, 'testing issues', 'isues testin'],
    [true, 'Basic example of issue duplicate', 'A basic example of an issue duplicate'],
    [true, 'Console is empty when creating a new app with utility module', 'When creating an app with the starter, the terminal is blank'],
    [true, 'Application module causes an error in the console when array unfilled', 'a error in the terminal is thrown on empty array when using app starter'],
    [false, 'this is not a duplicate', 'should not be marked at all'],
    [false, 'Lorem ipsum dolor sit amet', 'consectetur adipiscing elit']
  ]

  tests.forEach(v => expect(compare(v[1], v[2]) > 0.60).toBe(v[0]))
})

test('Damerau–Levenshtein distance', () => {
  const tests = [
    ['', '', 0],
    ['yo', '', 2],
    ['', 'yo', 2],
    ['yo', 'yo', 0],
    ['tier', 'tor', 2],
    ['saturday', 'sunday', 3],
    ['mist', 'dist', 1],
    ['tier', 'tor', 2],
    ['kitten', 'sitting', 3],
    ['stop', 'tops', 2],
    ['rosettacode', 'raisethysword', 8],
    ['mississippi', 'swiss miss', 8]
  ]

  tests.forEach(v => expect(distance(v[0], v[1])).toBe(v[2]))
})
