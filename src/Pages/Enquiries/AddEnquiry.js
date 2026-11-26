import React, { useRef, useState } from "react";
import { Modal, Button, Form, Spinner, Row, Col } from "react-bootstrap";
import axiosInstance from "../../axios";
import Swal from "sweetalert2";
// import Select from "react-select";

const AddEnquiries = ({
  showEnquiries,
  handleCloseEnquiries,
  setUpdatedEnquiriesTable,
}) => {
  const fileInputRef = useRef(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [number, setNumber] = useState("");
  const [description, setDescription] = useState("");
  // const [status, setStatus] = useState("");
  const [image, setImage] = useState(null)

  const [loading, setLoading] = useState(false);

  const handleAddEnquiries = async (e) => {
    e.preventDefault();

    if (
      !name ||
      !email ||
      !number ||
      !description
      // !status
    ) return;

    const enquiryBody = {
      name: name,
      email: email,
      number: number,
      description: description,
      // status: status,
    }
    console.log("enquiry body =>", enquiryBody);

    try {
      setLoading(true);

      const res = await axiosInstance.post("addEnquiries", enquiryBody);
      console.log(res);

      if (res.data.status === 1) {
        handleCloseEnquiries();


        Swal.fire({
          title: res.data.message,
          icon: "success",
          timer: 1200,
          showConfirmButton: false
        });

        setUpdatedEnquiriesTable(res.data.data);

        // reset
        setName("");
        setEmail("");
        setNumber("");
        setDescription("");
        // setStatus("");
      } else {
        Swal.fire({
          title: "An error occurred",
          icon: "error",
        });
      }
    } catch (error) {
      console.log("Add Enquiries Error:", error);
      // Swal.fire({
      //   title: error?.message || "An error occurred",
      //   icon: "error",
      //   text: error?.response?.data?.message || "",
      // });
    } finally {
      setLoading(false);
    }
  };

  // Handle image delete
  const handleRemoveImage = async () => {
    const result = await Swal.fire({
      title: "Remove image?",
      text: "This image will be removed.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, remove",
    });

    if (result.isConfirmed) {
      setImage(null);
    }
  };

  // Click to open file input
  const handleClickUpload = () => {
    fileInputRef.current.click();
  };

  // Handle uploaded image
  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (file.size > 120 * 1024) {
      Swal.fire("Error", "Image must be less than 120KB", "error");
      return;
    }

    setImage(file);
  };

  // Option For Status
  // const statusOptions = [
  //   { value: "RESOLVED", label: "Resolved" },
  //   { value: "PENDING", label: "Pending" },
  // ];

  return (
    <Modal
      show={showEnquiries}
      onHide={handleCloseEnquiries}
      centered
      size="lg"
      backdrop="static"
      dialogClassName="modal-container"
    >
      <Modal.Header className="modal-header-custom" closeButton>
        <div>
          <h5 className="modal-title-custom">Add Enquriy</h5>
          {/* <p className="modal-subtitle">Dashboard • Enquiry • Create</p> */}
        </div>
      </Modal.Header>

      <Form onSubmit={handleAddEnquiries}>
        <Modal.Body className="modal-body-custom">
          {/* ===== DETAILS ===== */}
          <div className="form-card">

            <div className="card-header">
              {/* <h6>Details</h6> */}
              {/* <p>Title, description...</p> */}
            </div>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    className="input-field"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    className="input-field"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Number</Form.Label>
                  <Form.Control
                    className="input-field"
                    type="text"
                    value={number}
                    onChange={(e) =>
                      setNumber(e.target.value.replace(/[^0-9]/g, ""))
                    }
                    required
                  />
                </Form.Group>
              </Col>

              {/* <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Status</Form.Label>
                  <Select
                    options={statusOptions}
                    value={statusOptions.find(opt => opt.value === status)}
                    onChange={(selected) => setStatus(selected?.value)}
                    className="react-select-container"
                    classNamePrefix="react-select"
                    required
                  />
                </Form.Group>
              </Col> */}

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
          </div>

          {/* ===== IMAGE SECTION ===== */}
          <div className="form-card">

            <div className="card-header">
              <h6>Images</h6>
            </div>

            {/* Hidden Input */}
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: "none" }}
              accept="image/*"
              onChange={handleFileChange}
            />

            {/* Upload UI */}
            <div className="upload-box" onClick={handleClickUpload}>

              {image ? (
                <div className="preview-container">

                  {/* ❌ Remove Button */}
                  <div className="remove-btn" onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveImage();
                  }}>
                    ✕
                  </div>

                  <img
                    src={URL.createObjectURL(image)}
                    alt="preview"
                    className="preview-img"
                  />

                  <p className="file-name">{image.name}</p>
                </div>
              ) : (
                <div className="upload-content">
                  <span className="upload-icon">📦</span>
                  <p>Drop or select files</p>
                  <small>Max size: 120KB</small>
                </div>
              )}

            </div>
          </div>
        </Modal.Body>

        <Modal.Footer className="modal-footer-custom">
          <Button className="btn-outline" onClick={handleAddEnquiries}>
            Cancel
          </Button>

          <Button className="primary-btn" type="submit" disabled={loading}>
            {loading ? (
              <>
                <Spinner size="sm" /> Saving...
              </>
            ) : (
              "Save"
            )
            }
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default AddEnquiries;
