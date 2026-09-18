import { useState, useRef } from "react";
import SettingsDialog from "./SettingsDialog"; 
import "./App.css"; 

function App() {
  const [address, setAddress] = useState("");
  const [activeUrl, setActiveUrl] = useState(""); 
  const [searchEngine, setSearchEngine] = useState("google");
  const [isMenuOpen, setIsMenuOpen] = useState(false); 
  const webviewRef = useRef(null); // 🟢 Swapped iframeRef for a native webview reference

  const handleFormSubmit = (e, targetUrl) => {
    e.preventDefault();
    let cleanUrl = targetUrl.trim();
    if (!cleanUrl) return;

    if (cleanUrl.includes(" ") || !cleanUrl.includes(".")) {
      if (searchEngine === "google") {
        cleanUrl = `https://www.google.com/search?q=${encodeURIComponent(cleanUrl)}`;
      } else {
        cleanUrl = `https://duckduckgo.com{encodeURIComponent(cleanUrl)}`;
      }
    } else {
      if (!/^https?:\/\//i.test(cleanUrl)) {
        cleanUrl = "https://" + cleanUrl;
      }
    }

    setActiveUrl(cleanUrl);
    setAddress(cleanUrl);
  };

  // 🟢 FIXED NAVIGATION: Native webview tag reload handler avoids memory bottlenecks
  const handleReload = () => {
    if (webviewRef.current) {
      webviewRef.current.reload();
    }
  };

  const goHome = () => {
    setActiveUrl("");
    setAddress("");
  };

  return (
    <main className="browser">
      {/* --- PREMIUM NAVIGATION TOOLBAR HEADER --- */}
      <header className="toolbar">
        <div className="navigation">
          <button 
            className={`toolbar-button ${!activeUrl ? "disabled" : ""}`} 
            onClick={goHome} 
            aria-label="Back to Home"
          >
            ‹
          </button>
          <button className="toolbar-button disabled" aria-label="Forward">›</button>
          <button 
            className={`toolbar-button ${!activeUrl ? "disabled" : ""}`} 
            onClick={handleReload} 
            aria-label="Reload"
          >
            ↻
          </button>
        </div>

        <form className="address-form" onSubmit={(e) => handleFormSubmit(e, address)}>
          <span className="search-icon">⌕</span>
          <input
            value={address}
            onChange={(event) => setAddress(event.target.value)}
            placeholder="Search or enter address..."
            spellCheck="false"
            aria-label="Address"
          />
        </form>

        <button 
          className={`toolbar-button menu-button ${isMenuOpen ? "active" : ""}`} 
          onClick={() => setIsMenuOpen(true)}
          aria-label="Menu"
        >
          ⋯
        </button>
      </header>

      {/* --- CONTENT WORKSPACE LAYER --- */}
      <div className="browser-content-container">
        {activeUrl === "" ? (
          <section className="new-tab">
            <img src="/Logo.png" className="homepage-logo-img" alt="Browse The Web Logo" />
            <h1>Browse The Web</h1>
            <p>Fast · Private · Yours</p>

            <form className="home-search" onSubmit={(e) => handleFormSubmit(e, address)}>
              <span className="search-icon">⌕</span>
              <input
                value={address}
                onChange={(event) => setAddress(event.target.value)}
                placeholder="Search the web..."
                spellCheck="false"
                aria-label="Search"
              />
            </form>
          </section>
        ) : (
          <div className="embedded-viewport">
            {/* 🟢 FIXED: Swapped for persistent <webview> node with native scripts enabled */}
            <webview 
              ref={webviewRef}
              src={activeUrl} 
              className="web-content-frame" 
              allowpopups="true"
            />
          </div>
        )}
      </div>

      {/* --- CENTERING PREFERENCES POPUP LAYER --- */}
      <SettingsDialog 
        isOpen={isMenuOpen} 
        onClose={() => setIsMenuOpen(false)}
        searchEngine={searchEngine}
        setSearchEngine={setSearchEngine}
      />
    </main>
  );
}

export default App;
