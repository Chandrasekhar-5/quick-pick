function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>

      <div style={{ display: "flex", gap: "20px", marginTop: "30px" }}>
        <div style={cardStyle}>
          <h3>Wallet Balance</h3>
          <h2>₹ 1,250</h2>
        </div>

        <div style={cardStyle}>
          <h3>Total Orders</h3>
          <h2>18</h2>
        </div>

        <div style={cardStyle}>
          <h3>Pending Orders</h3>
          <h2>2</h2>
        </div>
      </div>
    </div>
  );
}

const cardStyle = {
  background: "white",
  padding: "20px",
  borderRadius: "12px",
  boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
  flex: 1
};

export default Dashboard;