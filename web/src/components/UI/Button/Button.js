import React from 'react'
import './Button.css'
const UIButton = ({
  children,
  className,
  component: Component,
  theme,
  ...resProps
}) => {
  return (
    <Component
      className={`ui-button ui-button--${theme} ${className}`}
      {...resProps}
    >
      {' '}
      {children}{' '}
    </Component>
  )
}

UIButton.defaultProps = {
  component: 'a',
  className: '',
  theme: 'bordered-blue',
}

export default UIButton
