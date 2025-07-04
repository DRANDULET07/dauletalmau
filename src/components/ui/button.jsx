const Button = ({ children, onClick, className = "" }) => (
  <button 
    onClick={onClick} 
    className={`ui-button ${className}`}
    style={{
      padding: '0.6rem 1.2rem',
      backgroundColor: '#007bff',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '14px',
      transition: 'background-color 0.3s ease',
      fontFamily: 'inherit'
    }}
    onMouseEnter={(e) => e.target.style.backgroundColor = '#0056b3'}
    onMouseLeave={(e) => e.target.style.backgroundColor = '#007bff'}
  >
    {children}
  </button>
);

export default Button;
