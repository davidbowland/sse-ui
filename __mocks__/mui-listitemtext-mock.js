const React = require('react')

const ListItemText = ({ primary, secondary, sx, ...props }) =>
  React.createElement(
    'div',
    props,
    primary && React.createElement('span', null, primary),
    secondary && React.createElement('span', null, secondary),
  )

module.exports = ListItemText
module.exports.default = ListItemText
