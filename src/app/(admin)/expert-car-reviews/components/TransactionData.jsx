// "use client";
// import React, { useState, useEffect } from "react";
// import { Table, Button, Modal, Form } from "react-bootstrap";
// import axios from "axios";

// export default function ExpertCarReviews() {
//   const [reviews, setReviews] = useState([]);
//   const [showModal, setShowModal] = useState(false);
//   const [isEdit, setIsEdit] = useState(false);
//   const [currentReview, setCurrentReview] = useState({
//     title: "",
//     carName: "",
//     description: "",
//     image: null,
//   });

//   // Fetch reviews
//   const fetchReviews = async () => {
//     try {
//       const res = await axios.get("http://localhost:5000/api/expert-car-reviews/");
//       setReviews(res.data);
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   useEffect(() => {
//     fetchReviews();
//   }, []);

//   // Handle form input change
//   const handleChange = (e) => {
//     const { name, value, files } = e.target;
//     if (files) {
//       setCurrentReview({ ...currentReview, [name]: files[0] });
//     } else {
//       setCurrentReview({ ...currentReview, [name]: value });
//     }
//   };

//   // Add or update review
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const formData = new FormData();
//     formData.append("title", currentReview.title);
// formData.append("content", currentReview.content);
// formData.append("reviewer", currentReview.reviewer);
// formData.append("carId", currentReview.carId);
// if (currentReview.image) formData.append("image", currentReview.image);

//     try {
//       if (isEdit) {
//         await axios.put(
//           `http://localhost:5000/api/expert-car-reviews/${currentReview._id}`,
//           formData,
//           { headers: { "Content-Type": "multipart/form-data" } }
//         );
//       } else {
//         await axios.post(
//           "http://localhost:5000/api/expert-car-reviews/",
//           formData,
//           { headers: { "Content-Type": "multipart/form-data" } }
//         );
//       }
//       fetchReviews();
//       setShowModal(false);
//       setCurrentReview({ title: "", carName: "", description: "", image: null });
//       setIsEdit(false);
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   // Edit review
//   const handleEdit = (review) => {
//     setCurrentReview(review);
//     setIsEdit(true);
//     setShowModal(true);
//   };

//   // Delete review
//   const handleDelete = async (id) => {
//     if (!confirm("Are you sure you want to delete this review?")) return;
//     try {
//       await axios.delete(`http://localhost:5000/api/expert-car-reviews/${id}`);
//       fetchReviews();
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   return (
//     <div className="container mt-4">
//       <h2>Expert Car Reviews</h2>
//       <Button className="mb-3" onClick={() => setShowModal(true)}>
//         Add Review
//       </Button>
//       <Table striped bordered hover>
//         <thead>
//           <tr>
//             <th>Title</th>
//             <th>Car Name</th>
//             <th>Description</th>
//             <th>Image</th>
//             <th>Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {reviews.map((review) => (
//             <tr key={review._id}>
//               <td>{review.title}</td>
//               <td>{review.carName}</td>
//               <td>{review.description}</td>
//               <td>
//                 {review.image && (
//                   <img
//                     src={`http://localhost:5000/${review.image}`}
//                     alt={review.title}
//                     width={100}
//                   />
//                 )}
//               </td>
//               <td>
//                 <Button variant="warning" className="me-2" onClick={() => handleEdit(review)}>
//                   Edit
//                 </Button>
//                 <Button variant="danger" onClick={() => handleDelete(review._id)}>
//                   Delete
//                 </Button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </Table>

//       <Modal show={showModal} onHide={() => setShowModal(false)}>
//         <Modal.Header closeButton>
//           <Modal.Title>{isEdit ? "Edit Review" : "Add Review"}</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <Form onSubmit={handleSubmit}>
//             <Form.Group className="mb-3">
//               <Form.Label>Title</Form.Label>
//               <Form.Control
//                 type="text"
//                 name="title"
//                 value={currentReview.title}
//                 onChange={handleChange}
//                 required
//               />
//             </Form.Group>

//             <Form.Group className="mb-3">
//               <Form.Label>Car Name</Form.Label>
//               <Form.Control
//                 type="text"
//                 name="carName"
//                 value={currentReview.carName}
//                 onChange={handleChange}
//                 required
//               />
//             </Form.Group>

//             <Form.Group className="mb-3">
//               <Form.Label>Description</Form.Label>
//               <Form.Control
//                 as="textarea"
//                 rows={3}
//                 name="description"
//                 value={currentReview.description}
//                 onChange={handleChange}
//                 required
//               />
//             </Form.Group>

            

//             <Form.Group className="mb-3">
//               <Form.Label>Image</Form.Label>
//               <Form.Control type="file" name="image" onChange={handleChange} />
//             </Form.Group>

//             <Button type="submit">{isEdit ? "Update" : "Add"}</Button>
//           </Form>
//         </Modal.Body>
//       </Modal>
//     </div>
//   );
// }



"use client";
import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form } from "react-bootstrap";
import axios from "axios";

export default function ExpertCarReviews() {
  const [reviews, setReviews] = useState([]);
  const [cars, setCars] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentReview, setCurrentReview] = useState({
    title: "",
    content: "",
    reviewer: "",
    carId: "",
    image: null,
  });

  // Fetch all reviews
  const fetchReviews = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/expert-car-reviews/");
      setReviews(Array.isArray(res.data) ? res.data : res.data.reviews || []);
    } catch (error) {
      console.error(error);
    }
  };

  // Fetch all cars for dropdown
  // const fetchCars = async () => {
  //   try {
  //     const res = await axios.get("http://localhost:5000/api/cars/");
  //     // Ensure cars is always an array
  //     setCars(Array.isArray(res.data) ? res.data : res.data.cars || []);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  const fetchCars = async () => {
  try {
    const res = await axios.get("http://localhost:5000/api/cars/");
    // Ensure array
    setCars(Array.isArray(res.data) ? res.data : res.data.cars || []);
  } catch (error) {
    console.error(error);
  }
};


  useEffect(() => {
    fetchReviews();
    fetchCars();
  }, []);

  // Handle form input
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setCurrentReview({ ...currentReview, [name]: files[0] });
    } else {
      setCurrentReview({ ...currentReview, [name]: value });
    }
  };

  // Add or update review
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const formData = new FormData();
//   formData.append("title", currentReview.title);
// formData.append("content", currentReview.content);
// formData.append("reviewer", currentReview.reviewer);
// formData.append("carId", currentReview.carId);


