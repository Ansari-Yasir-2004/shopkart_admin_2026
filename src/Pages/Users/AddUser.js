import React, { useState } from "react";
import { Modal, Button, Form, Spinner, Row, Col } from "react-bootstrap";
import axiosInstance from "../../axios";
import Swal from "sweetalert2";

const AddUser = ({ showUsers, handleCloseUsers, setUpdatedUsersTable }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [number, setNumber] = useState("");
  const [password, setPassword] = useState("");
  // const [address, setAddress] = useState("");

  const [loading, setLoading] = useState(false);

  const handleAddUser = async (e) => {
    e.preventDefault();

    if (
      !name ||
      !email ||
      !number ||
      !password
      // !address
    ) return;

    const UserBody = {
      name: name,
      email: email,
      number: number,
      password: password,
      // address: address
    }
    console.log("User body =>", UserBody)

    try {
      setLoading(true);

      const res = await axiosInstance.post("addUsers", UserBody);

      if (res.data.status === 1) {
        handleCloseUsers();

        Swal.fire({
          title: res.data.message,
          icon: "success",
          timer: 1200,
          showConfirmButton: false
        });

        setUpdatedUsersTable(res.data.data);

        // Reset fields
        setName("");
        setEmail("");
        setNumber("");
        setPassword("");
        // setAddress("");
      } else {
        Swal.fire({
          title: "An error occurred",
          icon: "error",
        });
      }
    } catch (error) {
      console.log("Add User Error:", error);
      // Swal.fire({
      //   title: error?.message || "An error occurred",
      //   icon: "error",
      //   text: error?.response?.data?.message || "",
      // });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      show={showUsers}
      onHide={handleCloseUsers}
      centered
      size="lg"
      backdrop="static"
      dialogClassName="modal-container"
    >
      <Modal.Header className="modal-header-custom" closeButton>
        <div>
          <h5 className="modal-title-custom">Add User</h5>
          {/* <p className="modal-subtitle">Dashboard • Product • Create</p> */}
        </div>
      </Modal.Header>

      <Form onSubmit={handleAddUser}>
        <Modal.Body>
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
            </Row>

            <Row>
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

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    className="input-field"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            {/* <Row>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Address</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                  />
                </Form.Group>
              </Col>
            </Row> */}
          </div>
        </Modal.Body>

        <Modal.Footer className="modal-footer-custom">
          <Button className="btn-outline" onClick={handleCloseUsers}>
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

export default AddUser;
