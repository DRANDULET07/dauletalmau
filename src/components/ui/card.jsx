export const Card = ({ children }) => (
  <div style={{
    border: "1px solid #ccc",
    borderRadius: "8px",
    padding: "1rem",
    backgroundColor: "#fff"
  }}>
    {children}
  </div>
);

export const CardContent = ({ children }) => (
  <div>{children}</div>
);
