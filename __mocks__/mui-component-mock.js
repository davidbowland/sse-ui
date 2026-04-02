const React = require('react')

const passThrough = ({
  children,
  sx,
  noWrap,
  disableGutters,
  gutterBottom,
  variant,
  component,
  spacing,
  container,
  item,
  lg,
  md,
  sm,
  xs,
  order,
  position,
  disablePadding,
  dense,
  ...props
}) => React.createElement('div', props, children)

module.exports = passThrough
module.exports.default = passThrough
