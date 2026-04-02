const React = require('react')

const Button = ({ children, onClick, startIcon, endIcon, variant, size, sx, disabled, ...props }) =>
  React.createElement('button', { onClick, disabled, ...props }, children)

module.exports = Button
module.exports.default = Button
