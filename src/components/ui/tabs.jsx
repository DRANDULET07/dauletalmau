export const Tabs = ({ children }) => <div>{children}</div>;
export const TabsContent = ({ children }) => <div style={{ marginTop: "1rem" }}>{children}</div>;
export const TabsList = ({ children }) => <div style={{ marginBottom: "1rem" }}>{children}</div>;
export const TabsTrigger = ({ children, onClick, active }) => (
  <button onClick={onClick} className={active ? "active" : ""}>
    {children}
  </button>
);
