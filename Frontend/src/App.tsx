
import { Routes, Route } from "react-router-dom";
import DashboardPage from "./pages/DashboardPage";
import CandidatesPage from "./pages/CandidatesPage";
import InterviewsPage from "./pages/InterviewsPage";
import SettingsPage from "./pages/SettingsPage";
import AuthPage from "./pages/AuthPage";
import ProtectedRoute from "./components/ProtectedRoute";
import { ToastProvider } from "./components/ui/toast";
import { NotificationProvider } from "./lib/notificationContext";

export default function App() {
  return (
    <NotificationProvider>
      <ToastProvider>
        <Routes>
          <Route path="/" element={<AuthPage />} />
          <Route path="/signup" element={<AuthPage />} />
          <Route path="/signin" element={<AuthPage />} />
          <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/candidates" element={<ProtectedRoute><CandidatesPage /></ProtectedRoute>} />
          <Route path="/interviews" element={<ProtectedRoute><InterviewsPage /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
        </Routes>
      </ToastProvider>
    </NotificationProvider>
  );
}
