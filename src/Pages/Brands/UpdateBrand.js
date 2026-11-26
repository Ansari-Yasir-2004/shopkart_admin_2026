import { useEffect, useState } from "react";
import { Col, Row, Spinner } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import axiosInstance from "../../axios";
import Swal from "sweetalert2";
import Select from "react-select";

const UpdateBrand = ({
  showBrands,
  handleCloseBrands,
  tableRowData,
  setUpdatedBrandsTable,
}) => {
  const [brandName, setBrandName] = useState("");
  const [status, setStatus] = useState("");

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (tableRowData) {
      setBrandName(tableRowData.name || "");
      setStatus(String(tableRowData.status));
    }
  }, [tableRowData]);

  const handleUpdateBrand = async (e) => {
    e.preventDefault();

    if (!brandName || !status) return;

    const brandBody = {
      name: brandName,
      status: status,
    }
    console.log("brand body =>", brandBody)

    try {
      setLoading(true);

      const res = await axiosInstance.put(`updateBrandsById/${tableRowData.id}`, brandBody);

      if (res.data.status === 1) {
        console.log("Res ==> ", res.data);

        handleCloseBrands();

        Swal.fire({
          title: res.data.message,
          icon: "success",
          timer: 1200,
          showConfirmButton: false
        });

        setUpdatedBrandsTable(res.data.data);

        // reset
        setBrandName("");
        setStatus("");
      } else {
        Swal.fire({
          title: "An error occurred",
          icon: "error",
        });
      }
    } catch (error) {
      console.log("Update Brand Error:", error);
      // Swal.fire({
      //   title: error?.message || "An error occurred",
      //   icon: "error",
      //   text: error?.response?.data?.message || "",
      // });
    } finally {
      setLoading(false);
    }
  };

  // Option For Status
  const statusOptions = [
    { value: "1", label: "Active" },
    { value: "0", label: "Inactive" },
  ];

  return (
    <Modal
      show={showBrands}
      onHide={handleCloseBrands}
      centered
      size="lg"
      backdrop="static"
      dialogClassName="modal-container"
    >
      <Modal.Header className="modal-header-custom" closeButton>
        <div>
          <h5 className="modal-title-custom">Edit Brand </h5>
          {/* <p className="modal-subtitle">Dashboard • Product • Create</p> */}
        </div>
      </Modal.Header>

      <Form onSubmit={handleUpdateBrand}>
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
                  <Form.Label>Brand Name</Form.Label>
                  <Form.Control
                    className="input-field"
                    type="text"
                    value={brandName}
                    onChange={(e) => setBrandName(e.target.value)}
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
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
          <Button className="btn-outline" onClick={handleCloseBrands}>
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

export default UpdateBrand;
