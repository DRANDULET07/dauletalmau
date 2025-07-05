import React, { useState, createContext, useContext } from 'react';

const TabsContext = createContext();

const useTabs = () => {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('Tabs components must be used within a Tabs provider');
  }
  return context;
};

const Tabs = ({ 
  children, 
  defaultValue, 
  value, 
  onValueChange, 
  className = '',
  variant = 'default',
  orientation = 'horizontal',
  ...props 
}) => {
  const [selectedValue, setSelectedValue] = useState(defaultValue);
  const controlledValue = value !== undefined ? value : selectedValue;
  const controlledOnValueChange = onValueChange || setSelectedValue;

  const contextValue = {
    value: controlledValue,
    onValueChange: controlledOnValueChange,
    variant,
    orientation
  };

  const baseClasses = `
    ${orientation === 'vertical' ? 'flex flex-row' : 'flex flex-col'}
  `;

  const classes = `${baseClasses} ${className}`.trim();

  return (
    <TabsContext.Provider value={contextValue}>
      <div className={classes} {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  );
};

const TabsList = ({ 
  children, 
  className = '', 
  ...props 
}) => {
  const { variant, orientation } = useTabs();

  const baseClasses = `
    inline-flex items-center justify-center
    bg-gray-100 dark:bg-gray-800 rounded-xl p-1
    ${orientation === 'vertical' ? 'flex-col h-auto' : 'flex-row w-auto'}
  `;

  const variantClasses = {
    default: 'bg-gray-100 dark:bg-gray-800',
    elevated: 'bg-white dark:bg-gray-900 shadow-lg border border-gray-200 dark:border-gray-700',
    outlined: 'bg-transparent border-2 border-gray-200 dark:border-gray-700'
  };

  const classes = `
    ${baseClasses}
    ${variantClasses[variant]}
    ${className}
  `.trim();

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
};

const TabsTrigger = ({ 
  children, 
  value, 
  className = '', 
  disabled = false,
  ...props 
}) => {
  const { value: selectedValue, onValueChange, variant } = useTabs();
  const isSelected = selectedValue === value;

  const baseClasses = `
    inline-flex items-center justify-center whitespace-nowrap rounded-lg px-3 py-2
    text-sm font-medium transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
    disabled:pointer-events-none disabled:opacity-50
    cursor-pointer
  `;

  const stateClasses = isSelected
    ? `
        bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400
        shadow-sm
      `
    : `
        text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100
        hover:bg-gray-50 dark:hover:bg-gray-800
      `;

  const variantClasses = {
    default: '',
    elevated: isSelected ? 'shadow-md' : '',
    outlined: isSelected ? 'border border-blue-200 dark:border-blue-700' : ''
  };

  const classes = `
    ${baseClasses}
    ${stateClasses}
    ${variantClasses[variant]}
    ${className}
  `.trim();

  return (
    <button
      className={classes}
      onClick={() => onValueChange(value)}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

const TabsContent = ({ 
  children, 
  value, 
  className = '', 
  ...props 
}) => {
  const { value: selectedValue } = useTabs();
  const isSelected = selectedValue === value;

  if (!isSelected) return null;

  const classes = `
    mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
    ${className}
  `.trim();

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
};

// Экспорт компонентов
Tabs.List = TabsList;
Tabs.Trigger = TabsTrigger;
Tabs.Content = TabsContent;

export default Tabs;
