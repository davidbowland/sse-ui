const React = require('react')

const appendElement = (child) => {
  const el = document.createElement(child.type)
  Object.entries(child.props || {}).forEach(([key, value]) => key !== 'children' && el.setAttribute(key, value))
  document.head.appendChild(el)
  return el
}

const Head = ({ children }) => {
  React.useEffect(() => {
    const elements = React.Children.toArray(children).filter(Boolean)
    const titleEl = elements.find((child) => child.type === 'title')
    if (titleEl && titleEl.props && titleEl.props.children) {
      document.title = titleEl.props.children
    }

    const appended = elements.filter((child) => child.type !== 'title').map(appendElement)
    return () => appended.forEach((el) => el.remove())
  }, [children])
  return null
}

module.exports = Head
module.exports.default = Head
