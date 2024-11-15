import React from "react";

const Score = () => {
  return (
    <div style={styles.container}>
      <h2 style={styles.title}>A TEST</h2>
      <div style={styles.tabs}>
        <span style={{ ...styles.tab, ...styles.activeTab }}>Test Result</span>
        <span style={styles.tab}>Analysis</span>
      </div>
      <div style={styles.content}>
        <h3 style={styles.candidateInfo}>Candidate: Lucy</h3>
        <p style={styles.timeInfo}>
          Start Time: 2021-03-23 11:53:46 | Submit Time: 2021-03-23 11:54:06
        </p>
        <div style={styles.scoreSection}>
          <div style={styles.scoreText}>
            <p style={styles.scoreLabel}>Total Score</p>
            <p style={styles.scoreNumber}>100</p>
          </div>
          <div style={styles.scoreCircle}>
            <p style={styles.circleText}>100</p>
            <p style={styles.circleLabel}>Candidate's Score</p>
          </div>
          <div style={styles.timeTaken}>
            <p style={styles.timeLabel}>Time</p>
            <p style={styles.timeValue}>20 sec</p>
          </div>
        </div>
      </div>
      <div style={styles.footer}>
        <a href="#" style={styles.link}>
          View Score Report
        </a>
        <p style={styles.scoreCode}>Score Code</p>
        <p style={styles.inquiryCode}>DFDQ2K22</p>
        <div style={styles.shareIcons}>
          <span style={styles.shareIcon}>F</span>{" "}
          {/* Placeholder for Facebook icon */}
          <span style={styles.shareIcon}>T</span>{" "}
          {/* Placeholder for Twitter icon */}
          <span style={styles.shareIcon}>G</span>{" "}
          {/* Placeholder for Google+ icon */}
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    width: "80%", // Increased width to make the content more prominent
    margin: "0 auto",
    textAlign: "center",
    fontFamily: "Arial, sans-serif",
    color: "#333",
    padding: "20px",
  },
  title: {
    fontSize: "2em", // Increased title font size
    color: "#1a73e8",
  },
  tabs: {
    display: "flex",
    justifyContent: "center",
    margin: "20px 0",
  },
  tab: {
    padding: "10px 20px",
    cursor: "pointer",
    color: "#1a73e8",
    fontSize: "1.2em", // Larger tab font size
  },
  activeTab: {
    borderBottom: "3px solid #1a73e8",
  },
  content: {
    marginTop: "30px",
  },
  candidateInfo: {
    fontSize: "1.5em", // Increased candidate info font size
  },
  timeInfo: {
    color: "#777",
    fontSize: "1.1em", // Increased time info font size
    marginBottom: "30px",
  },
  scoreSection: {
    display: "flex",
    justifyContent: "space-evenly",
    alignItems: "center",
    margin: "30px 0",
  },
  scoreText: {
    textAlign: "center",
  },
  scoreLabel: {
    fontSize: "1.2em", // Larger score label font size
    color: "#777",
  },
  scoreNumber: {
    fontSize: "2em", // Increased score number size
    fontWeight: "bold",
    color: "#1a73e8",
  },
  scoreCircle: {
    width: "120px", // Larger circle size
    height: "120px",
    borderRadius: "50%",
    border: "4px solid #1a73e8",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    color: "#1a73e8",
  },
  circleText: {
    fontSize: "2.5em", // Increased font size for circle text
    margin: 0,
  },
  circleLabel: {
    fontSize: "1em", // Increased label size inside circle
  },
  timeTaken: {
    textAlign: "center",
  },
  timeLabel: {
    fontSize: "1.2em", // Larger time label
    color: "#777",
  },
  timeValue: {
    fontSize: "1.5em", // Larger time value
    fontWeight: "bold",
    color: "#1a73e8",
  },
  footer: {
    marginTop: "30px",
    textAlign: "center",
  },
  link: {
    color: "#1a73e8",
    textDecoration: "none",
    display: "block",
    marginBottom: "20px",
    fontSize: "1.1em", // Larger font size for link
  },
  scoreCode: {
    fontSize: "1.1em", // Larger font size for score code
    color: "#777",
  },
  inquiryCode: {
    fontSize: "1.5em", // Larger inquiry code font size
    fontWeight: "bold",
  },
  shareIcons: {
    marginTop: "20px",
    display: "flex",
    justifyContent: "center",
    gap: "15px", // Increased gap between icons
  },
  shareIcon: {
    backgroundColor: "#ddd",
    width: "30px", // Increased icon size
    height: "30px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1.2em", // Increased icon font size
    color: "#333",
  },
};

export default Score;
