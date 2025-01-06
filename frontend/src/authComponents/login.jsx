"use client";

import { useState } from "react";
import "./auth.css";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { CircularProgress } from "@mui/material";
import { loginUser, resetUserPassword } from '@/api/index';
import useAuthStore from "@/store/authStore";

const LoginComp = ({ revealSignUp, routeUser }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showResetForm, setShowResetForm] = useState(false);
  const [authError, setAuthError] = useState("");
  const [authSucess, setAuthSucess] = useState("");
  const [loading, setLoading] = useState(false)
  
  const updateUser = useAuthStore((state) => state.updateUser);

  const handleSubmit = (e) => {
    e.preventDefault();

    setLoading(true);

    if (!showResetForm) {
      // login function
      const email = e.target[0].value;
      const password = e.target[1].value;

      aunthenticateUser(email, password)
    } else {
      // reset password function
      const email = e.target[0].value
      const newPassword = e.target[1].value
      const name = e.target[2].value

      resetPassword(email, name, newPassword)
    }
  };
 
  const aunthenticateUser = async (email, password) => {
    const authResponse = await loginUser({ email, password });

    if (authResponse.status == 200) {
      setAuthSucess("Login successful");

      updateUser(authResponse?.userDetails);

      if (!authResponse?.userDetails?.role) {
        routeUser("onboarding");
      } else {
        routeUser("explore");
      }
    } else {
      setAuthError(authResponse?.errorMessage);
    }

    setLoading(false);
  };

  const resetPassword = async (email, name, newPassword) => {
    const resetResponse = await resetUserPassword({ email, name, newPassword });
    
    if (resetResponse.status == 200) {
      setAuthSucess('Your password has been reset successfully.')
      setTimeout(() => {
        switchForm()
      }, 2000);
    } else {
      setAuthError(resetResponse?.errorMessage);
    }

    setLoading(false);
  }

  const clearErr = () => {
    setAuthError("");
  };

  const switchForm = () => {
    setAuthError('')
    setAuthSucess('')
    setShowResetForm(!showResetForm);
  };

  return (
    <div className="signUpComp_wrapper">
      <h3 className="authTitle">Login To Your Account</h3>
      <form className="form_container" onSubmit={handleSubmit} method="post">
        <div className="inputBox">
          <input
            type="email"
            placeholder="Your email"
            name="email"
            id="login-email"
            className="inputEl"
            required
            onFocus={clearErr}
          />
        </div>
        <div className="inputBox">
          <input
            type={showPassword ? "text" : "password"}
            placeholder={`Your ${showResetForm ? 'new ' : ''}password`}
            name="password"
            id="login-password"
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
        {showResetForm && (
          <div className="inputBox">
            <input
              type="text"
              placeholder="Your name"
              name="name"
              id="login-name"
              className="inputEl"
              required
              onFocus={clearErr}
            />
          </div>
        )}
        {authError && <p className="authError">{authError}</p>}
        {authSucess && <p className="authError success">{authSucess}</p>}
        {!showResetForm ? (
          <p onClick={switchForm} className="loginTxt">
            Forgot password? <span>reset here</span>
          </p>
        ) : (
          <p onClick={switchForm} className="loginTxt">
            <span>Log In</span>
          </p>
        )}
        <button type="submit" className="button authBtn">
          {!loading ? <span>{showResetForm ? 'Reset' : 'Submit'}</span> : <CircularProgress size={20} />}
        </button>
      </form>
      <p onClick={() => revealSignUp()} className="loginTxt">
        Don't have an account? <span>create one</span>
      </p>
    </div>
  );
};

export default LoginComp;
