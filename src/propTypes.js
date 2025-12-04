import PropTypes from "prop-types";

export const refType = PropTypes.oneOfType([
  PropTypes.func,
  PropTypes.shape({ current: PropTypes.elementType })
]);
