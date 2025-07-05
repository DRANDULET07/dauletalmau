import React from 'react';

const Button = ({ 
  children, 
  onClick, 
  type = 'button', 
  variant = 'primary', 
  size = 'md', 
  disabled = false, 
  className = '', 
  icon,
  loading = false,
  fullWidth = false,
  ...props 
}) => {
  const baseClasses = `
    inline-flex items-center justify-center gap-2 font-semibold rounded-xl
    transition-all duration-300 ease-in-out transform
    focus:outline-none focus:ring-4 focus:ring-opacity-20
    disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none
    hover:scale-105 active:scale-95
    ${fullWidth ? 'w-full' : ''}
  `;

  const variantClasses = {
    primary: `
      bg-gradient-to-r from-blue-500 to-purple-600
      text-white shadow-lg hover:shadow-xl
      focus:ring-blue-500
      hover:from-blue-600 hover:to-purple-700
    `,
    secondary: `
      bg-gradient-to-r from-gray-500 to-gray-600
      text-white shadow-lg hover:shadow-xl
      focus:ring-gray-500
      hover:from-gray-600 hover:to-gray-700
    `,
    success: `
      bg-gradient-to-r from-green-500 to-emerald-600
      text-white shadow-lg hover:shadow-xl
      focus:ring-green-500
      hover:from-green-600 hover:to-emerald-700
    `,
    warning: `
      bg-gradient-to-r from-yellow-500 to-orange-600
      text-white shadow-lg hover:shadow-xl
      focus:ring-yellow-500
      hover:from-yellow-600 hover:to-orange-700
    `,
    danger: `
      bg-gradient-to-r from-red-500 to-pink-600
      text-white shadow-lg hover:shadow-xl
      focus:ring-red-500
      hover:from-red-600 hover:to-pink-700
    `,
    outline: `
      border-2 border-blue-500 text-blue-500
      hover:bg-blue-500 hover:text-white
      focus:ring-blue-500
      bg-transparent
    `,
    ghost: `
      text-blue-500 hover:bg-blue-50
      focus:ring-blue-500
      bg-transparent
    `,
    link: `
      text-blue-500 underline hover:text-blue-700
      focus:ring-blue-500
      bg-transparent
    `
  };

  const sizeClasses = {
    xs: 'px-2 py-1 text-xs min-h-6',
    sm: 'px-3 py-2 text-sm min-h-8',
    md: 'px-4 py-2 text-base min-h-10',
    lg: 'px-6 py-3 text-lg min-h-12',
    xl: 'px-8 py-4 text-xl min-h-14'
  };

  const classes = `
    ${baseClasses}
    ${variantClasses[variant]}
    ${sizeClasses[size]}
    ${className}
  `.trim();

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={classes}
      {...props}
    >
      {loading && (
        <svg 
          className="animate-spin -ml-1 mr-2 h-4 w-4" 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24"
        >
          <circle 
            className="opacity-25" 
            cx="12" 
            cy="12" 
            r="10" 
            stroke="currentColor" 
            strokeWidth="4"
          />
          <path 
            className="opacity-75" 
            fill="currentColor" 
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {!loading && icon && (
        <span className="flex-shrink-0">
          {icon}
        </span>
      )}
      <span className="flex-shrink-0">
        {children}
      </span>
    </button>
  );
};

export default Button;
