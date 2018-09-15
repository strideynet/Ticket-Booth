let generateQuote = require('../helpers/generate-quote')

let dobs = {
  u5: '2016-03-03',
  u18: '2006-04-04',
  adult: '1980-05-05'
}

let testCases = {
  '2 adults, 2 u18s': {
    input: {
      u5: 0,
      u18: 2,
      adult: 2
    },
    output: {
      u5: 0,
      u18: 0,
      adult: 0,
      family: 1
    }
  },
  '4 adults, 2 u18s': {
    input: {
      u5: 0,
      u18: 2,
      adult: 4
    },
    output: {
      u5: 0,
      u18: 0,
      adult: 2,
      family: 1
    }
  },
  '2 adults, 4 u18s': {
    input: {
      u5: 0,
      u18: 4,
      adult: 2
    },
    output: {
      u5: 0,
      u18: 2,
      adult: 0,
      family: 1
    }
  },
  '2 adults, 2 u18s, 2u5s': {
    input: {
      u5: 2,
      u18: 2,
      adult: 2
    },
    output: {
      u5: 2,
      u18: 0,
      adult: 0,
      family: 1
    }
  },
  '2 adults, 4 u18s, 2u5s': {
    input: {
      u5: 2,
      u18: 4,
      adult: 2
    },
    output: {
      u5: 2,
      u18: 2,
      adult: 0,
      family: 1
    }
  },
  '2 adults, 1u18, 1u5': {
    input: {
      u5: 1,
      u18: 1,
      adult: 2
    },
    output: {
      u5: 0,
      u18: 0,
      adult: 0,
      family: 1
    }
  }
}

for (let key in testCases) {
  let testCase = testCases[key]

  test(key, () => {
    let inputArray = []

    for (let type in testCase.input) {
      for (let i = 0; i < testCase.input[type]; i++) {
        inputArray.push({dob: dobs[type]})
      }
    }

    let result = generateQuote(inputArray)

    for (let type in testCase.output) {
      expect(result.ticketsSorted[type].length).toBe(testCase.output[type])
    }
  })
}
