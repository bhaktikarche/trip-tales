import { Route, Routes } from "react-router-dom";
import CreatePost from "./components/CreatePost";
import PostDashboard from "./components/PostDashboard";
import SummaryPage from "./components/SummaryPage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MyAccount from "./components/MyAccount";
import LandingPage from "./components/LandingPage";
import Auth from "./components/Auth";
import AdminDashboard from "./components/AdminDashboard";
import AdminAnnouncements from "./components/AdminAnnouncements";
import ViewFeedbacks from "./components/ViewFeedbacks";
import ChatPage from "./components/ChatPage";
import AdminChatManagement from "./components/AdminChatManagement";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/postdashboard" element={<PostDashboard />} />
        <Route path="/create-trip" element={<CreatePost />} />
        <Route path="/summary/:id" element={<SummaryPage />} />
        <Route path="/myaccount" element={<MyAccount />} />
        <Route path="/edit-post/:id" element={<CreatePost />} />
        <Route path="/admindashboard" element={<AdminDashboard />} />
        <Route path="/admin/announcements" element={<AdminAnnouncements />} />
        <Route path="/admin/view-feedbacks" element={<ViewFeedbacks />} />
        <Route path="/chat/:postId" element={<ChatPage />} />
        <Route
          path="/admin/chat-management"
          element={<AdminChatManagement />}
        />
      </Routes>
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

export default App;
