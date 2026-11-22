import { useState } from "react";
import "./App.css";
import API from "./api/api";

function App() {
  const [page, setPage] = useState("login");

  const [studentId, setStudentId] = useState("");
  const [password, setPassword] = useState("");

  const [user, setUser] = useState(null);
  const [accessMessage, setAccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // =========================
  // LOGIN
  // =========================
  const handleLogin = async () => {
    if (!studentId || !password) {
      alert("Please enter Student ID and Password");
      return;
    }

    try {
      setLoading(true);

      const response = await API.post("/login", {
        studentId,
        password,
      });

      // Save JWT token
      localStorage.setItem("token", response.data.token);

      // Save user details
      setUser(response.data.user);

      // Go to security verification
      setPage("verification");
    } catch (error) {
      console.error("Login error:", error);

      alert(
        error.response?.data?.message ||
          "Login failed. Please check your Student ID and Password."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // ZERO TRUST ACCESS
  // =========================
  const grantAccess = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      if (!token) {
        alert("Session expired. Please login again.");
        setPage("login");
        return;
      }

      const response = await API.get("/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Access granted
      setUser(response.data.user);
      setAccessMessage("Access Granted");
      setPage("dashboard");
    } catch (error) {
      console.error("Zero Trust error:", error);

      const message =
        error.response?.data?.message ||
        "Access denied by Zero Trust security.";

      setAccessMessage(message);

      alert(`Access Denied: ${message}`);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // LOGOUT
  // =========================
  const handleLogout = () => {
    localStorage.removeItem("token");

    setStudentId("");
    setPassword("");
    setUser(null);
    setAccessMessage("");

    setPage("login");
  };

  // =========================
  // SECURITY VERIFICATION
  // =========================
  if (page === "verification") {
    return (
      <div className="verification-container">
        <div className="verification-card">
          <div className="security-icon">🔐</div>

          <h1>Security Verification</h1>

          <p className="verification-subtitle">
            Checking your access before allowing entry
          </p>

          <div className="security-check">
            <span>✓</span>

            <div>
              <strong>Identity Verification</strong>

              <p>
                {user?.name
                  ? `${user.name} identified successfully`
                  : "Student identity verified"}
              </p>
            </div>
          </div>

          <div className="security-check">
            <span>✓</span>

            <div>
              <strong>Device Verification</strong>

              <p>
                Device status:{" "}
                <strong>
                  {user?.deviceStatus || "Checking..."}
                </strong>
              </p>
            </div>
          </div>

          <div className="security-check">
            <span>✓</span>

            <div>
              <strong>Risk Assessment</strong>

              <p>
                Risk level:{" "}
                <strong>
                  {user?.riskLevel || "Checking..."}
                </strong>
              </p>
            </div>
          </div>

          <div className="risk-box">
            <h3>Risk Assessment</h3>

            <div className="risk-score">
              {user?.riskLevel === "low"
                ? "15 / 100"
                : "High Risk"}
            </div>

            <p>
              {user?.riskLevel === "low"
                ? "Low Risk"
                : "Risk requires verification"}
            </p>
          </div>

          <button
            className="access-button"
            onClick={grantAccess}
            disabled={loading}
          >
            {loading
              ? "Verifying..."
              : "Grant Secure Access"}
          </button>
        </div>
      </div>
    );
  }

  // =========================
  // ACADEMICS
  // =========================
  if (page === "academics") {
    return (
      <div className="detail-page">
        <div className="detail-card">
          <div className="detail-icon">📚</div>

          <h1>Academics</h1>

          <p className="detail-subtitle">
            Your academic information
          </p>

          <div className="info-section">
            <h2>🎓 Course Information</h2>

            <p>
              <strong>Student ID:</strong>{" "}
              {user?.studentId || studentId}
            </p>

            <p>
              <strong>Program:</strong> B.Tech Computer Science
            </p>

            <p>
              <strong>Semester:</strong> 6th Semester
            </p>

            <p>
              <strong>Academic Year:</strong> 2025 - 2026
            </p>
          </div>

          <div className="info-section">
            <h2>📖 Current Subjects</h2>

            <ul>
              <li>Computer Networks</li>
              <li>Database Management Systems</li>
              <li>Cloud Computing</li>
              <li>Cyber Security</li>
              <li>Web Technologies</li>
            </ul>
          </div>

          <button
            className="back-button"
            onClick={() => setPage("dashboard")}
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // =========================
  // ATTENDANCE
  // =========================
  if (page === "attendance") {
    return (
      <div className="detail-page">
        <div className="detail-card">
          <div className="detail-icon">📊</div>

          <h1>Attendance</h1>

          <p className="detail-subtitle">
            Your current attendance information
          </p>

          <div className="attendance-summary">
            <div className="attendance-circle">
              <strong>87%</strong>
              <span>Overall</span>
            </div>
          </div>

          <div className="info-section">
            <h2>📅 Subject-wise Attendance</h2>

            <div className="attendance-row">
              <span>Computer Networks</span>
              <strong>92%</strong>
            </div>

            <div className="attendance-row">
              <span>DBMS</span>
              <strong>88%</strong>
            </div>

            <div className="attendance-row">
              <span>Cloud Computing</span>
              <strong>85%</strong>
            </div>

            <div className="attendance-row">
              <span>Cyber Security</span>
              <strong>90%</strong>
            </div>

            <div className="attendance-row">
              <span>Web Technologies</span>
              <strong>80%</strong>
            </div>
          </div>

          <button
            className="back-button"
            onClick={() => setPage("dashboard")}
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // =========================
  // MARKS
  // =========================
  if (page === "marks") {
    return (
      <div className="detail-page">
        <div className="detail-card">
          <div className="detail-icon">📝</div>

          <h1>Examination Marks</h1>

          <p className="detail-subtitle">
            Your latest examination results
          </p>

          <div className="marks-table">
            <div className="marks-header">
              <span>Subject</span>
              <span>Marks</span>
              <span>Grade</span>
            </div>

            <div className="marks-row">
              <span>Computer Networks</span>
              <span>88 / 100</span>
              <strong>A</strong>
            </div>

            <div className="marks-row">
              <span>DBMS</span>
              <span>91 / 100</span>
              <strong>A+</strong>
            </div>

            <div className="marks-row">
              <span>Cloud Computing</span>
              <span>84 / 100</span>
              <strong>A</strong>
            </div>

            <div className="marks-row">
              <span>Cyber Security</span>
              <span>94 / 100</span>
              <strong>A+</strong>
            </div>

            <div className="marks-row">
              <span>Web Technologies</span>
              <span>86 / 100</span>
              <strong>A</strong>
            </div>
          </div>

          <div className="total-marks">
            <h2>Overall Performance</h2>

            <p>
              Average: <strong>88.6%</strong>
            </p>
          </div>

          <button
            className="back-button"
            onClick={() => setPage("dashboard")}
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // =========================
  // NOTIFICATIONS
  // =========================
  if (page === "notifications") {
    return (
      <div className="detail-page">
        <div className="detail-card">
          <div className="detail-icon">🔔</div>

          <h1>Notifications</h1>

          <p className="detail-subtitle">
            Important announcements and updates
          </p>

          <div className="notification-item">
            <h2>📢 Semester Examination</h2>

            <p>
              The semester examinations will begin from
              25th August 2026. Please check the examination
              timetable.
            </p>

            <small>Posted: 12 August 2026</small>
          </div>

          <div className="notification-item">
            <h2>📚 Assignment Submission</h2>

            <p>
              Cyber Security assignment submission deadline
              is 20th August 2026.
            </p>

            <small>Posted: 10 August 2026</small>
          </div>

          <div className="notification-item">
            <h2>🎓 Student Meeting</h2>

            <p>
              A student interaction meeting will be
              conducted this Friday at 2:00 PM.
            </p>

            <small>Posted: 8 August 2026</small>
          </div>

          <button
            className="back-button"
            onClick={() => setPage("dashboard")}
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // =========================
  // DASHBOARD
  // =========================
  if (page === "dashboard") {
    return (
      <div className="dashboard">
        <h1>Welcome to Zero Trust Student Portal</h1>

        <p>
          Student ID:{" "}
          <strong>
            {user?.studentId || studentId}
          </strong>
        </p>

        <p>
          Welcome,{" "}
          <strong>
            {user?.name || "Student"}
          </strong>
        </p>

        <div className="dashboard-cards">
          <div
            className="dashboard-card clickable"
            onClick={() => setPage("academics")}
          >
            <h2>📚 Academics</h2>
            <p>View your academic information.</p>
            <span>Click to view →</span>
          </div>

          <div
            className="dashboard-card clickable"
            onClick={() => setPage("attendance")}
          >
            <h2>📊 Attendance</h2>
            <p>Check your attendance.</p>
            <span>Click to view →</span>
          </div>

          <div
            className="dashboard-card clickable"
            onClick={() => setPage("marks")}
          >
            <h2>📝 Marks</h2>
            <p>View your examination marks.</p>
            <span>Click to view →</span>
          </div>

          <div
            className="dashboard-card clickable"
            onClick={() => setPage("notifications")}
          >
            <h2>🔔 Notifications</h2>
            <p>Check important notifications.</p>
            <span>Click to view →</span>
          </div>
        </div>

        {/* ZERO TRUST STATUS */}
        <div className="security-check">
          <span>✓</span>

          <div>
            <strong>Zero Trust Access</strong>

            <p>
              Device:{" "}
              {user?.deviceStatus || "Unknown"}{" "}
              | Risk:{" "}
              {user?.riskLevel || "Unknown"}
            </p>

            <p>
              <strong>
                {accessMessage || "Access Granted"}
              </strong>
            </p>
          </div>
        </div>

        <button
          className="logout-button"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    );
  }

  // =========================
  // LOGIN
  // =========================
  return (
    <div className="login-container">
      <div className="login-card">
        <h1>🔐 Zero Trust</h1>

        <h2>Student Portal</h2>

        <input
          type="text"
          placeholder="Enter Student ID"
          value={studentId}
          onChange={(e) =>
            setStudentId(e.target.value)
          }
        />

        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
        />

        <button
          onClick={handleLogin}
          disabled={loading}
        >
          {loading
            ? "Authenticating..."
            : "Secure Login"}
        </button>

        <div className="security-text">
          ✓ Identity Verification
          <br />
          ✓ Secure Access Control
          <br />
          ✓ Zero Trust Security
        </div>
      </div>
    </div>
  );
}

export default App;