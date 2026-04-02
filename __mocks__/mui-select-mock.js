const React = require('react')

const Select = ({ children, onChange, value, 'aria-label': ariaLabel, label, id, ...props }) => {
  const [open, setOpen] = React.useState(false)

  const handleToggle = () => setOpen((prev) => !prev)

  const handleSelect = (val) => {
    onChange?.({ target: { value: val } })
    setOpen(false)
  }

  // Find the label for the currently selected value
  const selectedLabel = React.Children.toArray(children).reduce((found, child) => {
    if (found) return found
    if (child && child.props && child.props.value === value) return child.props.children
    return null
  }, null)

  const childrenWithHandler = React.Children.map(children, (child) => {
    if (!child) return null
    return React.cloneElement(child, { onClick: () => handleSelect(child.props.value) })
  })

  return React.createElement(
    'div',
    { 'aria-label': ariaLabel || label, id, role: 'combobox', onClick: handleToggle },
    React.createElement('span', null, selectedLabel || value),
    open ? React.createElement('ul', { role: 'listbox' }, childrenWithHandler) : null,
  )
}

module.exports = Select
module.exports.default = Select
