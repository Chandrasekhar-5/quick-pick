import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/dashboard");
  };

  return (
    <div style={{ padding: "40px 20px" }}>
      <h2>QuickPick</h2>

      <input
        placeholder="Email"
        style={inputStyle}
      />
      <input
        placeholder="Password"
        type="password"
        style={inputStyle}
      />

      <button onClick={handleLogin} style={buttonStyle}>
        Login
      </button>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "12px",
  marginTop: "15px",
  borderRadius: "10px",
  border: "1px solid #ddd"
};

const buttonStyle = {
  width: "100%",
  padding: "14px",
  marginTop: "20px",
  borderRadius: "10px",
  border: "none",
  background: "#2a5298",
  color: "white",
  fontWeight: "600"
};

export default Login;