//     if (currentReview.image) formData.append("image", currentReview.image);

//     try {
//       if (isEdit) {
//         await axios.put(
//           `http://localhost:5000/api/expert-car-reviews/${currentReview._id}`,
//           formData,
//           { headers: { "Content-Type": "multipart/form-data" } }
//         );
//       } else {
//         await axios.post(
//           "http://localhost:5000/api/expert-car-reviews/",
//           formData,
//           { headers: { "Content-Type": "multipart/form-data" } }
//         );
//       }
//       fetchReviews();
//       setShowModal(false);
//       setCurrentReview({
//         title: "",
//         content: "",
//         reviewer: "",
//         carId: "",
//         image: null,
//       });
//       setIsEdit(false);
//     } catch (error) {
//       console.error(error);
//     }
//   };

const handleSubmit = async (e) => {
  e.preventDefault();

  // Validation before sending
  if (!currentReview.title || !currentReview.content || !currentReview.reviewer || !currentReview.carId) {
    alert("All fields are required!");
    return;
  }

  const formData = new FormData();
  formData.append("title", currentReview.title);
  formData.append("content", currentReview.content);
  formData.append("reviewer", currentReview.reviewer);
  formData.append("carId", currentReview.carId);
  if (currentReview.image) formData.append("image", currentReview.image);

  try {
    if (isEdit) {
      // PUT request
      await axios.put(
        `http://localhost:5000/api/expert-car-reviews/${currentReview._id}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
    } else {
      // POST request
      await axios.post(
        "http://localhost:5000/api/expert-car-reviews/",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
    }

    // Refresh list and reset form
    fetchReviews();
    setShowModal(false);
    setIsEdit(false);
    setCurrentReview({ title: "", content: "", reviewer: "", carId: "", image: null });
  } catch (error) {
    console.error("Error submitting review:", error.response?.data || error);
  }
};


  // Edit review
  // const handleEdit = (review) => {
  //   setCurrentReview(review);
  //   setIsEdit(true);
  //   setShowModal(true);
  // };

  const handleEdit = (review) => {
  setCurrentReview({
    title: review.title,
    content: review.content,
    reviewer: review.reviewer,
    carId: review.carId,
    image: null, // image upload can be replaced
    _id: review._id, // needed for PUT
  });
  setIsEdit(true);
  setShowModal(true);
};


  // Delete review
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this review?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/expert-car-reviews/${id}`);
      fetchReviews();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Expert Car Reviews</h2>
      <Button className="mb-3" onClick={() => setShowModal(true)}>
        Add Review
      </Button>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Title</th>
            <th>Reviewer</th>
            <th>Car</th>
            <th>Content</th>
            <th>Image</th>
            <th>Actions</th>
          </tr>
        </thead>
      <tbody>
  {reviews.map((review) => {
    const car = Array.isArray(cars) ? cars.find((c) => c._id === review.carId) : null;
    return (
      <tr key={review._id}>
        <td>{review.title}</td>
        <td>{review.reviewer}</td>
        <td>{car ? car.name : "Loading..."}</td> {/* <-- safe fallback */}
        <td>{review.content}</td>
        <td>
          {review.image && (
            <img
              src={`http://localhost:5000/${review.image}`}
              alt={review.title}
              width={100}
            />
          )}
        </td>
        <td>
          <Button variant="warning" onClick={() => handleEdit(review)}>
            Edit
          </Button>
          <Button variant="danger" onClick={() => handleDelete(review._id)}>
            Delete
          </Button>
        </td>
      </tr>
    );
  })}
</tbody>

      </Table>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{isEdit ? "Edit Review" : "Add Review"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={currentReview.title}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Reviewer</Form.Label>
              <Form.Control
                type="text"
                name="reviewer"
                value={currentReview.reviewer}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Car</Form.Label>
            <Form.Select
  name="carId"
  value={currentReview.carId || ""}
  onChange={handleChange}
  required
>
  <option value="">Select Car</option>
  {Array.isArray(cars) &&
    cars.map((car) => (
      <option key={car._id} value={car._id}>
        {car.name}
      </option>
    ))}
</Form.Select>

            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Content</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="content"
                value={currentReview.content}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Image</Form.Label>
              <Form.Control type="file" name="image" onChange={handleChange} />
            </Form.Group>

            <Button type="submit">{isEdit ? "Update" : "Add"}</Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}
