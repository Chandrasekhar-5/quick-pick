import { Link } from "react-router-dom";

function Layout({ children }) {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      
      {/* Sidebar */}
      <div
        style={{
          width: "220px",
          background: "#1e3c72",
          color: "white",
          padding: "20px",
        }}
      >
        <h2>QuickPick</h2>

        <nav style={{ marginTop: "30px", display: "flex", flexDirection: "column", gap: "15px" }}>
          <Link to="/dashboard" style={linkStyle}>Dashboard</Link>
          <Link to="/menu" style={linkStyle}>Menu</Link>
          <Link to="/orders" style={linkStyle}>Orders</Link>
          <Link to="/profile" style={linkStyle}>Profile</Link>
        </nav>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: "30px" }}>
        {children}
      </div>
    </div>
  );
}

const linkStyle = {
  color: "white",
  textDecoration: "none",
  fontWeight: "500"
};

export default Layout;