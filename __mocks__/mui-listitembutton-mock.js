const React = require('react')

const ListItemButton = ({ children, onClick, selected, sx, dense, disableGutters, ...props }) =>
  React.createElement('div', { onClick, role: 'button', ...props }, children)

module.exports = ListItemButton
module.exports.default = ListItemButton
