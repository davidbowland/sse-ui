const React = require('react')

const passThrough = ({ children, className, ...props }) => React.createElement('div', { className, ...props }, children)

const Button = ({ children, onPress, isIconOnly, variant, size, ...props }) =>
  React.createElement('button', { onClick: onPress, ...props }, children)

const Card = passThrough
const CardContent = passThrough
const CardHeader = passThrough
const CardFooter = passThrough

const Chip = ({ children, color, variant, ...props }) => React.createElement('span', props, children)

const Separator = () => React.createElement('hr')

const Skeleton = ({ className, ...props }) => React.createElement('div', { className, ...props })

const Spinner = ({ ...props }) => React.createElement('div', { role: 'status', ...props })

const Input = ({ label, 'aria-label': ariaLabel, value, onChange, onKeyUp, multiline, maxRows, ...props }) =>
  React.createElement(
    'div',
    null,
    label && React.createElement('label', { htmlFor: label }, label),
    React.createElement('input', {
      id: label,
      'aria-label': ariaLabel || label,
      value: value ?? '',
      onChange,
      onKeyUp,
      ...props,
    }),
  )

const Select = ({ children, onSelectionChange, selectedKey, label, 'aria-label': ariaLabel, ...props }) =>
  React.createElement(
    'select',
    {
      'aria-label': ariaLabel || label,
      value: selectedKey ?? '',
      onChange: (e) => onSelectionChange?.(e.target.value),
      ...props,
    },
    children,
  )

const SelectItem = ({ children, value, ...props }) => React.createElement('option', { value, ...props }, children)

const Switch = ({ children, isSelected, onValueChange, 'aria-label': ariaLabel, ...props }) =>
  React.createElement('input', {
    type: 'checkbox',
    'aria-label': ariaLabel,
    checked: isSelected ?? false,
    onChange: (e) => onValueChange?.(e.target.checked),
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
  Input,
  Select,
  SelectItem,
  Separator,
  Skeleton,
  Spinner,
  Switch,
}
