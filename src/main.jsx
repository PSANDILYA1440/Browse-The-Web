import { StrictMode, useEffect, useState, useRef } from "react";
import { createRoot } from "react-dom/client";
import SettingsDialog from "./SettingsDialog"; 
import "./App.css"; 
import "./index.css";

const translations = {
  en: {
    preferences: "Preferences", searchEngine: "Search Engine", displayTheme: "Display Theme",
    dark: "Dark", light: "Light", language: "Language", downloads: "Downloads",
    noDownloads: "No downloads yet.", address: "Address", menu: "Menu",
    addressPlaceholder: "Search or enter address...", searchPlaceholder: "Search the web...",
    tagline: "Fast · Private · Yours", designedBy: "Designed & Developed by",
    downloadStates: { downloading: "Downloading", completed: "Completed", cancelled: "Cancelled", interrupted: "Failed" },
  },
  es: {
    preferences: "Preferencias", searchEngine: "Motor de búsqueda", displayTheme: "Tema de pantalla",
    dark: "Oscuro", light: "Claro", language: "Idioma", downloads: "Descargas",
    noDownloads: "Aún no hay descargas.", address: "Dirección", menu: "Menú",
    addressPlaceholder: "Busca o introduce una dirección...", searchPlaceholder: "Busca en la web...",
    tagline: "Rápido · Privado · Tuyo", designedBy: "Diseñado y desarrollado por",
    downloadStates: { downloading: "Descargando", completed: "Completado", cancelled: "Cancelado", interrupted: "Fallido" },
  },
  hi: {
    preferences: "प्राथमिकताएं", searchEngine: "सर्च इंजन", displayTheme: "डिस्प्ले थीम",
    dark: "डार्क", light: "लाइट", language: "भाषा", downloads: "डाउनलोड",
    noDownloads: "अभी तक कोई डाउनलोड नहीं।", address: "पता", menu: "मेनू",
    addressPlaceholder: "खोजें या पता दर्ज करें...", searchPlaceholder: "वेब पर खोजें...",
    tagline: "तेज़ · निजी · आपका", designedBy: "डिज़ाइन और विकास",
    downloadStates: { downloading: "डाउनलोड हो रहा है", completed: "पूरा हुआ", cancelled: "रद्द", interrupted: "विफल" },
  },
  de: {
    preferences: "Einstellungen", searchEngine: "Suchmaschine", displayTheme: "Darstellung",
    dark: "Dunkel", light: "Hell", language: "Sprache", downloads: "Downloads",
    noDownloads: "Noch keine Downloads.", address: "Adresse", menu: "Menü",
    addressPlaceholder: "Suchen oder Adresse eingeben...", searchPlaceholder: "Im Web suchen...",
    tagline: "Schnell · Privat · Dein", designedBy: "Entworfen und entwickelt von",
    downloadStates: { downloading: "Wird heruntergeladen", completed: "Abgeschlossen", cancelled: "Abgebrochen", interrupted: "Fehlgeschlagen" },
  },
};

function App() {
  const [address, setAddress] = useState("");
  const [activeUrl, setActiveUrl] = useState(""); 
  const [searchEngine, setSearchEngine] = useState("google");
  const [theme, setTheme] = useState("dark");
  const [language, setLanguage] = useState("en");
  const [settingsNotice, setSettingsNotice] = useState("");
  const [downloads, setDownloads] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false); 
  const iframeRef = useRef(null);

  useEffect(() => {
    const downloadApi = window.browserDownloads;
    if (!downloadApi) return undefined;

    downloadApi.getAll().then(setDownloads);
    return downloadApi.onUpdated(setDownloads);
  }, []);

  const handleFormSubmit = async (e, targetUrl) => {
    e.preventDefault();
    let cleanUrl = targetUrl.trim();
    if (!cleanUrl) return;

    // Smart Engine Query Parser - 100% clean, professional browser URL routing!
    if (cleanUrl.includes(" ") || !cleanUrl.includes(".")) {
      if (searchEngine === "google") {
        cleanUrl = `https://google.com/search?q=${encodeURIComponent(cleanUrl)}`;
      } else if (searchEngine === "duckduckgo") {
        cleanUrl = `https://duckduckgo.com/?q=${encodeURIComponent(cleanUrl)}`;
      } else {
        cleanUrl = `https://www.bing.com/search?q=${encodeURIComponent(cleanUrl)}`;
      }
    } else {
      if (!/^https?:\/\//i.test(cleanUrl)) {
        cleanUrl = "https://" + cleanUrl;
      }
    }

    const nativeBrowser = window.nativeBrowser;
    if (nativeBrowser) {
      cleanUrl = await nativeBrowser.routeUrl(cleanUrl);
    }
    setActiveUrl(cleanUrl);
    setAddress(cleanUrl);
  };

  const handleReload = () => {
    if (iframeRef.current) {
      iframeRef.current.reload();
    }
  };

  const handleNewWindow = (event) => {
    event.preventDefault();
    if (iframeRef.current) {
      iframeRef.current.loadURL(event.url);
    }
    setAddress(event.url);
  };

  const goHome = () => {
    setActiveUrl("");
    setAddress("");
  };

  const logoUrl = new URL("./images/Logo.png", import.meta.url).href;
  const copy = translations[language];

  return (
    <main className={`browser ${theme === "light" ? "light-theme" : ""}`}>
      {/* --- PREMIUM NAVIGATION TOOLBAR HEADER --- */}
      <header className="toolbar">
        <div className="navigation">
          <button 
            className={`toolbar-button ${!activeUrl ? "disabled" : ""}`} 
            onClick={goHome} 
            aria-label={copy.address}
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
            placeholder={copy.addressPlaceholder}
            spellCheck="false"
            aria-label={copy.address}
          />
        </form>

        <button 
          className={`toolbar-button menu-button ${isMenuOpen ? "active" : ""}`} 
          onClick={() => setIsMenuOpen(true)}
          aria-label={copy.menu}
        >
          ⋯
        </button>
      </header>

      {/* --- CONTENT WORKSPACE LAYER --- */}
      <div className="browser-content-container">
        {activeUrl === "" ? (
          <section className="new-tab">
            <img src={logoUrl} className="homepage-logo-img" alt="Browse The Web Logo" />
            <h1>Browse The Web</h1>
            <p>{copy.tagline}</p>

            <form className="home-search" onSubmit={(e) => handleFormSubmit(e, address)}>
              <span className="search-icon">⌕</span>
              <input
                value={address}
                onChange={(event) => setAddress(event.target.value)}
                placeholder={copy.searchPlaceholder}
                spellCheck="false"
                aria-label={copy.searchPlaceholder}
              />
            </form>
          </section>
        ) : (
          <div className="embedded-viewport">
            <webview
              ref={iframeRef}
              src={activeUrl} 
              partition="persist:browser"
              allowpopups
              onNewWindow={handleNewWindow}
              className="web-content-frame" 
              title="Chromium Workspace" 
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
        theme={theme}
        setTheme={setTheme}
        language={language}
        setLanguage={setLanguage}
        settingsNotice={settingsNotice}
        onFeatureSelect={setSettingsNotice}
        downloads={downloads}
        copy={copy}
      />
    </main>
  );
}

export default App;

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
