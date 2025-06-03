// src/api/api.js

const API_BASE_URL = "http://localhost:3010";

// Helper to get token from localStorage
function getAuthHeaders() {
  const token = localStorage.getItem("accessToken");
  return token
    ? {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      }
    : { "Content-Type": "application/json" };
}

// Login API
export async function login(email, password) {
  try {
    const res = await fetch(`${API_BASE_URL}/user/login`, {
      headers: { "Content-Type": "application/json" },
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    if (!res) {
      const err = await res.json();
      throw new Error(err.message || "Login failed");
    }
    return await res.json(); // Should return { accessToken, user }
  } catch (error) {
    console.log(error);
  }
}

// Token validation API
export async function validateToken() {
  const res = await fetch(`${API_BASE_URL}/user/validate`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  if (!res.ok) {
    throw new Error("Token invalid");
  }

  return await res.json(); // Returns user or success response
}

// Example: Get user data
export async function fetchUserData() {
  const res = await fetch(`${API_BASE_URL}/user/profile`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  if (!res.ok) throw new Error("Failed to fetch user data");

  return await res.json();
}

// Example: Get user expenditure data
export async function fetchUserExpenditure(groupby, month) {
  const res = await fetch(`${API_BASE_URL}/transaction?groupby=${groupby}&month=${month}`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  if (!res.ok) throw new Error("Failed to fetch user data");

  return await res.json();
}

// Save Expenditure API
export async function saveExpenditure(payload) {
  try {
    const res = await fetch(`${API_BASE_URL}/transaction`, {
      headers: getAuthHeaders(),
      method: "POST",
      body: JSON.stringify(payload),
    });
    return await res.json();
  } catch (error) {
    return null;
  }
}

export async function fetchTotalUserExpenditureAndIncome(month) {
  try{
     const res = await fetch(`${API_BASE_URL}/transaction/total?month=${month}`, {
    method: "GET",
    headers: getAuthHeaders(),
  });
  return await res.json();
  } catch(error){
    return null;
  }
}

// Save Expenditure API
export async function signUp(payload) {
  try {
    const res = await fetch(`${API_BASE_URL}/user`, {
      headers: getAuthHeaders(),
      method: "POST",
      body: JSON.stringify(payload),
    });
    return await res.json();
  } catch (error) {
    console.log(error);
  }
}