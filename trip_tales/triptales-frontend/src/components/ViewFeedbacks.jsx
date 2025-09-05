// ViewFeedbacks.jsx - Updated version
import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { Button, Badge } from "react-bootstrap";
import { toast } from "react-toastify";
import "./ViewFeedbacks.css";
import { Link } from "react-router-dom";

function ViewFeedbacks() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [aboutFeedbacks, setAboutFeedbacks] = useState([]);

  // Load about feedbacks from localStorage on component mount
  useEffect(() => {
    const savedFeedbacks =
      JSON.parse(localStorage.getItem("aboutFeedbacks")) || [];
    setAboutFeedbacks(savedFeedbacks);
  }, []);

  const fetchFeedbacks = useCallback(async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/feedback/all");
      // Map the response to ensure we have username property
      const formattedFeedbacks = res.data.map((fb) => ({
        ...fb,
        username: fb.username || fb.name, // Use name if username doesn't exist
      }));
      setFeedbacks(formattedFeedbacks);
    } catch (err) {
      console.error("Error fetching feedbacks:", err);
      toast.error("Failed to fetch feedbacks");
    }
  }, []);

  useEffect(() => {
    fetchFeedbacks();
  }, [fetchFeedbacks]);

  const handleAddToAbout = (feedback) => {
    const savedFeedbacks =
      JSON.parse(localStorage.getItem("aboutFeedbacks")) || [];

    // Check if feedback already exists in about section
    if (savedFeedbacks.some((fb) => fb.id === feedback.id)) {
      toast.warning("This feedback is already in the About Section!");
      return;
    }

    const updatedFeedbacks = [...savedFeedbacks, feedback];
    localStorage.setItem("aboutFeedbacks", JSON.stringify(updatedFeedbacks));
    setAboutFeedbacks(updatedFeedbacks);
    toast.success("Feedback added to About Section!");
    setSelectedFeedback(null);
  };

  const handleRemoveFromAbout = (feedbackId) => {
    const updatedFeedbacks = aboutFeedbacks.filter(
      (fb) => fb.id !== feedbackId
    );
    localStorage.setItem("aboutFeedbacks", JSON.stringify(updatedFeedbacks));
    setAboutFeedbacks(updatedFeedbacks);
    toast.success("Feedback removed from About Section!");
  };

  const isInAboutSection = (feedbackId) => {
    return aboutFeedbacks.some((fb) => fb.id === feedbackId);
  };

  return (
    <div className="container py-4">
      <div className="head">
        <h2 className="mb-4">👁 User Feedbacks</h2>

        <Link to="/admindashboard" className="tt-create-trip-btn">
          ⬅ Back to Dashboard
        </Link>
      </div>
      <div className="alert alert-info">
        <strong>About Section Status:</strong> {aboutFeedbacks.length}{" "}
        feedback(s) currently displayed on landing page
      </div>

      <table className="table table-bordered table-hover">
        <thead className="table-secondary">
          <tr>
            <th>User</th>
            <th>Email</th>
            <th>Date</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {feedbacks.map((fb) => (
            <tr key={fb.id}>
              <td>{fb.username}</td>
              <td>{fb.email}</td>
              <td>{new Date(fb.created_at).toLocaleDateString()}</td>
              <td>
                {isInAboutSection(fb.id) ? (
                  <Badge bg="success">On Landing Page</Badge>
                ) : (
                  <Badge bg="secondary">Not Displayed</Badge>
                )}
              </td>
              <td>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setSelectedFeedback(fb)}
                  className="me-2"
                >
                  View
                </Button>
                {isInAboutSection(fb.id) ? (
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleRemoveFromAbout(fb.id)}
                  >
                    Remove
                  </Button>
                ) : (
                  <Button
                    variant="success"
                    size="sm"
                    onClick={() => handleAddToAbout(fb)}
                  >
                    Add to About
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {feedbacks.length === 0 && (
        <div className="text-center py-5">
          <h4 className="text-muted">No feedbacks yet</h4>
          <p>User feedbacks will appear here once submitted.</p>
        </div>
      )}

      {/* Feedback Popup */}
      {selectedFeedback && (
        <div
          className="popup-overlay"
          onClick={() => setSelectedFeedback(null)}
        >
          <div className="popup-card" onClick={(e) => e.stopPropagation()}>
            <button
              className="popup-close"
              onClick={() => setSelectedFeedback(null)}
              aria-label="Close"
              title="Close"
            >
              ×
            </button>
            <h3 className="popup-title">
              Feedback from {selectedFeedback.username}
            </h3>
            <div className="popup-meta">
              <span className="text-muted">{selectedFeedback.email}</span>
              <span className="text-muted">
                {new Date(selectedFeedback.created_at).toLocaleString()}
              </span>
            </div>
            <div className="popup-body">
              <p>"{selectedFeedback.experience}"</p>
            </div>
            <div className="d-flex justify-content-end gap-2">
              {isInAboutSection(selectedFeedback.id) ? (
                <Button
                  variant="danger"
                  onClick={() => handleRemoveFromAbout(selectedFeedback.id)}
                >
                  Remove from About
                </Button>
              ) : (
                <Button
                  variant="success"
                  onClick={() => handleAddToAbout(selectedFeedback)}
                >
                  Add to About Section
                </Button>
              )}
              <Button
                variant="secondary"
                onClick={() => setSelectedFeedback(null)}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ViewFeedbacks;
