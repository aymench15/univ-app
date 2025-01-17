import * as React from "react"

const Button = React.forwardRef(({ className, variant = "primary", ...props }, ref) => {
  const baseStyles = "py-3 px-6 rounded-lg font-semibold transition-all duration-200"
  
  const variants = {
    primary: "bg-primaryColor text-white hover:opacity-90",
    outline: "border border-primaryColor text-primaryColor hover:bg-primaryColor hover:text-white",
    ghost: "hover:bg-gray-100"
  }

  return (
    <button
      ref={ref}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    />
  )
})
Button.displayName = "Button"

export { Button }