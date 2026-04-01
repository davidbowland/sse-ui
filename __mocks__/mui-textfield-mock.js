const React = require('react')

const TextField = ({
  label,
  value,
  onChange,
  onKeyUp,
  multiline,
  maxRows,
  rows,
  disabled,
  error,
  helperText,
  inputProps,
  InputProps,
  sx,
  variant,
  fullWidth,
  size,
  ...props
}) =>
  React.createElement(
    'div',
    null,
    label && React.createElement('label', { htmlFor: label }, label),
    React.createElement('input', {
      id: label,
      'aria-label': label,
      value: value ?? '',
      onChange,
      onKeyUp,
      disabled,
      ...props,
    }),
    helperText && React.createElement('span', null, helperText),
  )

module.exports = TextField
module.exports.default = TextField
