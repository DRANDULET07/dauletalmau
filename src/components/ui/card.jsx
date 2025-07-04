export const Card = ({ children, className = "" }) => (
  <div 
    className={`ui-card ${className}`}
    style={{
      border: "1px solid #ccc",
      borderRadius: "12px",
      padding: "1.5rem",
      backgroundColor: "var(--card-bg, #fff)",
      color: "var(--text-color, #000)",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
      transition: "transform 0.3s ease, box-shadow 0.3s ease",
      fontFamily: 'inherit'
    }}
    onMouseEnter={(e) => {
      e.target.style.transform = 'translateY(-2px)';
      e.target.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.15)';
    }}
    onMouseLeave={(e) => {
      e.target.style.transform = 'translateY(0)';
      e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
    }}
  >
    {children}
  </div>
);

export const CardContent = ({ children }) => (
  <div style={{ lineHeight: '1.6' }}>{children}</div>
);
