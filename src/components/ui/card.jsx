import React from 'react';

const Card = ({ 
  children, 
  className = '', 
  variant = 'default',
  padding = 'default',
  shadow = 'default',
  hover = true,
  onClick,
  ...props 
}) => {
  const baseClasses = `
    bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700
    transition-all duration-300 ease-in-out
    ${onClick ? 'cursor-pointer' : ''}
  `;

  const variantClasses = {
    default: 'bg-white dark:bg-gray-800',
    elevated: 'bg-white dark:bg-gray-800 shadow-lg',
    outlined: 'bg-transparent border-2 border-gray-300 dark:border-gray-600',
    filled: 'bg-gray-50 dark:bg-gray-900',
    gradient: 'bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20'
  };

  const paddingClasses = {
    none: '',
    sm: 'p-3',
    default: 'p-6',
    lg: 'p-8',
    xl: 'p-10'
  };

  const shadowClasses = {
    none: '',
    sm: 'shadow-sm',
    default: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl',
    '2xl': 'shadow-2xl'
  };

  const hoverClasses = hover ? `
    hover:shadow-xl hover:-translate-y-1
    ${onClick ? 'hover:scale-[1.02]' : ''}
  ` : '';

  const classes = `
    ${baseClasses}
    ${variantClasses[variant]}
    ${paddingClasses[padding]}
    ${shadowClasses[shadow]}
    ${hoverClasses}
    ${className}
  `.trim();

  return (
    <div 
      className={classes}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
};

// Подкомпоненты для лучшей структуры
Card.Header = ({ children, className = '', ...props }) => (
  <div 
    className={`pb-4 border-b border-gray-200 dark:border-gray-700 ${className}`}
    {...props}
  >
    {children}
  </div>
);

Card.Body = ({ children, className = '', ...props }) => (
  <div className={`py-4 ${className}`} {...props}>
    {children}
  </div>
);

Card.Footer = ({ children, className = '', ...props }) => (
  <div 
    className={`pt-4 border-t border-gray-200 dark:border-gray-700 ${className}`}
    {...props}
  >
    {children}
  </div>
);

Card.Title = ({ children, className = '', ...props }) => (
  <h3 
    className={`text-xl font-semibold text-gray-900 dark:text-white ${className}`}
    {...props}
  >
    {children}
  </h3>
);

Card.Subtitle = ({ children, className = '', ...props }) => (
  <p 
    className={`text-sm text-gray-600 dark:text-gray-400 mt-1 ${className}`}
    {...props}
  >
    {children}
  </p>
);

export default Card;
