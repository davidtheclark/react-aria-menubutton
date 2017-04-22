module.exports = function(key, keyCode) {
  return {
    key: key,
    keyCode: keyCode,
    preventDefault: jest.fn(),
  };
};
