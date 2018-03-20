/**
 * Levenshtein distance (lev) is a string metric for measuring the diff between
 * two sequences. Informally, the Levenshtein distance between two words is the
 * minimum number of single-character edits required to change one word into the
 * other. A character-edit includes insertions, deletions and substitutions.
 *
 * Recursive implementation, as described in the Wikipedia article:
 * @see     https://en.wikipedia.org/wiki/Levenshtein_distance
 * @todo    AN iterative implementation would be a lot faster
 *
 * @param   {string}  i
 * @param   {string}  j
 * @return  {number}
 */
function lev(i, j) {
  if (i.length === 0) return j.length;
  if (j.length === 0) return i.length;

  return Math.min(
      lev(i.substr(1), j) + 1,
      lev(j.substr(1), i) + 1,
      lev(i.substr(1), j.substr(1)) + (i[0] !== j[0] ? 1 : 0)
  );
}

/**
 * Iterative implementation from:
 * @see     https://rosettacode.org/wiki/Levenshtein_distance#JavaScript
 *
 * @param   {string}  a
 * @param   {string}  b
 * @return  {number}
 */
function lev2(a, b) {
  let t = [], u, i, j, m = a.length, n = b.length;

  if (!m) { return n; }
  if (!n) { return m; }

  for (j = 0; j <= n; j++) { t[j] = j; }
  for (i = 1; i <= m; i++) {
    for (u = [i], j = 1; j <= n; j++) {
      u[j] = a[i - 1] === b[j - 1]
        ? t[j - 1]
        : Math.min(t[j - 1], t[j], u[j - 1]) + 1;
    }

    t = u;
  }

  return u[n];
}

/**
 * Compares two strings and returns how similar they are (in percentage).
 *
 * @param   {string}    stringA
 * @param   {string}    stringB
 * @param   {Function}  fun       Levenshtein distance to use
 * @return  {float}
 */
function similarity(stringA, stringB, fun = lev2) {
  const length = Math.max(stringA.length, stringB.length);
  const i = stringA.toLowerCase();
  const j = stringB.toLowerCase();

  if (length === 0)
    return 1.0;

  return (length - fun(i, j)) / length;
}

module.exports = robot => {
  robot.log('Yay, the app was loaded!')

  robot.on([
    'issues.opened',
    'issues.edited',
  ], async context => {
    const {title, number} = context.payload.issue;

    try {
      const response = await context.github.issues.getForRepo(context.repo());
      const issues = response.data.filter(i => i.number !== number);

      robot.log.debug('Issue number:', number);
      robot.log.debug('Issue title:', title);
      robot.log.debug('Other issues:', issues.map(i => i.title));

      for (const issue of issues) {
        console.time("similarity");
        const percentage = similarity(issue.title, title);
        console.timeEnd("similarity");

        robot.log(`${issue.title} ~ ${title} = ${percentage}%`);

        if (percentage >= 0.70) {
           return await markAsDuplicate(issue.number);
        }
      }
    } catch (error) {
      robot.log.fatal(error, 'Something went wrong!');
    }

    /**
     * Marks a functions as duplicate with a corresponding label and adds a
     * comment referencing the duplicated issue.
     *
     * @param   {number}  relatedIssue
     * @return  {Promise}
     */
    async function markAsDuplicate(relatedIssue) {
      await context.github.issues.addLabels(context.issue({
        labels: ['possible-duplicate']
      }));

      return await context.github.issues.createComment(context.issue({
        body: `Possible duplicate of #${relatedIssue}`
      }));
    }
  })
}
