import { Link } from "react-router-dom";

function BottomNav() {
  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        width: "100%",
        maxWidth: "420px",
        background: "#fff",
        display: "flex",
        justifyContent: "space-around",
        padding: "15px 0",
        borderTop: "1px solid #eee",
      }}
    >
      <Link to="/dashboard">🏠</Link>
      <Link to="/menu">🍽</Link>
      <Link to="/orders">📦</Link>
      <Link to="/profile">👤</Link>
    </div>
  );
}

export default BottomNav;