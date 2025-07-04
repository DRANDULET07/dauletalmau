export const Tabs = ({ children }) => (
  <div style={{ width: '100%' }}>{children}</div>
);

export const TabsContent = ({ children }) => (
  <div style={{ marginTop: "1rem" }}>{children}</div>
);

export const TabsList = ({ children }) => (
  <div style={{ 
    marginBottom: "1rem",
    display: 'flex',
    gap: '0.5rem',
    flexWrap: 'wrap'
  }}>
    {children}
  </div>
);

export const TabsTrigger = ({ children, onClick, active }) => (
  <button 
    onClick={onClick} 
    className={active ? "active" : ""}
    style={{
      padding: '0.5rem 1rem',
      backgroundColor: active ? '#007bff' : 'transparent',
      color: active ? 'white' : 'var(--text-color, #000)',
      border: '1px solid #007bff',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '14px',
      transition: 'all 0.3s ease',
      fontFamily: 'inherit'
    }}
    onMouseEnter={(e) => {
      if (!active) {
        e.target.style.backgroundColor = '#f0f8ff';
      }
    }}
    onMouseLeave={(e) => {
      if (!active) {
        e.target.style.backgroundColor = 'transparent';
      }
    }}
  >
    {children}
  </button>
);
