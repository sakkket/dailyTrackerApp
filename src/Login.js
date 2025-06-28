import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import styles from "./LoginPage.module.css";
import { login, getUniqueVisit } from "./API/APIService";
import { toast } from "react-toastify";
import { useGlobalStore } from "./store/globalStore";

export default function Login({ onLogin }) {
  const setUser = useGlobalStore((state) => state.setUser);
  const setCurrencySymbol = useGlobalStore((state) => state.setCurrencySymbol);
  const setCurrencyCode = useGlobalStore((state) => state.setCurrencyCode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const data = await login(email, password);
      const { accessToken, user } = data;
      setUser(user);
      setCurrencySymbol(user?.country?.symbol || '₹');
      setCurrencyCode(user?.currencyCode || 'INR')
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("userName", user.name);
      try{
        const uniqueVisit = await getUniqueVisit();
        localStorage.setItem("uniqueUser", uniqueVisit.count);
      
      } catch(err){
         localStorage.setItem("uniqueUser",1);  
      } 
      finally{
         onLogin(user.name);
         navigate("/");
      }
    } catch (err) {
      console.log(err);
      toast.error("Login Failed");
    }
  }

  return (
    <div className={styles.loginWrapper}>
      <form className={styles.loginForm} onSubmit={handleSubmit}>
        <h2 className={styles.title}>Daily Tracker</h2>
        <input
          type="email"
          placeholder="Email"
          className={styles.input}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className={styles.input}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className={styles.button}>
          Login
        </button>

        <div className={styles.signupPrompt}>
          <span>Don't have an account? </span>
          {/* <button
            type="button"
            className={styles.signupButton}
            onClick={onSignupRedirect}
          >
            Sign up
          </button> */}
          <Link to="/signup" className={styles.signupButton}>
            Sign up
          </Link>
        </div>
      </form>
    </div>
  );
}
