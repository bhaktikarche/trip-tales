import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./Auth.css";
import img1 from "../assets/img1.jpg";
import img2 from "../assets/img2.jpg";
import img3 from "../assets/img3.jpg";
import img4 from "../assets/img4.jpg";

function Auth() {
  const [isRegister, setIsRegister] = useState(false);
  const [reveal, setReveal] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
    gender: "",
    dob: "",
    country: "",
    role: "user",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);
  const navigate = useNavigate();

  const images = [img1, img2, img3, img4];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [images.length]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    // Clear error when user types
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (isRegister) {
      if (!form.name.trim()) newErrors.name = "Name is required";
      if (!form.email.trim()) newErrors.email = "Email is required";
      else if (!/\S+@\S+\.\S+/.test(form.email))
        newErrors.email = "Email is invalid";
      if (!form.dob) newErrors.dob = "Date of birth is required";
      if (!form.gender) newErrors.gender = "Gender is required";
      if (!form.country.trim()) newErrors.country = "Country is required";
    }

    if (!form.username.trim()) newErrors.username = "Username is required";
    if (!form.password) newErrors.password = "Password is required";
    else if (form.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/login", {
        username: form.username,
        password: form.password,
      });

      const { token, user, message, redirectTo } = res.data;
      if (token && user) {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        toast.success(message || "Login successful!");
        navigate(redirectTo || "/");
      } else {
        toast.error("Login failed: Missing token or user");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/register", form);
      toast.success(res.data.message || "Registration successful!");
      setIsRegister(false);
      // Reset form after successful registration
      setForm({
        name: "",
        email: "",
        username: "",
        password: "",
        gender: "",
        dob: "",
        country: "",
        role: "user",
      });
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setReveal(false);
    const timer = setTimeout(() => setReveal(true), 300);
    return () => clearTimeout(timer);
  }, [isRegister]);

  return (
    <div className="travel-auth-body">
      <div className="travel-auth-background">
        <div className="travel-auth-background-images">
          {images.map((img, index) => (
            <div
              key={index}
              className={`travel-auth-bg-image ${
                index === currentImage ? "active" : ""
              }`}
              style={{ backgroundImage: `url(${img})` }}
            />
          ))}
        </div>
        <div className="travel-auth-overlay"></div>
      </div>

      <div
        className={`travel-auth-container ${isRegister ? "register-mode" : ""}`}
      >
        <div className="travel-auth-card">
          <div className="travel-auth-header">
            <div className="travel-auth-logo">
              <i className="fas fa-plane"></i>
              <span>TripTales</span>
            </div>
            <h2>{isRegister ? "Create Account" : "Welcome Back"}</h2>
            <p>
              {isRegister
                ? "Join us to start your adventure"
                : "Sign in to continue your journey"}
            </p>
          </div>

          <div className="travel-auth-forms">
            {/* LOGIN FORM */}
            <form
              className={`travel-auth-form travel-login-form ${
                !isRegister ? "active" : ""
              }`}
              onSubmit={handleLogin}
            >
              <div className="travel-form-group">
                <div className="travel-input-container">
                  <i className="fas fa-user"></i>
                  <input
                    name="username"
                    placeholder="Username"
                    onChange={handleChange}
                    value={form.username}
                    className={errors.username ? "error" : ""}
                    required
                  />
                </div>
                {errors.username && (
                  <span className="travel-error">{errors.username}</span>
                )}
              </div>

              <div className="travel-form-group">
                <div className="travel-input-container">
                  <i className="fas fa-lock"></i>
                  <input
                    name="password"
                    type="password"
                    placeholder="Password"
                    onChange={handleChange}
                    value={form.password}
                    className={errors.password ? "error" : ""}
                    required
                  />
                </div>
                {errors.password && (
                  <span className="travel-error">{errors.password}</span>
                )}
              </div>

              <div className="travel-form-options">
                <label className="travel-checkbox">
                  <input type="checkbox" />
                  <span className="checkmark"></span>
                  Remember me
                </label>
                {/* Fix this line - use 'to' instead of 'href' */}
                <Link to="#" className="travel-forgot-link">
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                className="travel-auth-btn"
                disabled={isLoading}
              >
                {isLoading ? <div className="travel-spinner"></div> : "Login"}
              </button>

              <div className="travel-auth-switch">
                <p>
                  Don't have an account?{" "}
                  <span onClick={() => setIsRegister(true)}>Sign up</span>
                </p>
              </div>
            </form>

            {/* REGISTER FORM */}
            <form
              className={`travel-auth-form travel-register-form ${
                isRegister ? "active" : ""
              }`}
              onSubmit={handleRegister}
            >
              <div className="travel-form-row">
                <div className="travel-form-group">
                  <div className="travel-input-container">
                    <i className="fas fa-user"></i>
                    <input
                      name="name"
                      placeholder="Full Name"
                      onChange={handleChange}
                      value={form.name}
                      className={errors.name ? "error" : ""}
                      required
                    />
                  </div>
                  {errors.name && (
                    <span className="travel-error">{errors.name}</span>
                  )}
                </div>

                <div className="travel-form-group">
                  <div className="travel-input-container">
                    <i className="fas fa-envelope"></i>
                    <input
                      name="email"
                      type="email"
                      placeholder="Email"
                      onChange={handleChange}
                      value={form.email}
                      className={errors.email ? "error" : ""}
                      required
                    />
                  </div>
                  {errors.email && (
                    <span className="travel-error">{errors.email}</span>
                  )}
                </div>
              </div>

              <div className="travel-form-row">
                <div className="travel-form-group">
                  <div className="travel-input-container">
                    <i className="fas fa-user"></i>
                    <input
                      name="username"
                      placeholder="Username"
                      onChange={handleChange}
                      value={form.username}
                      className={errors.username ? "error" : ""}
                      required
                    />
                  </div>
                  {errors.username && (
                    <span className="travel-error">{errors.username}</span>
                  )}
                </div>

                <div className="travel-form-group">
                  <div className="travel-input-container">
                    <i className="fas fa-lock"></i>
                    <input
                      name="password"
                      type="password"
                      placeholder="Password"
                      onChange={handleChange}
                      value={form.password}
                      className={errors.password ? "error" : ""}
                      required
                    />
                  </div>
                  {errors.password && (
                    <span className="travel-error">{errors.password}</span>
                  )}
                </div>
              </div>

              <div className="travel-form-row">
                <div className="travel-form-group">
                  <div className="travel-input-container">
                    <i className="fas fa-venus-mars"></i>
                    <select
                      name="gender"
                      onChange={handleChange}
                      value={form.gender}
                      className={errors.gender ? "error" : ""}
                      required
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  {errors.gender && (
                    <span className="travel-error">{errors.gender}</span>
                  )}
                </div>

                <div className="travel-form-group">
                  <div className="travel-input-container">
                    <i className="fas fa-calendar"></i>
                    <input
                      name="dob"
                      type="date"
                      onChange={handleChange}
                      value={form.dob}
                      className={errors.dob ? "error" : ""}
                      required
                    />
                  </div>
                  {errors.dob && (
                    <span className="travel-error">{errors.dob}</span>
                  )}
                </div>
              </div>

              <div className="travel-form-group">
                <div className="travel-input-container">
                  <i className="fas fa-globe"></i>
                  <input
                    name="country"
                    placeholder="Country"
                    onChange={handleChange}
                    value={form.country}
                    className={errors.country ? "error" : ""}
                    required
                  />
                </div>
                {errors.country && (
                  <span className="travel-error">{errors.country}</span>
                )}
              </div>

              <button
                type="submit"
                className="travel-auth-btn"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="travel-spinner"></div>
                ) : (
                  "Create Account"
                )}
              </button>

              <div className="travel-auth-switch">
                <p>
                  Already have an account?{" "}
                  <span onClick={() => setIsRegister(false)}>Sign in</span>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Auth;
