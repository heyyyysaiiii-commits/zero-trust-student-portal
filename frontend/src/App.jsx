import { useState } from "react";
import "./App.css";

// Academic demonstration account requested for this prototype.
// This is client-side demo authentication, not production-grade authentication.
const DEMO_ACCOUNT = {
  studentId: "STU001",
  password: "Rahul123",
  name: "Rahul",
  program: "B.Tech Computer Science",
  semester: "6th Semester",
  academicYear: "2025 - 2026",
  deviceStatus: "verified",
  riskLevel: "low",
  riskScore: 15,
};

const SESSION_KEY = "zero-trust-student-portal-demo-session";

function readSavedSession() {
  try {
    const saved = sessionStorage.getItem(SESSION_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
}

function App() {
  const [savedSession] = useState(() => readSavedSession());
  const [page, setPage] = useState(savedSession ? "dashboard" : "login");
  const [studentId, setStudentId] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(savedSession);
  const [accessMessage, setAccessMessage] = useState(
    savedSession ? "Access Granted" : ""
  );
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // LOGIN: This project follows the report's frontend-prototype scope.
  // Credentials are checked locally so the Vercel demo does not depend on MongoDB.
  const handleLogin = (event) => {
    event.preventDefault();
    setErrorMessage("");

    if (!studentId.trim() || !password) {
      setErrorMessage("Please enter Student ID and Password.");
      return;
    }

    setLoading(true);
    const validLogin =
      studentId.trim().toUpperCase() === DEMO_ACCOUNT.studentId &&
      password === DEMO_ACCOUNT.password;

    if (!validLogin) {
      setLoading(false);
      setErrorMessage("Invalid Student ID or Password. Please try again.");
      return;
    }

    setUser({
      studentId: DEMO_ACCOUNT.studentId,
      name: DEMO_ACCOUNT.name,
      program: DEMO_ACCOUNT.program,
      semester: DEMO_ACCOUNT.semester,
      academicYear: DEMO_ACCOUNT.academicYear,
      deviceStatus: DEMO_ACCOUNT.deviceStatus,
      riskLevel: DEMO_ACCOUNT.riskLevel,
      riskScore: DEMO_ACCOUNT.riskScore,
    });
    setPassword("");
    setLoading(false);
    setPage("verification");
  };

  // ZERO TRUST ACCESS: The report's prototype displays a fixed 15/100 low-risk score.
  const grantAccess = () => {
    if (!user) {
      setPage("login");
      setErrorMessage("Please log in again to verify your identity.");
      return;
    }

    const session = {
      studentId: user.studentId,
      name: user.name,
      program: user.program,
      semester: user.semester,
      academicYear: user.academicYear,
      deviceStatus: user.deviceStatus,
      riskLevel: user.riskLevel,
      riskScore: user.riskScore,
    };

    try {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
    } catch {
      // The in-memory session still works if browser storage is unavailable.
    }

    setAccessMessage("Access Granted");
    setPage("dashboard");
  };

  // LOGOUT
  const handleLogout = () => {
    try {
      sessionStorage.removeItem(SESSION_KEY);
    } catch {
      // Ignore storage errors and clear the in-memory session below.
    }

    setStudentId("");
    setPassword("");
    setUser(null);
    setAccessMessage("");
    setErrorMessage("");
    setPage("login");
  };

  // SECURITY VERIFICATION
  if (page === "verification") {
    return (
      <div className="verification-container">
        <div className="verification-card">
          <div className="security-icon" aria-hidden="true">🔐</div>
          <h1>Security Verification</h1>
          <p className="verification-subtitle">
            Checking your access before allowing entry
          </p>

          <div className="security-check">
            <span aria-hidden="true">✓</span>
            <div>
              <strong>Identity Verification</strong>
              <p>Student identity detected</p>
            </div>
          </div>

          <div className="security-check">
            <span aria-hidden="true">✓</span>
            <div>
              <strong>Device Verification</strong>
              <p>Device information checked</p>
            </div>
          </div>

          <div className="security-check">
            <span aria-hidden="true">✓</span>
            <div>
              <strong>Risk Assessment</strong>
              <p>Low risk detected</p>
            </div>
          </div>

          <div className="risk-box">
            <h3>Risk Score</h3>
            <div className="risk-score">15 / 100</div>
            <p>Low Risk</p>
          </div>

          <button
            className="access-button"
            type="button"
            onClick={grantAccess}
            disabled={loading}
          >
            {loading ? "Verifying..." : "Grant Secure Access"}
          </button>
        </div>
      </div>
    );
  }

  // ACADEMICS
  if (page === "academics") {
    return (
      <div className="detail-page">
        <div className="detail-card">
          <div className="detail-icon" aria-hidden="true">📚</div>
          <h1>Academics</h1>
          <p className="detail-subtitle">Your academic information</p>

          <div className="info-section">
            <h2>🎓 Course Information</h2>
            <p><strong>Student ID:</strong> {user?.studentId || DEMO_ACCOUNT.studentId}</p>
            <p><strong>Program:</strong> B.Tech Computer Science</p>
            <p><strong>Semester:</strong> 6th Semester</p>
            <p><strong>Academic Year:</strong> 2025 - 2026</p>
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

          <button className="back-button" type="button" onClick={() => setPage("dashboard")}>
            ← Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // ATTENDANCE
  if (page === "attendance") {
    return (
      <div className="detail-page">
        <div className="detail-card">
          <div className="detail-icon" aria-hidden="true">📊</div>
          <h1>Attendance</h1>
          <p className="detail-subtitle">Your current attendance information</p>

          <div className="attendance-summary">
            <div className="attendance-circle">
              <strong>87%</strong>
              <span>Overall</span>
            </div>
          </div>

          <div className="info-section">
            <h2>📅 Subject-wise Attendance</h2>
            <div className="attendance-row"><span>Computer Networks</span><strong>92%</strong></div>
            <div className="attendance-row"><span>DBMS</span><strong>88%</strong></div>
            <div className="attendance-row"><span>Cloud Computing</span><strong>85%</strong></div>
            <div className="attendance-row"><span>Cyber Security</span><strong>90%</strong></div>
            <div className="attendance-row"><span>Web Technologies</span><strong>80%</strong></div>
          </div>

          <button className="back-button" type="button" onClick={() => setPage("dashboard")}>
            ← Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // EXAMINATION MARKS
  if (page === "marks") {
    return (
      <div className="detail-page">
        <div className="detail-card">
          <div className="detail-icon" aria-hidden="true">📝</div>
          <h1>Examination Marks</h1>
          <p className="detail-subtitle">Your latest examination results</p>

          <div className="marks-table">
            <div className="marks-header">
              <span>Subject</span><span>Marks</span><span>Grade</span>
            </div>
            <div className="marks-row"><span>Computer Networks</span><span>88 / 100</span><strong>A</strong></div>
            <div className="marks-row"><span>DBMS</span><span>91 / 100</span><strong>A+</strong></div>
            <div className="marks-row"><span>Cloud Computing</span><span>84 / 100</span><strong>A</strong></div>
            <div className="marks-row"><span>Cyber Security</span><span>94 / 100</span><strong>A+</strong></div>
            <div className="marks-row"><span>Web Technologies</span><span>86 / 100</span><strong>A</strong></div>
          </div>

          <div className="total-marks">
            <h2>Overall Performance</h2>
            <p>Average: <strong>88.6%</strong></p>
          </div>

          <button className="back-button" type="button" onClick={() => setPage("dashboard")}>
            ← Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // NOTIFICATIONS
  if (page === "notifications") {
    return (
      <div className="detail-page">
        <div className="detail-card">
          <div className="detail-icon" aria-hidden="true">🔔</div>
          <h1>Notifications</h1>
          <p className="detail-subtitle">Important announcements and updates</p>

          <div className="notification-item">
            <h2>📢 Semester Examination</h2>
            <p>The semester examinations will begin from 25th August 2026. Please check the examination timetable.</p>
            <small>Posted: 12 August 2026</small>
          </div>

          <div className="notification-item">
            <h2>📚 Assignment Submission</h2>
            <p>Cyber Security assignment submission deadline is 20th August 2026.</p>
            <small>Posted: 10 August 2026</small>
          </div>

          <div className="notification-item">
            <h2>🎓 Student Meeting</h2>
            <p>A student interaction meeting will be conducted this Friday at 2:00 PM.</p>
            <small>Posted: 8 August 2026</small>
          </div>

          <button className="back-button" type="button" onClick={() => setPage("dashboard")}>
            ← Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // STUDENT DASHBOARD
  if (page === "dashboard") {
    const modules = [
      { id: "academics", icon: "📚", title: "Academics", description: "View your academic information." },
      { id: "attendance", icon: "📊", title: "Attendance", description: "Check your attendance." },
      { id: "marks", icon: "📝", title: "Marks", description: "View your examination marks." },
      { id: "notifications", icon: "🔔", title: "Notifications", description: "Check important notifications." },
    ];

    return (
      <div className="dashboard">
        <h1>Welcome to Zero Trust Student Portal</h1>
        <p>Student ID: <strong>{user?.studentId || DEMO_ACCOUNT.studentId}</strong></p>

        <div className="dashboard-cards">
          {modules.map((module) => (
            <div
              key={module.id}
              className="dashboard-card clickable"
              role="button"
              tabIndex={0}
              onClick={() => setPage(module.id)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  setPage(module.id);
                }
              }}
            >
              <h2>{module.icon} {module.title}</h2>
              <p>{module.description}</p>
              <span>Click to view →</span>
            </div>
          ))}
        </div>

        <button className="logout-button" type="button" onClick={handleLogout}>
          Logout
        </button>
      </div>
    );
  }

  // LOGIN
  return (
    <div className="login-container">
      <div className="login-card">
        <h1>🔐 Zero Trust</h1>
        <h2>Student Portal</h2>

        <form onSubmit={handleLogin}>
          <input
            type="text"
            name="studentId"
            placeholder="Enter Student ID"
            aria-label="Student ID"
            autoComplete="username"
            value={studentId}
            onChange={(event) => {
              setStudentId(event.target.value);
              setErrorMessage("");
            }}
          />
          <input
            type="password"
            name="password"
            placeholder="Enter Password"
            aria-label="Password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => {
              setPassword(event.target.value);
              setErrorMessage("");
            }}
          />

          {errorMessage && (
            <p className="login-error" role="alert">{errorMessage}</p>
          )}

          <button type="submit" disabled={loading}>
            {loading ? "Authenticating..." : "Secure Login"}
          </button>
        </form>

        <div className="security-text">
          ✓ Identity Verification
          <br />
          ✓ Secure Access Control
        </div>
      </div>
    </div>
  );
}

export default App;
