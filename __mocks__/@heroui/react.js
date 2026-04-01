const React = require('react')

const passThrough = ({ children, className, ...props }) => React.createElement('div', { className, ...props }, children)

const Button = ({ children, onPress, isIconOnly, variant, size, isDisabled, disabled, ...props }) =>
  React.createElement('button', { onClick: onPress, disabled: isDisabled ?? disabled, ...props }, children)

const Card = passThrough
const CardContent = passThrough
const CardHeader = passThrough
const CardFooter = passThrough

const Chip = ({ children, color, variant, ...props }) => React.createElement('span', props, children)

const Separator = () => React.createElement('hr')

const Skeleton = ({ className, ...props }) => React.createElement('div', { className, ...props })

const Spinner = ({ ...props }) => React.createElement('div', { role: 'status', ...props })

const TextFieldContext = React.createContext({ fieldId: '', onChange: null, value: undefined })

const Input = ({ 'aria-label': ariaLabel, value: inputValue, onChange: inputOnChange, onKeyUp, ...props }) => {
  const { fieldId, onChange: fieldOnChange, value: fieldValue } = React.useContext(TextFieldContext)
  const value = fieldValue !== undefined ? fieldValue : inputValue
  const handleChange = (e) => {
    if (fieldOnChange) fieldOnChange(e.target.value)
    if (inputOnChange) inputOnChange(e)
  }
  return React.createElement('input', {
    id: fieldId || undefined,
    'aria-label': ariaLabel,
    value: value ?? '',
    onChange: handleChange,
    onKeyUp,
    ...props,
  })
}

const TextField = ({ children, isInvalid, onChange, value, ...props }) => {
  const fieldId = React.useId()
  return React.createElement(
    TextFieldContext.Provider,
    { value: { fieldId, onChange, value } },
    React.createElement(
      'div',
      { 'data-invalid': isInvalid || undefined, ...props },
      typeof children === 'function' ? children({ isInvalid }) : children,
    ),
  )
}

const Label = ({ children, ...props }) => {
  const { fieldId } = React.useContext(TextFieldContext)
  return React.createElement('label', { htmlFor: fieldId || undefined, ...props }, children)
}

const FieldError = ({ children, ...props }) => React.createElement('span', { role: 'alert', ...props }, children)

const Select = ({ children, onSelectionChange, selectedKey, 'aria-label': ariaLabel, ...props }) =>
  React.createElement(
    'select',
    {
      'aria-label': ariaLabel,
      value: selectedKey ?? '',
      onChange: (e) => onSelectionChange?.(e.target.value),
      ...props,
    },
    children,
  )

const ListBoxItem = ({ children, id, ...props }) => React.createElement('option', { value: id, ...props }, children)

const SelectItem = ({ children, value, ...props }) => React.createElement('option', { value, ...props }, children)

const Switch = ({ children, isSelected, onChange, 'aria-label': ariaLabel, ...props }) =>
  React.createElement('input', {
    type: 'checkbox',
    'aria-label': ariaLabel,
    checked: isSelected ?? false,
    onChange: (e) => onChange?.(e.target.checked),
    ...props,
  })

const AlertRoot = passThrough
const AlertIndicator = passThrough
const AlertContent = passThrough
const AlertDescription = ({ children, ...props }) => React.createElement('div', props, children)

const Accordion = passThrough
const AccordionItem = passThrough
const AccordionHeading = passThrough
const AccordionTrigger = passThrough
const AccordionPanel = passThrough
const AccordionBody = passThrough
const AccordionIndicator = passThrough

module.exports = {
  Accordion,
  AccordionBody,
  AccordionHeading,
  AccordionIndicator,
  AccordionItem,
  AccordionPanel,
  AccordionTrigger,
  AlertContent,
  AlertDescription,
  AlertIndicator,
  AlertRoot,
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  Chip,
  FieldError,
  Input,
  Label,
  ListBoxItem,
  Select,
  SelectItem,
  Separator,
  Skeleton,
  Spinner,
  Switch,
  TextField,
}
