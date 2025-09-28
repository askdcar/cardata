"use client";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Table, Button, Modal, Form } from "react-bootstrap";
import axios from "axios";

// Dynamically load ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
// import "react-quill/dist/quill.snow.css";

import 'react-quill/dist/quill.snow.css';
import 'react-quill/dist/quill.bubble.css';

// SnowEditor component with safe image handling
const SnowEditor = ({ value, onChange }) => {
  const [editorReady, setEditorReady] = useState(false);

  useEffect(() => {
    setEditorReady(true);
  }, []);

  if (!editorReady) return null;

  const handleImageUpload = function () {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      if (file) {
        const fd = new FormData();
        fd.append("image", file);

        try {
          const res = await axios.post("http://localhost:5000/api/upload", fd, {
            headers: { "Content-Type": "multipart/form-data" },
          });
          const url = res.data.url;

          let range = this.quill.getSelection();
          if (!range) range = { index: this.quill.getLength(), length: 0 };

          this.quill.insertEmbed(range.index, "image", url);
          this.quill.setSelection(range.index + 1);
        } catch (err) {
          console.error("Image upload failed", err);
        }
      }
    };
  };

  // const modules = {
  //   toolbar: {
  //     container: [
  //       [{ font: [] }, { size: [] }],
  //       ["bold", "italic", "underline", "strike"],
  //       [{ color: [] }, { background: [] }],
  //       [{ script: "super" }, { script: "sub" }],
  //       [{ header: [false, 1, 2, 3, 4, 5, 6] }, "blockquote", "code-block"],
  //       [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
  //       ["direction", { align: [] }],
  //       ["link", "image", "video"],
  //       ["clean"],
  //     ],
  //     handlers: {
  //       image: handleImageUpload,
  //     },
  //   },
  // };

    const modules = {
    toolbar: [[{
      font: []
    }, {
      size: []
    }], ['bold', 'italic', 'underline', 'strike'], [{
      color: []
    }, {
      background: []
    }], [{
      script: 'super'
    }, {
      script: 'sub'
    }], [{
      header: [false, 1, 2, 3, 4, 5, 6]
    }, 'blockquote', 'code-block'], [{
      list: 'ordered'
    }, {
      list: 'bullet'
    }, {
      indent: '-1'
    }, {
      indent: '+1'
    }], ['direction', {
      align: []
    }], ['link', 'image', 'video'], ['clean']]
  };


  const formats = [
    "font",
    "size",
    "bold", "italic", "underline", "strike",
    "color", "background",
    "script",
    "header", "blockquote", "code-block",
    "list", "bullet", "indent",
    "direction", "align",
    "link", "image", "video",
  ];

  return (
    <ReactQuill
      theme="snow"
      value={value}
      onChange={onChange}
      modules={modules}
      formats={formats}
      style={{ height: "300px", marginBottom: "50px" }}
    />
  );
};

