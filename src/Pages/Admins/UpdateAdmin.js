import { useEffect, useState } from "react";
import { Col, Row, Spinner } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import axiosInstance from "../../axios";
import Swal from "sweetalert2";

const UpdateAdmin = ({
  showAdmins,
  handleCloseAdmins,
  tableRowData,
  setUpdatedAdminsTable,
}) => {
  console.log("tableRowData =>", tableRowData)

  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");

  const [loading, setLoading] = useState(false);

  // Pre-filled Fields
  useEffect(() => {
    if (tableRowData) {
      setName(tableRowData.name || "");
      setNumber(tableRowData.number || "");
      setEmail(tableRowData.email || "");
      setPassword("");
      setAddress(tableRowData.address || "");
    }
  }, [tableRowData]);

  const handleUpdateAdmin = async (e) => {
    e.preventDefault();

    if (
      !name ||
      !email ||
      !number ||
      // !password ||
      !address
    ) return;

    const adminBody = {
      name: name,
      email: email,
      number: number,
      password: password,
      address: address
    }
    console.log("admin body =>", adminBody)

    try {
      setLoading(true);

      const res = await axiosInstance.put(
        `updateAdminsById/${tableRowData.id}`, adminBody);
      console.log("admin res =>", res)

      if (res.data.status === 1) {
        handleCloseAdmins();

        Swal.fire({
          title: res.data.message,
          icon: "success",
          timer: 1200,
          showConfirmButton: false
        });

        setUpdatedAdminsTable(res.data.data);

        // Reset fields
        setName("");
        setEmail("");
        setNumber("");
        setPassword("");
        setAddress("");
      } else {
        Swal.fire({
          title: "An error occurred",
          icon: "error",
        });
      }
    } catch (error) {
      console.log("Add Admin Error:", error);
      Swal.fire({
        title: error?.message || "An error occurred",
        icon: "error",
        text: error?.response?.data?.message || "",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      show={showAdmins}
      onHide={handleCloseAdmins}
      centered
      size="lg"
      backdrop="static"
      dialogClassName="modal-container"
    >
      <Modal.Header className="modal-header-custom" closeButton>
        <div>
          <h5 className="modal-title-custom">Edit Admin</h5>
          {/* <p className="modal-subtitle">Dashboard • Product • Create</p> */}
        </div>
      </Modal.Header>

      <Form onSubmit={handleUpdateAdmin}>
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
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
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
            </Row>
          </div>
        </Modal.Body>

        <Modal.Footer className="modal-footer-custom">
          <Button className="btn-outline" onClick={handleCloseAdmins}>
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

export default UpdateAdmin;