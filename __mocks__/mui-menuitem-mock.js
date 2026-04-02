const React = require('react')

const MenuItem = ({ children, value, onClick, sx, ...props }) =>
  React.createElement('li', { value, onClick, role: 'option' }, children)

module.exports = MenuItem
module.exports.default = MenuItem
