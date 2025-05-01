import * as React from "react"

const Card = React.forwardRef(({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={`bg-white rounded-lg shadow-panelShadow ${className}`}
      style={{ maxWidth: '1200px' }} // Add the max width here
      {...props}
    />
  ));
  
Card.displayName = "Card"

const CardHeader = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={`p-6 ${className}`}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardContent = React.forwardRef(({ className, ...props }, ref) => (
  <div 
    ref={ref} 
    className={`p-6 pt-0 ${className}`} 
    {...props} 
  />
))
CardContent.displayName = "CardContent"

export { Card, CardHeader, CardContent }