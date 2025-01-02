"use client";

import { useState } from "react";
import "./auth.css";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { CircularProgress } from "@mui/material";
import { signupUser } from '@/api/index';
import useAuthStore from "@/store/authStore";

const SignUpComp = ({ revealLogin, routeUser }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('')
  const [loading, setLoading] = useState(false)
  
  const updateUser = useAuthStore((state) => state.updateUser);

  const handleSubmit = (e) => {
    e.preventDefault();

    const email = e.target[0].value
    const password = e.target[1].value

    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{6,}$/;
    if(!passwordRegex.test(password)) {
      setAuthError('Password must contain atleast 6 characters, a letter and a number')
      return
    }

    setLoading(true)
    aunthenticateUser(email, password)    
  };

  const clearErr = () => {
    setAuthError('')
  }

  const aunthenticateUser = async (email, password) => {
    const authResponse = await signupUser({ email, password});

    if(authResponse.status == 200) {
      updateUser(authResponse?.userDetails)

      routeUser('onboarding')
    } else {
      setAuthError(authResponse?.errorMessage)
    }

    setLoading(false)
  }


  return (
    <div className="signUpComp_wrapper">
      <h3 className="authTitle">Create Your Account</h3>
      <form className="form_container" onSubmit={handleSubmit} method="post">
        <div className="inputBox">
          <input
            type="email"
            placeholder="email"
            name="email"
            id="signup-email"
            className="inputEl"
            required
            onFocus={clearErr}
          />
        </div>
        <div className="inputBox">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="password"
            name="password"
            id="signup-password"
            className="inputEl"
            required
            onFocus={clearErr}
          />
          <div
            className="showPassword_container"
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? (
              <VisibilityOffIcon sx={{ fontSize: "18px" }} />
            ) : (
              <VisibilityIcon sx={{ fontSize: "18px" }} />
            )}
          </div>
        </div>
        {authError && <p className="authError">{authError}</p>}
        <button type="submit" className="button authBtn">
          {!loading ? (
            <span>Submit</span>
          ) : (
            <CircularProgress size={20} />
          )}
        </button>
      </form>
      <p onClick={() => revealLogin()} className="loginTxt">
        Already have an account? <span>log In</span>
      </p>
    </div>
  );
};

export default SignUpComp;
