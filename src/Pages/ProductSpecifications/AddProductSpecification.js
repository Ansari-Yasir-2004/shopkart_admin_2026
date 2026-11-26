import React, { useEffect, useState } from "react";
import { Modal, Button, Form, Spinner, Row, Col } from "react-bootstrap";
import axiosInstance from "../../axios";
import Swal from "sweetalert2";
import Select from "react-select";

const AddProductSpecification = ({
  showProductSpecification,
  handleCloseProductSpecification,
  setUpdatedProductSpecificationTable,
}) => {
  const [productId, setProductId] = useState("");
  const [name, setName] = useState("");
  const [value, setValue] = useState("");
  const [position, setPosition] = useState("");
  const [status, setStatus] = useState(1);

  const [loading, setLoading] = useState(false);
  const [productList, setProductList] = useState([]);

  // Add Product Specification
  const handleAddSpecification = async (e) => {
    e.preventDefault();

    if (
      !productId ||
      !name ||
      !value ||
      !position ||
      !status
    ) return;

    const productSpecificationBody = {
      product_id: productId,
      name: name,
      value: value,
      position: parseInt(position),
      status: parseInt(status),
    }
    // console.log("product specification body =>", productSpecificationBody);

    try {
      setLoading(true);

      const res = await axiosInstance.post("addProductSpecifications", productSpecificationBody);

      if (res.data.status === 1) {
        handleCloseProductSpecification();

        Swal.fire({
          title: res.data.message,
          icon: "success",
          timer: 1200,
          showConfirmButton: false
        });

        setUpdatedProductSpecificationTable(res.data.data);

        // reset
        setProductId("");
        setName("");
        setValue("");
        setPosition("");
        setStatus("");
      } else {
        Swal.fire({
          title: "An error occurred",
          icon: "error",
        });
      }
    } catch (error) {
      console.log("Add Product Specification Error:", error);
      // Swal.fire({
      //   title: error?.message || "An error occurred",
      //   icon: "error",
      //   text: error?.response?.data?.message || "",
      // });
    } finally {
      setLoading(false);
    }
  };

  // Get Active Products
  const getProducts = async () => {
    try {
      const res = await axiosInstance.get("getActiveProducts");
      setProductList(res.data.data);
    } catch (e) {
      console.log("e =>", e)
    }
  };
  // Options for Products
  const productOptions = productList ? productList.map(b => ({
    value: b.id,
    label: b.name
  })) : [];
  // product useEffect
  useEffect(() => {
    getProducts();
  }, [])

  // Option For Status
  const statusOptions = [
    { value: "1", label: "Active" },
    { value: "0", label: "Inactive" },
  ];

  return (
    <Modal
      show={showProductSpecification}
      onHide={handleCloseProductSpecification}
      centered
      size="lg"
      backdrop="static"
      dialogClassName="modal-container"
    >
      <Modal.Header className="modal-header-custom" closeButton>
        <div>
          <h5 className="modal-title-custom">Add product specification</h5>
          {/* <p className="modal-subtitle">Dashboard • Product specification • Create</p> */}
        </div>
      </Modal.Header>

      <Form onSubmit={handleAddSpecification}>
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
                  <Form.Label>Product Specification Name</Form.Label>
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
                  <Form.Label>Value</Form.Label>
                  <Form.Control
                    className="input-field"
                    type="text"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Product</Form.Label>
                  <Select
                    options={productOptions}
                    value={productOptions.find(opt => opt.value === productId)}
                    onChange={(selected) => setProductId(selected?.value)}
                    className="react-select-container"
                    classNamePrefix="react-select"
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Position</Form.Label>
                  <Form.Control
                    className="input-field"
                    type="text"
                    value={position}
                    onChange={(e) =>
                      setPosition(e.target.value.replace(/[^0-9]/g, ""))
                    }
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
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
              </Col>
            </Row>
          </div>
        </Modal.Body>

        <Modal.Footer className="modal-footer-custom">
          <Button className="btn-outline" onClick={handleCloseProductSpecification}>
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

export default AddProductSpecification;