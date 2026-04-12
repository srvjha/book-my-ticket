const API_BASE = "http://localhost:8000";   

function setToken(token) {
    if (token) localStorage.setItem("token", token);
    else localStorage.removeItem("token");
}

function getToken() {
    return localStorage.getItem("token");
}

function setUser(user) {
    if (user) localStorage.setItem("user", JSON.stringify(user));
    else localStorage.removeItem("user");
}

function getUser() {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
}

async function apiFetch(endpoint, options = {}) {
    const token = getToken();
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };
    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }
    return fetch(`${API_BASE}${endpoint}`, { ...options, headers });
}

async function checkAuth() {
    if (!getToken()) return null;
    try {
        const res = await apiFetch("/api/v1/auth/me");
        if (res.ok) {
            const data = await res.json();
            setUser(data.data);
            return data.data;
        } else {
            setToken(null);
            setUser(null);
            return null;
        }
    } catch (err) {
        console.error("Auth check failed", err);
        return null;
    }
}

function logout() {
    apiFetch("/api/v1/auth/signout", { method: 'POST' });
    setToken(null);
    setUser(null);
    window.location.href = "index.html";
}
