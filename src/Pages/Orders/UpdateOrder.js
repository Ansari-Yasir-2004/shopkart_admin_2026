// import { useEffect, useState } from "react";
// import { Spinner } from "react-bootstrap";
// import Button from "react-bootstrap/Button";
// import Form from "react-bootstrap/Form";
// import Modal from "react-bootstrap/Modal";
// import axiosInstance from "../../axios";
// import Swal from "sweetalert2";

// const UpdateOrderStatus = ({
//   showOrderModal,
//   handleCloseOrderModal,
//   tableRowData,
//   setUpdatedOrderTable,
// }) => {
//   const [status, setStatus] = useState("");
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     if (tableRowData) {
//       setStatus(tableRowData.status || "PENDING");
//     }
//   }, [tableRowData]);

//   const handleUpdateOrder = async (e) => {
//     e.preventDefault();

//     setLoading(true);

//     try {
//       const res = await axiosInstance.put(
//         `/updateOrderStatusById/${tableRowData?.id}`,
//         { status }
//       );

//       if (res.data.status === 1) {
//         handleCloseOrderModal();
//         setUpdatedOrderTable((prev) => !prev);

//         Swal.fire({
//           title: res.data.message,
//           icon: "success",
//         });
//       }
//     } catch (error) {
//       console.log(error);

//       Swal.fire({
//         title: "Something went wrong",
//         icon: "error",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Modal
//       show={showOrderModal}
//       onHide={handleCloseOrderModal}
//       centered
//       backdrop="static"
//     >
//       <Modal.Header
//         closeButton
//         style={{ backgroundColor: "#1f4f4f", color: "#fff" }}
//       >
//         <Modal.Title>Update Order Status</Modal.Title>
//       </Modal.Header>

//       <Form onSubmit={handleUpdateOrder}>
//         <Modal.Body>

//           {/* Status */}
//           <Form.Group>
//             <Form.Label>Status</Form.Label>
//             <Form.Select
//               value={status}
//               onChange={(e) => setStatus(e.target.value)}
//             >
//               <option value="PENDING">PENDING</option>
//               <option value="CONFIRMED">CONFIRMED</option>
//               <option value="CANCELLED">CANCELLED</option>
//             </Form.Select>
//           </Form.Group>

//         </Modal.Body>

//         <Modal.Footer>
//           <Button variant="secondary" onClick={handleCloseOrderModal}>
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

// export default UpdateOrderStatus;