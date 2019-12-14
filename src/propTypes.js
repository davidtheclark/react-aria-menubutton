const PropTypes = require("prop-types");

module.exports = {
  refType: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.elementType })
  ])
};
