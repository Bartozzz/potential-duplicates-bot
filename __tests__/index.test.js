const damlev = require("../src/index").d;

test("Damerau–Levenshtein distance", () => {
  const tests = [
    ["", "", 0],
    ["yo", "", 2],
    ["", "yo", 2],
    ["yo", "yo", 0],
    ["tier", "tor", 2],
    ["saturday", "sunday", 3],
    ["mist", "dist", 1],
    ["tier", "tor", 2],
    ["kitten", "sitting", 3],
    ["stop", "tops", 2],
    ["rosettacode", "raisethysword", 8],
    ["mississippi", "swiss miss", 8]
  ];

  tests.forEach(v => expect(damlev(v[0], v[1])).toBe(v[2]));
});
