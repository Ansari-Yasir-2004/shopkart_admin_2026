// import { useEffect, useState } from "react";
// import { Spinner } from "react-bootstrap";
// import Button from "react-bootstrap/Button";
// import Form from "react-bootstrap/Form";
// import Modal from "react-bootstrap/Modal";
// import axiosInstance from "../../axios";
// import Swal from "sweetalert2";

// const UpdateUser = ({
//   showUsers,
//   handleCloseUsers,
//   tableRowData,
//   setUpdatedUsersTable,
// }) => {
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [number, setNumber] = useState("");
//   const [password, setPassword] = useState("");
//   // const [url, setUrl] = useState("");
//   const [address, setAddress] = useState("");
//   const [block, setBlock] = useState(0);
//   const [blockReason, setBlockReason] = useState("");
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     if (tableRowData) {
//       setName(tableRowData.name || "");
//       setEmail(tableRowData.email || "");
//       setNumber(tableRowData.number || "");
//       setPassword(tableRowData.password ||"");
//       // setUrl(tableRowData.url || "");
//       setAddress(tableRowData.address || "");
//       setBlock(
//         tableRowData.block !== undefined ? Number(tableRowData.block) : 0,
//       );
//       setBlockReason(tableRowData.block_reason || "");
//     }
//   }, [tableRowData]);

//   const handleUpdateUser = async (e) => {
//     e.preventDefault();

//     if (!name || !number) return;

//     setLoading(true);

//     try {
//       const res = await axiosInstance.put(`updateUsersById/${tableRowData.id}`, {
//         name,
//         email,
//         number,
//         password,
//         // url,
//         address,
//         block,
//         block_reason: blockReason,
//       });

//       if (res.data.status === 1) {
//         handleCloseUsers();
//         setUpdatedUsersTable(res.data.data);

//         Swal.fire({
//           title: res.data.message,
//           icon: "success",
//         });
//       }
//     } catch (error) {
//       console.log("Update User Error:", error);
//       Swal.fire("Error updating user", "", "error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Modal
//       show={showUsers}
//       onHide={handleCloseUsers}
//       centered
//       backdrop="static"
//     >
//       <Modal.Header
//         closeButton
//         style={{ backgroundColor: "#1f4f4f", color: "#fff" }}
//       >
//         <Modal.Title>Update User</Modal.Title>
//       </Modal.Header>

//       <Form onSubmit={handleUpdateUser}>
//         <Modal.Body>
//           {/* Name */}
//           <Form.Group className="mb-3">
//             <Form.Label>Name</Form.Label>
//             <Form.Control
//               type="text"
//               placeholder="Enter User Name"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//               required
//             />
//           </Form.Group>

//           <Form.Group className="mb-3">
//             <Form.Label>Email</Form.Label>
//             <Form.Control
//               type="email"
//               placeholder="Enter Email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//             />
//           </Form.Group>

//           {/* Number */}
//           <Form.Group className="mb-3">
//             <Form.Label>Mobile Number</Form.Label>
//             <Form.Control
//               type="text"
//               placeholder="Enter Mobile Number"
//               value={number}
//               onChange={(e) => setNumber(e.target.value)}
//               required
//             />
//           </Form.Group>

//           {/* Password */}
//           <Form.Group className="mb-3">
//             <Form.Label>Password</Form.Label>
//             <Form.Control
//               type="password"
//               placeholder="Enter Password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//             />
//           </Form.Group>

//           {/* URL
//           <Form.Group className="mb-3">
//             <Form.Label>URL</Form.Label>
//             <Form.Control
//               type="text"
//               value={url}
//               onChange={(e) => setUrl(e.target.value)}
//             />
//           </Form.Group> */}

//           {/* Address */}
//           <Form.Group className="mb-3">
//             <Form.Label>Address</Form.Label>
//             <Form.Control
//               type="text"
//               placeholder="Enter Address"
//               value={address}
//               onChange={(e) => setAddress(e.target.value)}
//             />
//           </Form.Group>

//           {/* Block */}
//           <Form.Group className="mb-3">
//             <Form.Label>Block</Form.Label>
//             <Form.Select
//               value={block}
//               onChange={(e) => setBlock(Number(e.target.value))}
//             >
//               <option value={0}>UnBlocked</option>
//               <option value={1}>Blocked</option>
//             </Form.Select>
//           </Form.Group>

//           {/* Block Reason */}
//           {block === 1 && (
//             <Form.Group className="mb-3">
//               <Form.Label>Block Reason</Form.Label>
//               <Form.Control
//                 as="textarea"
//                 placeholder="Enter Block Reason"
//                 rows={2}
//                 value={blockReason}
//                 onChange={(e) => setBlockReason(e.target.value)}
//               />
//             </Form.Group>
//           )}
//         </Modal.Body>

//         <Modal.Footer>
//           <Button variant="secondary" onClick={handleCloseUsers}>
//             Cancel
//           </Button>

//           <Button
//             type="submit"
//             style={{ backgroundColor: "#1f4f4f", border: "none" }}
//             disabled={loading}
//           >
//             {loading ? (
//               <>
//                 <Spinner size="sm" /> Updating...
//               </>
//             ) : (
//               "Update"
//             )}
//           </Button>
//         </Modal.Footer>
//       </Form>
//     </Modal>
//   );
// };

// export default UpdateUser;


import { useEffect, useState } from "react";
import { Col, Row, Spinner } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import axiosInstance from "../../axios";
import Swal from "sweetalert2";

const UpdateUser = ({
  showUsers,
  handleCloseUsers,
  tableRowData,
  setUpdatedUsersTable,
}) => {
  console.log("tableRowData =>", tableRowData)

  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // const [address, setAddress] = useState("");

  const [loading, setLoading] = useState(false);

  // Pre-filled Fields
  useEffect(() => {
    if (tableRowData) {
      setName(tableRowData.name || "");
      setNumber(tableRowData.number || "");
      setEmail(tableRowData.email || "");
      setPassword("");
      // setAddress(tableRowData.address || "");
    }
  }, [tableRowData]);

  const handleUpdateUser = async (e) => {
    e.preventDefault();

    if (
      !name ||
      !email ||
      !number
      // !password ||
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

      const res = await axiosInstance.put(`updateUsersById/${tableRowData.id}`, UserBody);
      console.log("User res =>", res)

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
          <h5 className="modal-title-custom">Edit User</h5>
          {/* <p className="modal-subtitle">Dashboard • Product • Create</p> */}
        </div>
      </Modal.Header>

      <Form onSubmit={handleUpdateUser}>
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

export default UpdateUser;