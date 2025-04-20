import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { server } from "../../server";

const ActivationPage = () => {
  const { activation_token } = useParams();
  const [error, setError] = useState(false);

  useEffect(() => {
    if (activation_token) {
      const activationEmail = async () => {
        try {
          const res = await axios.post(`${server}/user/activation`, {
            activation_token,
          });
          console.log(server);
          console.log(res.data.message);
        } catch (error) {
          console.log(error.response?.data?.message || error.message);
          setError(true);
        }
      };
      activationEmail();
    }
  }, [activation_token]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "90vh",
        width: "100%",
        backgroundColor: "#f0f0f0",
      }}
    >
      <div
        style={{
          padding: "20px",
          borderRadius: "10px",
          backgroundColor: "#fff",
          boxShadow: "0 0 10px rgba(0,0,0,0.1)",
        }}
      >
        <h2 style={{ textAlign: "center" }}>Account Activation</h2>
        {error ? (
          <p style={{ color: "red" }}>Your token has expired</p>
        ) : (
          <p style={{ color: "green" }}>your account has been activated</p>
        )}
      </div>
    </div>
  );
};

export default ActivationPage;
