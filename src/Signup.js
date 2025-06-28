// src/pages/SignupPage.js
import React, { useState } from "react";
// import { signup } from "../api/auth";
import styles from "./SignupPage.module.css";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { signUp } from "./API/APIService";
import { CURRENCIES } from "./helpers/constants";
import { InputLabel, Select, MenuItem } from "@mui/material";

export default function SignupPage({ onSignup, onLoginRedirect }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
    currencyCode: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if(form.password.length < 3){
      toast.error("Passwords too small");
      return;
    }
    try {
      form.phone = parseInt(form.phone);
      form["country"] = CURRENCIES.find(currency => currency.code === form.currencyCode);
      const result = await signUp(form);
      if (result && result._id) {
        toast.success("User created successfully!");
        navigate("/login");
      } else {
        toast.error("Signup failed");
      }
      console.log(result);
    } catch (err) {
      toast.error("Signup failed");
    }
  };

  return (
    <div className={styles.signupWrapper}>
      <form className={styles.signupForm} onSubmit={handleSubmit}>
        <h2 className={styles.title}>Create Account</h2>
        <input
          name="name"
          type="text"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          className={styles.input}
          required
        />
        <input
          name="phone"
          type="tel"
          placeholder="Phone Number"
          value={form.phone}
          onChange={handleChange}
          className={styles.input}
          required
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className={styles.input}
          required
        />
        <select
          name="gender"
          value={form.gender}
          onChange={handleChange}
          className={styles.input}
          required
        >
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
        <select
          labelId="currency-label"
          id="currencyCode"
          name="currencyCode"
          value={form.currencyCode}
          onChange={handleChange}
          label="Preferred Currency"
        >
          <option value="">Preferred Currency</option>
          {CURRENCIES.map((curr) => (
            <option value={curr.code}>{curr.name + " " + curr.symbol}</option>
          ))}
        </select>
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className={styles.input}
          required
        />
        <input
          name="confirmPassword"
          type="password"
          placeholder="Confirm Password"
          value={form.confirmPassword}
          onChange={handleChange}
          className={styles.input}
          required
        />
        <button type="submit" className={styles.button}>
          Sign Up
        </button>

        <div className={styles.loginPrompt}>
          <span>Already have an account? </span>
          <Link to="/login" className={styles.loginButton}>
            Login
          </Link>
        </div>
      </form>
    </div>
  );
}
