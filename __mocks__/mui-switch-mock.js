const React = require('react')

const Switch = ({ checked, onChange, defaultChecked, sx, size, color, disabled, ...props }) =>
  React.createElement('input', {
    type: 'checkbox',
    role: 'checkbox',
    checked: checked ?? defaultChecked ?? false,
    onChange: (e) => onChange?.(e, e.target.checked),
    disabled,
    ...props,
  })

module.exports = Switch
module.exports.default = Switch
