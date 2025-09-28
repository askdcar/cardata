// "use client"
// import { useEffect, useState } from "react";
// import { Table, Button, Modal, Form } from "react-bootstrap";

// export default function BrandsPage() {
//   const [brands, setBrands] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // Modals state
//   const [showAddModal, setShowAddModal] = useState(false);
//   const [showEditModal, setShowEditModal] = useState(false);

//   // Form state
//   const [newBrand, setNewBrand] = useState({ name: "", description: "" });
//   const [editBrand, setEditBrand] = useState(null);

//   // Fetch brands
//   const fetchBrands = async () => {
//     setLoading(true);
//     try {
//       const res = await fetch("http://localhost:5000/api/brands");
//       const data = await res.json();
//       console.log("Fetched brands:", data); 
//       setBrands(data.brands || []);
//     } catch (err) {
//       console.error("Error fetching brands:", err);
//     }
//     setLoading(false);
//   };

//   useEffect(() => {
//     fetchBrands();
//   }, []);

//   // Add brand
//   const handleAddBrand = async () => {
//     try {
//       const formData = new FormData();
//       formData.append("name", newBrand.name);
//       formData.append("description", newBrand.description);
//       if (newBrand.image) {
//         formData.append("image", newBrand.image);
//       }

//       await fetch("http://localhost:5000/api/brands", {
//         method: "POST",
//         body: formData,
//       });

//       setShowAddModal(false);
//       setNewBrand({ name: "", description: "" });
//       fetchBrands();
//     } catch (err) {
//       console.error("Error adding brand:", err);
//     }
//   };

//   // Edit brand
//   const handleEditBrand = async () => {
//     try {
//       const formData = new FormData();
//       formData.append("name", editBrand.name);
//       formData.append("description", editBrand.description);
//       if (editBrand.image instanceof File) {
//         formData.append("image", editBrand.image);
//       }

//       await fetch(`http://localhost:5000/api/brands/${editBrand._id}`, {
//         method: "PUT",
//         body: formData,
//       });

//       setShowEditModal(false);
//       setEditBrand(null);
//       fetchBrands();
//     } catch (err) {
//       console.error("Error editing brand:", err);
//     }
//   };

//   // Delete brand
//   const handleDeleteBrand = async (id) => {
//     if (!confirm("Are you sure you want to delete this brand?")) return;
//     try {
//       await fetch(`http://localhost:5000/api/brands/${id}`, {
//         method: "DELETE",
//       });
//       fetchBrands();
//     } catch (err) {
//       console.error("Error deleting brand:", err);
//     }
//   };

//   return (
//     <div className="container mt-4">
//       <h2>Brands</h2>
//       <Button className="mb-3" onClick={() => setShowAddModal(true)}>
//         + Add New Brand
//       </Button>

//       {loading ? (
//         <p>Loading...</p>
//       ) : (
//         <Table bordered hover responsive>
//           <thead>
//             <tr>
//               <th>#</th>
//               <th>Brand Name</th>
//               <th>Description</th>
//               <th>Image</th>
//               <th>Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {brands.length > 0 ? (
//               brands.map((brand, idx) => (
//                 <tr key={brand._id}>
//                   <td>{idx + 1}</td>
//                   <td>{brand.name}</td>
//                   <td>{brand.description}</td>
//                   <td>
//                     {brand.image && (
//                       <img
//                         src={`http://localhost:5000${brand.image}`}
//                         alt={brand.name}
//                         width="60"
//                         height="40"
//                       />
//                     )}
//                   </td>
//                   <td>
//                     <Button
//                       variant="warning"
//                       size="sm"
//                       className="me-2"
//                       onClick={() => {
//                         setEditBrand(brand);
//                         setShowEditModal(true);
//                       }}
//                     >
//                       Edit
//                     </Button>
//                     <Button
//                       variant="danger"
//                       size="sm"
//                       onClick={() => handleDeleteBrand(brand._id)}
//                     >
//                       Delete
//                     </Button>
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan="5" className="text-center">
//                   No brands found
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </Table>
//       )}

