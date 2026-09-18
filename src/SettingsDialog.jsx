import "./App.css"; 

export default function SettingsDialog({
  isOpen,
  onClose,
  searchEngine,
  setSearchEngine,
  theme,
  setTheme,
  language,
  setLanguage,
  settingsNotice,
  onFeatureSelect,
  downloads,
  copy,
}) {
  if (!isOpen) return null;

  return (
    <div className="dialog-overlay-shield" onClick={onClose}>
      <div className="settings-popup-panel" onClick={(e) => e.stopPropagation()}>
        {/* Upper Window Header Panel */}
        <div className="dialog-header-strip">
          <h3>{copy.preferences}</h3>
          <button className="dialog-close-x-btn" onClick={onClose}>×</button>
        </div>

        <div className="menu-divider" />

        {/* Search Selection Section */}
        <div className="menu-section">
          <label className="menu-label">{copy.searchEngine}</label>
          <select 
            className="menu-select-dropdown"
            value={searchEngine}
            onChange={(e) => setSearchEngine(e.target.value)}
          >
            <option value="google">Google Search</option>
            <option value="duckduckgo">DuckDuckGo</option>
            <option value="bing">Bing</option>
          </select>
        </div>

        {/* Display Palette Selection Section */}
        <div className="menu-section">
          <label className="menu-label">{copy.displayTheme}</label>
          <div className="theme-toggle-strip">
            <button
              className={`theme-pill ${theme === "dark" ? "active" : ""}`}
              onClick={() => setTheme("dark")}
            >
              {copy.dark}
            </button>
            <button
              className={`theme-pill ${theme === "light" ? "active" : ""}`}
              onClick={() => setTheme("light")}
            >
              {copy.light}
            </button>
          </div>
        </div>

        {/* Standalone Feature Rows */}
        <div className="menu-item-row">
          <span>🌐 {copy.language}</span>
          <select
            className="language-select"
            value={language}
            onChange={(event) => setLanguage(event.target.value)}
            aria-label="Language"
          >
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="hi">Hindi</option>
            <option value="de">German</option>
          </select>
        </div>

        <button
          className="menu-item-row menu-action"
          onClick={() => onFeatureSelect(
            downloads.length === 0 ? copy.noDownloads : ""
          )}
        >
          <span>📥 {copy.downloads}</span>
          <span className="item-action">{downloads.length}</span>
        </button>

        {downloads.length > 0 && (
          <div className="downloads-list">
            {downloads.map((download) => (
              <div className="download-item" key={download.id}>
                <span className="download-name">{download.filename}</span>
                <span className="download-state">
                  {copy.downloadStates[download.state] || download.state}
                </span>
              </div>
            ))}
          </div>
        )}

        {settingsNotice && <p className="settings-notice">{settingsNotice}</p>}

        <div className="menu-divider" />

        {/* Developer Credit Panel Anchor */}
        <div className="credits-display-card">
          <p className="credits-app-title">Browse The Web v1.0.0</p>
          <p className="credits-author-line">
            {copy.designedBy}{" "}
            <a 
              href="https://github.com/PSANDILYA1440" 
              target="_blank" 
              rel="noreferrer"
              className="author-profile-link"
            >
              Prakhhar Sandilya (PSANDILYA1440)
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