export default function BlogManagement() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("view"); // add, edit, view
  const [selectedBlog, setSelectedBlog] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    author: "",
    category: "",
    tags: "",
    isPublished: false,
    image: null,
  });

  // Fetch blogs
  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/blogs");
      setBlogs(Array.isArray(res.data) ? res.data : res.data.blogs || []);
    } catch (err) {
      console.error(err);
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "checkbox") setFormData((p) => ({ ...p, [name]: checked }));
    else if (type === "file") setFormData((p) => ({ ...p, [name]: files[0] }));
    else setFormData((p) => ({ ...p, [name]: value }));
  };

  const openModal = (type, blog = null) => {
    setModalType(type);
    setSelectedBlog(blog);

    if (type === "edit" && blog) {
      setFormData({
        title: blog.title || "",
        content: blog.content || "",
        author: blog.author || "",
        category: blog.category || "",
        tags: blog.tags?.join ? blog.tags.join(", ") : blog.tags || "",
        isPublished: !!blog.isPublished,
        image: null,
      });
    } else if (type === "add") {
      setFormData({
        title: "",
        content: "",
        author: "",
        category: "",
        tags: "",
        isPublished: false,
        image: null,
      });
    }

    setShowModal(true);
  };

  const handleSubmit = async () => {
    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("content", formData.content);
      data.append("author", formData.author);
      data.append("category", formData.category);
      data.append("tags", JSON.stringify(formData.tags ? formData.tags.split(",").map(t => t.trim()) : []));
      data.append("isPublished", formData.isPublished);
      if (formData.image) data.append("image", formData.image);

      if (modalType === "add") {
        await axios.post("http://localhost:5000/api/blogs", data, { headers: { "Content-Type": "multipart/form-data" } });
      } else if (modalType === "edit" && selectedBlog) {
        await axios.put(`http://localhost:5000/api/blogs/${selectedBlog._id}`, data, { headers: { "Content-Type": "multipart/form-data" } });
      }

      setShowModal(false);
      fetchBlogs();
    } catch (err) {
      console.error("Failed to save blog:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/blogs/${id}`);
      fetchBlogs();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Blog Management</h2>
      <Button className="mb-3" onClick={() => openModal("add")}>+ Add Blog</Button>

      {loading ? <p>Loading blogs...</p> : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>Category</th>
              <th>Published</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {blogs.length > 0 ? blogs.map(blog => (
              <tr key={blog._id}>
                <td>{blog.title}</td>
                <td>{blog.author}</td>
                <td>{blog.category}</td>
                <td>{blog.isPublished ? "Yes" : "No"}</td>
                <td>
                  <Button size="sm" variant="info" onClick={() => openModal("view", blog)}>View</Button>{" "}
                  <Button size="sm" variant="warning" onClick={() => openModal("edit", blog)}>Edit</Button>{" "}
                  <Button size="sm" variant="danger" onClick={() => handleDelete(blog._id)}>Delete</Button>
                </td>
              </tr>
            )) : <tr><td colSpan="5" className="text-center">No blogs found</td></tr>}
          </tbody>
        </Table>
      )}

      {/* Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{modalType === "add" ? "Add Blog" : modalType === "edit" ? "Edit Blog" : "View Blog"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {modalType === "view" && selectedBlog ? (
            <div>
              <h4>{selectedBlog.title}</h4>
              <p><b>Author:</b> {selectedBlog.author}</p>
              <p><b>Category:</b> {selectedBlog.category}</p>
              <p><b>Tags:</b> {selectedBlog.tags?.join(", ")}</p>
              <p><b>Published:</b> {selectedBlog.isPublished ? new Date(selectedBlog.publishedAt).toLocaleString() : "No"}</p>
              {selectedBlog.image && <img src={`http://localhost:5000${selectedBlog.image}`} alt="blog" className="img-fluid mb-3" />}
              <div dangerouslySetInnerHTML={{ __html: selectedBlog.content }} />
            </div>
          ) : (
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Title</Form.Label>
                <Form.Control type="text" name="title" value={formData.title} onChange={handleChange} />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Author</Form.Label>
                <Form.Control type="text" name="author" value={formData.author} onChange={handleChange} />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Category</Form.Label>
                <Form.Control type="text" name="category" value={formData.category} onChange={handleChange} />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Tags (comma separated)</Form.Label>
                <Form.Control type="text" name="tags" value={formData.tags} onChange={handleChange} />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Content</Form.Label>
                <SnowEditor
                  value={formData.content}
                  onChange={(value) => setFormData(prev => ({ ...prev, content: value }))}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Check type="checkbox" label="Published" name="isPublished" checked={formData.isPublished} onChange={handleChange} />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Cover Image</Form.Label>
                <Form.Control type="file" name="image" onChange={handleChange} />
              </Form.Group>
            </Form>
          )}
        </Modal.Body>

        {modalType !== "view" && (
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleSubmit}>Save</Button>
          </Modal.Footer>
        )}
      </Modal>
    </div>
  );
}


// 'use client';
// import ComponentContainerCard from '@/components/ComponentContainerCard';
// import ReactQuill from 'react-quill';

// // styles
// import 'react-quill/dist/quill.snow.css';
// import 'react-quill/dist/quill.bubble.css';
// let valueSnow = '';

// const SnowEditor = () => {
//   const modules = {
//     toolbar: [[{
//       font: []
//     }, {
//       size: []
//     }], ['bold', 'italic', 'underline', 'strike'], [{
//       color: []
//     }, {
//       background: []
//     }], [{
//       script: 'super'
//     }, {
//       script: 'sub'
//     }], [{
//       header: [false, 1, 2, 3, 4, 5, 6]
//     }, 'blockquote', 'code-block'], [{
//       list: 'ordered'
//     }, {
//       list: 'bullet'
//     }, {
//       indent: '-1'
//     }, {
//       indent: '+1'
//     }], ['direction', {
//       align: []
//     }], ['link', 'image', 'video'], ['clean']]
//   };
//   return <ComponentContainerCard id="quill-snow-editor" title="Snow Editor" description={<>
//           Use <code>snow-editor</code> id to set snow editor.
//         </>}>
//       <ReactQuill id="snow-editor" modules={modules} defaultValue={valueSnow} theme="snow" />
//     </ComponentContainerCard>;
// };

// const AllEditors = () => {
//   return <>
//       <SnowEditor />

//     </>;
// };
// export default AllEditors;






