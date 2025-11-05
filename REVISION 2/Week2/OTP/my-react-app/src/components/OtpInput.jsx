import React, { useRef, useState } from "react";
import "./OtpInput.css"; 
const OtpInput = () => {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const inputRefs = useRef([]);

  const handleChange = (e, index) => {
    const value = e.target.value;

    if (!/^\d?$/.test(value)) return; 

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
   if (value && index < 3) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      if (otp[index]) {
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
      } else if (index > 0) {
        inputRefs.current[index - 1].focus();
      }
    }
  };

  const handlePaste = (e) => {
    const pasteData = e.clipboardData.getData("Text").trim();
    if (!/^\d{4}$/.test(pasteData)) return; 

    const newOtp = pasteData.split("");
    setOtp(newOtp);

    newOtp.forEach((digit, idx) => {
      if (inputRefs.current[idx]) {
        inputRefs.current[idx].value = digit;
      }
    });

    inputRefs.current[3].focus();
  };

  return (
    <div className="otp-container">
      <h2>Enter OTP</h2>
      <div className="otp-inputs">
        {otp.map((digit, index) => (
          <input
            key={index}
            type="text"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(e, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            onPaste={(e) => index === 0 && handlePaste(e)} 
            ref={(el) => (inputRefs.current[index] = el)}
            inputMode="numeric"
            className="otp-box"
          />
        ))}
      </div>
    </div>
  );
};

export default OtpInput;