//       {/* Add Modal */}
//       <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
//         <Modal.Header closeButton>
//           <Modal.Title>Add New Brand</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <Form>
//             <Form.Group className="mb-3">
//               <Form.Label>Brand Name</Form.Label>
//               <Form.Control
//                 type="text"
//                 value={newBrand.name}
//                 onChange={(e) =>
//                   setNewBrand({ ...newBrand, name: e.target.value })
//                 }
//               />
//             </Form.Group>
//             <Form.Group className="mb-3">
//               <Form.Label>Description</Form.Label>
//               <Form.Control
//                 as="textarea"
//                 rows={2}
//                 value={newBrand.description}
//                 onChange={(e) =>
//                   setNewBrand({ ...newBrand, description: e.target.value })
//                 }
//               />
//             </Form.Group>
//             <Form.Group>
//               <Form.Label>Image</Form.Label>
//               <Form.Control
//                 type="file"
//                 onChange={(e) =>
//                   setNewBrand({ ...newBrand, image: e.target.files[0] })
//                 }
//               />
//             </Form.Group>
//           </Form>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={() => setShowAddModal(false)}>
//             Cancel
//           </Button>
//           <Button variant="primary" onClick={handleAddBrand}>
//             Save
//           </Button>
//         </Modal.Footer>
//       </Modal>

//       {/* Edit Modal */}
//       <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
//         <Modal.Header closeButton>
//           <Modal.Title>Edit Brand</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           {editBrand && (
//             <Form>
//               <Form.Group className="mb-3">
//                 <Form.Label>Brand Name</Form.Label>
//                 <Form.Control
//                   type="text"
//                   value={editBrand.name}
//                   onChange={(e) =>
//                     setEditBrand({ ...editBrand, name: e.target.value })
//                   }
//                 />
//               </Form.Group>
//               <Form.Group className="mb-3">
//                 <Form.Label>Description</Form.Label>
//                 <Form.Control
//                   as="textarea"
//                   rows={2}
//                   value={editBrand.description}
//                   onChange={(e) =>
//                     setEditBrand({ ...editBrand, description: e.target.value })
//                   }
//                 />
//               </Form.Group>
//               <Form.Group>
//                 <Form.Label>Image</Form.Label>
//                 <Form.Control
//                   type="file"
//                   onChange={(e) =>
//                     setEditBrand({ ...editBrand, image: e.target.files[0] })
//                   }
//                 />
//                 {editBrand.image && !(editBrand.image instanceof File) && (
//                   <img
//                     src={`http://localhost:5000${editBrand.image}`}
//                     alt={editBrand.name}
//                     width="60"
//                     height="40"
//                     className="mt-2"
//                   />
//                 )}
//               </Form.Group>
//             </Form>
//           )}
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={() => setShowEditModal(false)}>
//             Cancel
//           </Button>
//           <Button variant="primary" onClick={handleEditBrand}>
//             Update
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </div>
//   );
// }


"use client"
import { useEffect, useState } from "react";
import { Table, Button, Modal, Form } from "react-bootstrap";

