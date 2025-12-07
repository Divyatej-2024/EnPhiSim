import React from "react";

export default function EnphisimBrowser({ children }) {
  return (
    <div style={styles.browser}>
      {/* Top Browser Bar */}
      <div style={styles.browserTop}>
        <div style={styles.btns}>
          <div style={{ ...styles.circle, background: "#ff5f57" }}></div>
          <div style={{ ...styles.circle, background: "#ffbd2e" }}></div>
          <div style={{ ...styles.circle, background: "#28c840" }}></div>
        </div>

        {/* Tabs */}
        <div style={styles.tabs}>
          <div style={{ ...styles.tab, ...styles.activeTab }}>ENPHISIM · Mail</div>
          <div style={styles.tab}>Dashboard</div>
          <div style={styles.tab}>User Report</div>
        </div>

        {/* URL Bar */}
        <div style={styles.urlBar}>
          <span style={styles.secure}>🔒</span>
          https://mail.enphisim.com/inbox
        </div>
      </div>

      {/* Main Content */}
      <div style={styles.content}>
        <div style={styles.contentCard}>
          {/* Render anything inside the browser */}
          {children ? (
            children
          ) : (
            <>
              <h2>ENPHISIM Mail Viewer</h2>
              <p>This is a placeholder. Replace with phishing content or levels.</p>

              <ul>
                <li>Sender: it-supp0rt@enphisim.com</li>
                <li>Subject: Reset Your Password Urgently</li>
                <li>Phishing indicators go here…</li>
              </ul>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  browser: {
    width: "100%",
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    background: "#161b22",
    color: "#e6edf3",
    overflow: "hidden",
  },

  browserTop: {
    display: "flex",
    alignItems: "center",
    padding: "8px 12px",
    gap: "8px",
    background: "#0d1117",
    borderBottom: "1px solid #21262d",
  },

  btns: {
    display: "flex",
    gap: "6px",
  },

  circle: {
    width: "12px",
    height: "12px",
    borderRadius: "50%",
  },

  tabs: {
    display: "flex",
    gap: "4px",
    marginLeft: "10px",
  },

  tab: {
    padding: "6px 12px",
    background: "#21262d",
    borderRadius: "4px",
    fontSize: "13px",
    color: "#c9d1d9",
  },

  activeTab: {
    background: "#2d333b",
    borderBottom: "2px solid #2382f1",
    color: "#ffffff",
  },

  urlBar: {
    flex: 1,
    background: "#21262d",
    padding: "6px 10px",
    borderRadius: "4px",
    color: "#8b949e",
    fontSize: "14px",
    overflow: "hidden",
    whiteSpace: "nowrap",
  },

  secure: {
    color: "#3fb950",
    marginRight: "6px",
  },

  content: {
    flex: 1,
    background: "#0d1117",
    padding: "20px",
    overflowY: "auto",
  },

  contentCard: {
    background: "#161b22",
    border: "1px solid #21262d",
    padding: "20px",
    borderRadius: "6px",
  },
};
