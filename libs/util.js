exports.sleep = async function sleep(waitMilliseconds) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, waitMilliseconds);
  });
};

exports.maxBy = function maxBy(arr, callback) {
  const results = arr.map(function (el) { return callback(el); });
  const max = Math.max.apply(null, results);
  return arr[results.indexOf(max)];
};
