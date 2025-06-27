import { useState } from "react";

import "./App.css";

const backendIp = import.meta.env.VITE_BACKEND_URL;
//const backendUrl = `http://${backendIp}:3001/api/resolve-ip`;
const backendUrl = `http://dev-env:3001/api/resolve-ip`;

function App() {
  const [count, setCount] = useState(0);
  const [url, setUrl] = useState("url");
  const [ip, setIp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fullurl = url + ".myflex.app";

  const handleSearch = async () => {
    setLoading(true);
    setError("");
    setIp("");
    const controller = new AbortController();
    const timeout = setTimeout(() => {
      controller.abort();
      setLoading(false);
      setError("Request timed out");
    }, 10000);
    try {
      const response = await fetch(backendUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: fullurl }),
        signal: controller.signal,
      });
      clearTimeout(timeout);
      const data = await response.json();
      if (data.ip) {
        setIp(data.ip);
      } else {
        setError("Not found");
      }
    } catch (err) {
      if (err.name === "AbortError") return;
      setError("Error contacting backend");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mainbox">
      <h1>Flex IP Finder</h1>
      <div className="searchbox">
        <label>Input Flex URL</label>
        <div className="seachbar">
          <input type="text" onChange={(e) => setUrl(e.target.value)} />
          <p>.myflex.app</p>
        </div>
      </div>
      <button onClick={handleSearch} disabled={loading}>
        Search
      </button>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {ip && <p>{ip}</p>}
      {!ip && !loading && !error && <p>{fullurl}</p>}
    </div>
  );
}

export default App;
