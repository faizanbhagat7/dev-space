import React from "react";

const Loader = () => (
  <div style={{
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "60vh",
    gap: 12,
    fontFamily: "var(--font-mono)",
    fontSize: 11,
    color: "var(--text-muted)",
    letterSpacing: "0.08em",
  }}>
    <div style={{
      width: 36,
      height: 36,
      border: "2.5px solid var(--cream-darker)",
      borderTopColor: "var(--magenta)",
      borderRadius: "50%",
      animation: "spin 0.8s linear infinite",
    }} />
    <span>// loading...</span>
    <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
  </div>
);

export default Loader;
