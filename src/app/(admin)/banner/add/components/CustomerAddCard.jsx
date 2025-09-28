"use client";
import { useState, useEffect } from "react";
import { Table, Button, Modal, Form } from "react-bootstrap";

export default function BannerSliderPage() {
  const [sliders, setSliders] = useState([]);
  const [loading, setLoading] = useState(false);

  // Modal state
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  // Form states
  const [newSlider, setNewSlider] = useState({ title: "", country: "", description: "", image: null });
  const [editSlider, setEditSlider] = useState({ _id: "", title: "", country: "", description: "", image: null });

  // Fetch all sliders
  const fetchSliders = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/slider");
      const data = await res.json();
      console.log("Fetched sliders:", data);
      setSliders(data);
    } catch (err) {
      console.error("Error fetching sliders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSliders();
  }, []);

  // Add Slider
  const handleAddSlider = async () => {
    try {
      const formData = new FormData();
      formData.append("title", newSlider.title);
      formData.append("country", newSlider.country);
      formData.append("description", newSlider.description);
      if (newSlider.image) formData.append("image", newSlider.image);

      await fetch("http://localhost:5000/api/slider", {
        method: "POST",
        body: formData,
      });

      setShowAdd(false);
      setNewSlider({ title: "", country: "", description: "", image: null });
      fetchSliders();
    } catch (err) {
      console.error("Error adding slider:", err);
    }
  };

  // Edit Slider
  const handleEditSlider = async () => {
    try {
      const formData = new FormData();
      formData.append("title", editSlider.title);
      formData.append("country", editSlider.country);
      formData.append("description", editSlider.description);
      if (editSlider.image instanceof File) {
        formData.append("image", editSlider.image);
      }

      await fetch(`http://localhost:5000/api/slider/${editSlider._id}`, {
        method: "PUT",
        body: formData,
      });

      setShowEdit(false);
      setEditSlider({ _id: "", title: "", country: "", description: "", image: null });
      fetchSliders();
    } catch (err) {
      console.error("Error updating slider:", err);
    }
  };

  // Delete Slider
  const handleDeleteSlider = async (id) => {
    if (!confirm("Are you sure you want to delete this banner?")) return;
    try {
      await fetch(`http://localhost:5000/api/slider/${id}`, {
        method: "DELETE",
      });
      fetchSliders();
    } catch (err) {
      console.error("Error deleting slider:", err);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Banner Slider Management</h2>
      <Button variant="primary" className="mb-3" onClick={() => setShowAdd(true)}>
        + Add New BannerSlider
      </Button>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <Table bordered hover>
          <thead>
            <tr>
              <th>Title</th>
              <th>Country</th>
              <th>Description</th>
              <th>Image</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sliders.map((s) => (
              <tr key={s._id}>
                <td>{s.title}</td>
                <td>{s.country}</td>
                <td>{s.description} {s.image}</td>
                <td>
                  {s.image ? (
                    <img src={`${s.image}`} alt="slider" width="100" />
                  ) : (
                    "No Image"
                  )}
                </td>
                <td>
                  <Button
                    variant="warning"
                    size="sm"
                    className="me-2"
                    onClick={() => {
                      setEditSlider(s);
                      setShowEdit(true);
                    }}
                  >
                    Edit
                  </Button>
                  <Button variant="danger" size="sm" onClick={() => handleDeleteSlider(s._id)}>
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {/* Add Modal */}
      <Modal show={showAdd} onHide={() => setShowAdd(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add New BannerSlider</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-2">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                value={newSlider.title}
                onChange={(e) => setNewSlider({ ...newSlider, title: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Country</Form.Label>
              <Form.Control
                type="text"
                value={newSlider.country}
                onChange={(e) => setNewSlider({ ...newSlider, country: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={newSlider.description}
                onChange={(e) => setNewSlider({ ...newSlider, description: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Image</Form.Label>
              <Form.Control type="file" onChange={(e) => setNewSlider({ ...newSlider, image: e.target.files[0] })} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAdd(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleAddSlider}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Edit Modal */}
      <Modal show={showEdit} onHide={() => setShowEdit(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit BannerSlider</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-2">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                value={editSlider.title}
                onChange={(e) => setEditSlider({ ...editSlider, title: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Country</Form.Label>
              <Form.Control
                type="text"
                value={editSlider.country}
                onChange={(e) => setEditSlider({ ...editSlider, country: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={editSlider.description}
                onChange={(e) => setEditSlider({ ...editSlider, description: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Image</Form.Label>
              <Form.Control type="file" onChange={(e) => setEditSlider({ ...editSlider, image: e.target.files[0] })} />
              {editSlider.image && !(editSlider.image instanceof File) && (
                <div className="mt-2">
                  <img src={`${editSlider.image}`} alt="preview" width="100" />
                </div>
              )}
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEdit(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleEditSlider}>
            Update
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
