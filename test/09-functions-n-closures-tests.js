function willYouMarryMe(isPositiveAnswer) {
  return new Promise((resolve, reject) => {
    if (!isPositiveAnswer || typeof isPositiveAnswer !== 'boolean') reject();
    resolve(isPositiveAnswer);
  })
    .then((value) => (value ? 'Hooray!!! She said "Yes"!' : 'Oh no, she said "No".'))
    .catch(() => { throw new Error('Wrong parameter is passed! Ask her again.'); });
}


const answer1 = willYouMarryMe(true);
const answer2 = willYouMarryMe(false);
const answers = [
  willYouMarryMe(),
  willYouMarryMe(null),
  willYouMarryMe(NaN),
  willYouMarryMe(''),
  willYouMarryMe(1),
  willYouMarryMe('Yes'),
  willYouMarryMe({}),
];

const messages = [];
const defaultRejectionMessage = new Error('Promise should be rejected with an Error!');

console.log(
  answer1 instanceof Promise && answer2 instanceof Promise,
  'willYouMarryMe should return Promise!',
);

// answer 1
answer1.then((value) => {
  console.log(
    value,
    'Hooray!!! She said "Yes"!',
    'if parameter is "true" Promise should be resolved with value === \'Hooray!!! She said "Yes"!\'',
  );
}).catch((error) => {
  const errorMessage = error instanceof Error ? error : defaultRejectionMessage;
  messages.push(errorMessage.message);

  // answer 2
}).then(() => answer2).then((value) => {
  console.log(
    value,
    'Oh no, she said "No".',
    'if parameter is "false" Promise should be resolved with value === \'Oh no, she said "No".\'',
  );
})
  .catch((error) => {
    const errorMessage = error instanceof Error ? error : defaultRejectionMessage;
    messages.push(errorMessage.message);
  })
// answers
  .then(() => Promise.all(answers))
  .then(() => {
    console.log(
      false,
      'if parameter is not boolean Promise should be rejected with Error(\'Wrong parameter is passed! Ask her again.\')',
    );
  })
  .catch((error) => {
    const errorMessage = error instanceof Error ? error : defaultRejectionMessage;

    console.log(
      errorMessage.message,
      'Wrong parameter is passed! Ask her again.',
      'if parameter is not boolean Promise should be rejected with Error(\'Wrong parameter is passed! Ask her again.\')',
    );
  })
  .catch((error) => {
    const errorMessage = error instanceof Error ? error : defaultRejectionMessage;
    messages.push(errorMessage.message);
  })
  .finally(() => {
    if (messages.length > 0) {
      done(Error(`\t${messages.join(';\n\t\t')}`));
    } else {
      done();
    }
  });
