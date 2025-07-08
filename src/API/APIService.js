// src/api/api.js

const API_BASE_URL = "https://resp.spendsavetrack.cc";

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
  const res = await fetch(`${API_BASE_URL}/user/validate`, {
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

// update User API
export async function updateUser(payload) {
  try {
    const res = await fetch(`${API_BASE_URL}/user`, {
      headers: getAuthHeaders(),
      method: "PUT",
      body: JSON.stringify(payload),
    });
    return await res.json();
  } catch (error) {
    return null;
  }
}

// Update Transaction API
export async function updateTransaction(id, payload) {
  try {
    const res = await fetch(`${API_BASE_URL}/transaction?id=${id}`, {
      headers: getAuthHeaders(),
      method: "PUT",
      body: JSON.stringify(payload),
    });
    return await res.json();
  } catch (error) {
    return null;
  }
}

export async function fetchTotalUserExpenditureAndIncome(payload) {
  try{
    if(!payload) return null;
     const res = await fetch(`${API_BASE_URL}/transaction/total?month=${payload.month}&year=${payload.year}`, {
    method: "GET",
    headers: getAuthHeaders(),
  });
  return await res.json();
  } catch(error){
    return null;
  }
}

export async function deleteTransactionById(id) {
  try{
    if(!id) return null;
     const res = await fetch(`${API_BASE_URL}/transaction?id=${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  return await res.json();
  } catch(error){
    return null;
  }
}

export async function fetchTransactions(month, category=null, limit=10, offset=0) {
  try{
    const res = await fetch(`${API_BASE_URL}/transaction/list?month=${month}&category=${category}&limit=${limit}&offset=${offset}`, {
    method: "GET",
    headers: getAuthHeaders(),
  });
  return await res.json();
  } catch(error){
    return null;
  }
}

export async function getInsights(month) {
  try{
    const res = await fetch(`${API_BASE_URL}/transaction/insights?month=${month}`, {
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

// Token validation API
export async function getUniqueVisit() {
  const res = await fetch(`${API_BASE_URL}/uservisit`, {
    method: "GET",
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    throw new Error("Token invalid");
  }
  return await res.json(); // Returns user or success response
}

// Get avaialable report lists
export async function getAvailableReportsList(month) {
  const res = await fetch(`${API_BASE_URL}/transaction/availableReports?month=${month}`, {
    method: "GET",
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    throw new Error("Token invalid");
  }
  return await res.json(); // Returns user or success response
}

// Download report
export async function downloadReport(month) {
  const res = await fetch(`${API_BASE_URL}/transaction/downloadReport?month=${month}`, {
    method: "GET",
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    throw new Error("Token invalid");
  }
  return res;
}

// create review
export async function createReview(payload) {
  try {
    const res = await fetch(`${API_BASE_URL}/review`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
   if (!res.ok) {
    throw new Error("Token invalid");
  }
  return await res.json();
  } catch(error){ 
    throw new Error("Error");
  }
}

// check review exists 
export async function checkReviewExists() {
  try {
    const res = await fetch(`${API_BASE_URL}/review/exists`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
     if (!res.ok) {
    throw new Error("Token invalid");
  }
  return await res.json();
  } catch(error){ }
}

// check review exists 
export async function getAllReview() {
  try {
    const res = await fetch(`${API_BASE_URL}/review`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
     if (!res.ok) {
    throw new Error("Token invalid");
  }
  return await res.json();
  } catch(error){ 
    throw new Error("Error");
  }
}

export async function getSystemInfo() {
  try {
    const res = await fetch(`${API_BASE_URL}/user/infoSystemInfo`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
     if (!res.ok) {
    throw new Error("Token invalid");
  }
  return await res.json();
  } catch(error){ 
    throw new Error("Error");
  }
}