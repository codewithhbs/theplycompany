const Auth = {
  getToken: () => localStorage.getItem("pte_admin_token"),
  setToken: (t) => localStorage.setItem("pte_admin_token", t),
  clear: () => localStorage.removeItem("pte_admin_token"),
};

const API = {
  async request(path, options = {}, auth = true) {
    const headers = options.headers || {};
    if (auth && Auth.getToken()) headers["Authorization"] = "Bearer " + Auth.getToken();
    if (!(options.body instanceof FormData) && options.body) {
      headers["Content-Type"] = "application/json";
    }
    const res = await fetch(path, { ...options, headers });
    if (res.status === 401) {
      Auth.clear();
      window.location.href = "index.html";
      throw new Error("Session expired, please login again");
    }
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.message || "Request failed");
    return data;
  },
  get(path, auth = true) {
    return this.request(path, { method: "GET" }, auth);
  },
  post(path, body, auth = true) {
    const isForm = body instanceof FormData;
    return this.request(path, { method: "POST", body: isForm ? body : JSON.stringify(body) }, auth);
  },
  put(path, body, auth = true) {
    const isForm = body instanceof FormData;
    return this.request(path, { method: "PUT", body: isForm ? body : JSON.stringify(body) }, auth);
  },
  delete(path, auth = true) {
    return this.request(path, { method: "DELETE" }, auth);
  },
};
