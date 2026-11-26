import { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import axiosInstance from "../../axios";
import Swal from "sweetalert2";

const UpdateContactUs = ({
  showContactUs,
  handleCloseContactUs,
  tableRowData,
  setUpdatedContactUsTable,
}) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [number, setNumber] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("UNSEEN");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (tableRowData) {
      setName(tableRowData.name || "");
      setEmail(tableRowData.email || "");
      setNumber(tableRowData.number || "");
      setMessage(tableRowData.message || "");
      setStatus(tableRowData.status || "UNSEEN");
    }
  }, [tableRowData]);

  const handleUpdateContactUs = async (e) => {
    e.preventDefault();

    if (!name || !email || !number || !message) return;

    setLoading(true);

    try {
      const res = await axiosInstance.put(
        `updateContactUsById/${tableRowData.id}`,
        {
          name,
          email,
          number,
          message,
          status,
        },
      );

      if (res.data.status === 1) {
        handleCloseContactUs();
        setUpdatedContactUsTable(Date.now()); // 🔥 refresh

        Swal.fire({
          title: res.data.message,
          icon: "success",
        });
      }
    } catch (error) {
      Swal.fire({
        title: error?.response?.data?.message || "Error",
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      show={showContactUs}
      onHide={handleCloseContactUs}
      centered
      backdrop="static"
    >
      <Modal.Header
        closeButton
        style={{ backgroundColor: "#1f4f4f", color: "#fff" }}
      >
        <Modal.Title>Update Contact</Modal.Title>
      </Modal.Header>

      <Form onSubmit={handleUpdateContactUs}>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Mobile Number</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter Mobile Number"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Message</Form.Label>
            <Form.Control
              as="textarea"
              placeholder="Enter Message"
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Status</Form.Label>
            <Form.Select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="UNSEEN">UNSEEN</option>
              <option value="SEEN">SEEN</option>
            </Form.Select>
          </Form.Group>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseContactUs}>
            Cancel
          </Button>

          <Button
            type="submit"
            style={{ backgroundColor: "#1f4f4f", border: "none" }}
            disabled={loading}
          >
            {loading ? (
              <>
                <Spinner size="sm" /> Updating...
              </>
            ) : (
              "Update"
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default UpdateContactUs;
