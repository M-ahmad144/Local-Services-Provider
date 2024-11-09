import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";

const SuccessPage = () => {
  const [paymentStatus, setPaymentStatus] = useState("");
  const location = useLocation();
  const sessionId = new URLSearchParams(location.search).get("session_id");

  useEffect(() => {
    if (sessionId) {
      // Confirm the payment by calling your backend with the session ID
      axios
        .post("http://localhost:8080/confirm-payment", { sessionId })
        .then((response) => {
          setPaymentStatus(
            "Payment was successful! Thank you for your purchase."
          );
        })
        .catch((error) => {
          setPaymentStatus(
            "There was an issue with your payment. Please try again."
          );
        });
    }
  }, [sessionId]);

  return (
    <div className="payment-success">
      <h1 className="text-3xl text-center">Payment Successful</h1>
      <p className="text-center">{paymentStatus}</p>
    </div>
  );
};

export default SuccessPage;
