const excludes = require('./dictionaries/excluded')

/**
 * Removes common words from a given phrase for faster and more accurate
 * results.
 *
 * @param   {string}  phrase
 * @return  {string}
 */
function preparePhrase (phrase) {
  phrase = phrase.toLowerCase()

  // Basic punctuation:
  phrase = phrase.replace(', ', ' ')
  phrase = phrase.replace(' - ', ' ')
  phrase = phrase.replace('. ', ' ')

  for (const exclude of excludes) {
    phrase = phrase.replace(new RegExp(`${exclude} `, 'g'), '')
  }

  return phrase
}

/**
 * The Damerau–Levenshtein distance between two words is the minimum number of
 * operations (consisting of insertions, deletions or substitutions of a single
 * character, or transposition of two adjacent characters) required to change
 * one word into the other.
 *
 * @see     https://en.wikipedia.org/wiki/Levenshtein_distance
 * @see     https://en.wikipedia.org/wiki/Damerau%E2%80%93Levenshtein_distance
 * @see     https://rosettacode.org/wiki/Levenshtein_distance#JavaScript
 *
 * @param   {string}  a
 * @param   {string}  b
 * @return  {number}
 */
function d (a, b) {
  const [al, bl] = [a.length, b.length]
  const matrix = []

  if (a === b) return 0
  if (!al) return bl
  if (!bl) return al

  for (let i = 0; i <= al; i++) {
    matrix[i] = []
    matrix[i][0] = i
  }

  for (let j = 0; j <= bl; j++) {
    matrix[0][j] = j
  }

  for (let i = 1; i <= al; i++) {
    for (let j = 1; j <= bl; j++) {
      let cost = a[i - 1] === b[j - 1] ? 0 : 1

      matrix[i][j] = Math.min(
        matrix[i - 1][j + 0] + 1,   // deletion
        matrix[i + 0][j - 1] + 1,   // insertion
        matrix[i - 1][j - 1] + cost // substitution
      )

      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
        matrix[i][j] = Math.min(
          matrix[i + 0][j + 0],
          matrix[i - 2][j - 2] + cost // transposition
        )
      }
    }
  }

  return matrix[al][bl]
}

/**
 * Compares two strings and returns how similar they are (in percentage).
 *
 * @param   {string}    i
 * @param   {string}    j
 * @return  {float}
 */
function similarity (i, j) {
  const length = Math.max(i.length, j.length)

  if (length === 0) { return 1.0 }

  return (length - d(i, j)) / length
}

/**
 * Compares two phrases and returns how similar they are (in percentage).
 *
 * @param   {string}  phraseA
 * @param   {string}  phraseB
 * @return  {float}
 */
function compare (phraseA, phraseB) {
  let wordsA = preparePhrase(phraseA).split(' ')
  let wordsB = preparePhrase(phraseB).split(' ')
  let sumOfProbs = 0

  // To be sure that A contains less words than B:
  if (wordsA.length > wordsB.length) { [wordsA, wordsB] = [wordsB, wordsA] }

  for (const wordA of wordsA) {
    const temp = []
    for (const wordB of wordsB) {
      temp.push(similarity(wordA, wordB))
    }

    sumOfProbs += Math.max.apply(null, temp)
  }

  return sumOfProbs / wordsA.length
}

module.exports = robot => {
  robot.log('Yay, the app was loaded!')

  robot.on([
    'issues.opened',
    'issues.edited'
  ], async context => {
    const {title, number} = context.payload.issue

    try {
      const response = await context.github.issues.getForRepo(context.repo())
      const issues = response.data.filter(i => i.number !== number)

      for (const issue of issues) {
        console.time('compare')
        const percentage = compare(issue.title, title)
        console.timeEnd('compare')

        robot.log(`${issue.title} ~ ${title} = ${percentage}%`)

        if (percentage >= 0.60) {
          return await markAsDuplicate(issue.number)
        }
      }
    } catch (error) {
      robot.log.fatal(error, 'Something went wrong!')
    }

    /**
     * Marks a functions as duplicate with a corresponding label and adds a
     * comment referencing the duplicated issue.
     *
     * @param   {number}  relatedIssue
     * @return  {Promise}
     */
    async function markAsDuplicate (relatedIssue) {
      await context.github.issues.addLabels(context.issue({
        labels: ['possible-duplicate']
      }))

      return await context.github.issues.createComment(context.issue({
        body: `Possible duplicate of #${relatedIssue}`
      }))
    }
  })
}

module.exports.d = d
