import { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import axiosInstance from "../../axios";
import Swal from "sweetalert2";

const UpdateEnquirie = ({
  showEnquiries,
  handleCloseEnquiries,
  tableRowData,
  setUpdatedEnquiriesTable,
}) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [number, setNumber] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("");

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (tableRowData) {
      console.log("Edit Data =>", tableRowData);

      setName(tableRowData.name || "");
      setEmail(tableRowData.email || "");
      setNumber(tableRowData.number || "");
      setDescription(tableRowData.description || "");
     setStatus(tableRowData.status || "PENDING");
    }
  }, [tableRowData]);

  const handleUpdateEnquiries = async (e) => {
    e.preventDefault();

    if (!name || !number) {
      Swal.fire({
        title: "Name & Mobile required",
        icon: "warning",
      });
      return;
    }

    setLoading(true);

    try {
      const res = await axiosInstance.put(
        `updateEnquiriesById/${tableRowData?.id}`,
        {
          name: name,
          email: email,
          number: number,
          description: description,
          status: status,
        }
      );

      if (res.data.status === 1) {
        handleCloseEnquiries();
        setUpdatedEnquiriesTable(res.data.data);

        setTimeout(() => {
          Swal.fire({
            title: res.data.message,
            icon: "success",
          });
        }, 300);
      }
    } catch (error) {
      console.log("FULL ERROR =>", error.response?.data || error);

      Swal.fire({
        title: "Something went wrong",
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      show={showEnquiries}
      onHide={handleCloseEnquiries}
      centered
      backdrop="static"
    >
      <Modal.Header
        closeButton
        style={{ backgroundColor: "#1f4f4f", color: "#fff" }}
      >
        <Modal.Title>Update Enquiry</Modal.Title>
      </Modal.Header>

      <Form onSubmit={handleUpdateEnquiries}>
        <Modal.Body>

          {/* Name */}
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              value={name}
              placeholder="Enter Name"
              onChange={(e) => setName(e.target.value)}
              required
            />
          </Form.Group>

          {/* Email */}
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              value={email}
              placeholder="Enter Email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>

          {/* Mobile */}
          <Form.Group className="mb-3">
            <Form.Label>Mobile Number</Form.Label>
            <Form.Control
              value={number}
              placeholder="Enter Mobile Number"
              onChange={(e) => setNumber(e.target.value)}
              required
            />
          </Form.Group>

          {/* Description */}
          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              placeholder="Enter Description"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Form.Group>

          {/* Status */}
           <Form.Group>
            <Form.Label>Status</Form.Label>
            <Form.Select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="PENDING">PENDING</option>
              <option value="RESOLVED">RESOLVED</option>
            </Form.Select>
          </Form.Group>

        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseEnquiries}>
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

export default UpdateEnquirie;