export default function BrandsPage() {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  // Form state
  const [newBrand, setNewBrand] = useState({ name: "", description: "" });
  const [editBrand, setEditBrand] = useState(null);

  // Search state
  const [search, setSearch] = useState("");

  // Fetch brands
  // const fetchBrands = async () => {
  //   setLoading(true);
  //   try {
  //     const res = await fetch("http://localhost:5000/api/brands");
  //     const data = await res.json();
  //     setBrands(data || []);
  //   } catch (err) {
  //     console.error("Error fetching brands:", err);
  //   }
  //   setLoading(false);
  // };


  const fetchBrands = async () => {
  setLoading(true);
  try {
    const res = await fetch("http://localhost:5000/api/brands");
    const data = await res.json();

    // handle both possible shapes
    if (Array.isArray(data)) {
      setBrands(data);
    } else if (Array.isArray(data.brands)) {
      setBrands(data.brands);
    } else {
      setBrands([]);
    }
  } catch (err) {
    console.error("Error fetching brands:", err);
    setBrands([]);
  }
  setLoading(false);
};


  useEffect(() => {
    fetchBrands();
  }, []);

  // Add brand
  const handleAddBrand = async () => {
    try {
      const formData = new FormData();
      formData.append("name", newBrand.name);
      formData.append("description", newBrand.description);
      if (newBrand.image) {
        formData.append("image", newBrand.image);
      }

      await fetch("http://localhost:5000/api/brands", {
        method: "POST",
        body: formData,
      });

      setShowAddModal(false);
      setNewBrand({ name: "", description: "" });
      fetchBrands();
    } catch (err) {
      console.error("Error adding brand:", err);
    }
  };

  // Edit brand
  const handleEditBrand = async () => {
    try {
      const formData = new FormData();
      formData.append("name", editBrand.name);
      formData.append("description", editBrand.description);
      if (editBrand.image instanceof File) {
        formData.append("image", editBrand.image);
      }

      await fetch(`http://localhost:5000/api/brands/${editBrand._id}`, {
        method: "PUT",
        body: formData,
      });

      setShowEditModal(false);
      setEditBrand(null);
      fetchBrands();
    } catch (err) {
      console.error("Error editing brand:", err);
    }
  };

  // Delete brand
  const handleDeleteBrand = async (id) => {
    if (!confirm("Are you sure you want to delete this brand?")) return;
    try {
      await fetch(`http://localhost:5000/api/brands/${id}`, {
        method: "DELETE",
      });
      fetchBrands();
    } catch (err) {
      console.error("Error deleting brand:", err);
    }
  };

  // Filter brands based on search
  const filteredBrands = brands.filter(
    (b) =>
      b.name.toLowerCase().includes(search.toLowerCase()) ||
      b.description?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Brands</h2>
        <Button onClick={() => setShowAddModal(true)}>+ Add New Brand</Button>
      </div>

      {/* Search box */}
      <Form.Control
        type="text"
        placeholder="Search by name or description..."
        className="mb-3"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {loading ? (
        <p>Loading...</p>
      ) : (
        <Table bordered hover responsive>
          <thead>
            <tr>
              <th>#</th>
              <th>Brand Name</th>
              <th>Description</th>
              <th>Image</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBrands.length > 0 ? (
              filteredBrands.map((brand, idx) => (
                <tr key={brand._id}>
                  <td>{idx + 1}</td>
                  <td>{brand.name}</td>
                  <td>{brand.description}</td>
                  <td>
                    {brand.image && (
                      <img
                        src={`http://localhost:5000${brand.image}`}
                        alt={brand.name}
                        width="60"
                        height="40"
                      />
                    )}
                  </td>
                  <td>
                    <Button
                      variant="warning"
                      size="sm"
                      className="me-2"
                      onClick={() => {
                        setEditBrand(brand);
                        setShowEditModal(true);
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDeleteBrand(brand._id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center">
                  No brands found
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      )}

      {/* Add Modal */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Brand</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Brand Name</Form.Label>
              <Form.Control
                type="text"
                value={newBrand.name}
                onChange={(e) =>
                  setNewBrand({ ...newBrand, name: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                value={newBrand.description}
                onChange={(e) =>
                  setNewBrand({ ...newBrand, description: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Image</Form.Label>
              <Form.Control
                type="file"
                onChange={(e) =>
                  setNewBrand({ ...newBrand, image: e.target.files[0] })
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleAddBrand}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Edit Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Brand</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {editBrand && (
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Brand Name</Form.Label>
                <Form.Control
                  type="text"
                  value={editBrand.name}
                  onChange={(e) =>
                    setEditBrand({ ...editBrand, name: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  value={editBrand.description}
                  onChange={(e) =>
                    setEditBrand({ ...editBrand, description: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Image</Form.Label>
                <Form.Control
                  type="file"
                  onChange={(e) =>
                    setEditBrand({ ...editBrand, image: e.target.files[0] })
                  }
                />
                {editBrand.image && !(editBrand.image instanceof File) && (
                  <img
                    src={`http://localhost:5000${editBrand.image}`}
                    alt={editBrand.name}
                    width="60"
                    height="40"
                    className="mt-2"
                  />
                )}
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleEditBrand}>
            Update
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
