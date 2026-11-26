import React from "react";
import DynamicTable from "../../Components/DynamicTable";
import Swal from "sweetalert2";
import axiosInstance from "../../axios";
// import UpdateContactUs from "./Updatecontact us";
import {
  FaCheck,
  // FaEdit,
  // FaEye,
  FaTrash
}
  from "react-icons/fa";

const ContactUsDataTable = ({
  contactUs,
  loading,
  setUpdatedContactUsTable,
}) => {
  const columns = [
    { field: "id", header: "ID" },
    {
      field: "name",
      header: "Name",
      body: (rowData) => (
        <div className="name-cell">{rowData.name}</div>
      ),
    },
    { field: "email", header: "Email" },
    { field: "number", header: "Number" },
    {
      field: "message",
      header: "Message",
      style: { minWidth: "150px", textWrap: "wrap" },
      body: (rowData) => (
        <div
          style={!rowData.message ? { textAlign: "center" } : { textAlign: "left" }}
        >
          {rowData.message ? rowData.message : "-"}
        </div>
      )
    },
    {
      field: "status",
      header: "Status",
      body: (rowData) => (
        <span className={`status-badge ${rowData.status === "SEEN" ? "active" : "in-active"}`}>
          {rowData.status === "SEEN" ? "SEEN" : "UNSEEN"}
        </span>
      )
    },
    { field: "created_at", header: "Created At" },
    { field: "updated_at", header: "Updated At" },
    {
      header: "Actions",
      body: (rowData) => (
        <div className="action-group">

          <button
            className="action-btn"
            onClick={() => handleMarkAsSeen(rowData)}
            disabled={rowData.status === "SEEN"}
          >
            <FaCheck />
            {/* <span>View</span> */}
          </button>

          {/* <button
            className="action-btn warning"
            onClick={() => handleEdit(rowData)}
          >
            <FaEdit />
            <span>Edit</span>
          </button> */}

          <button
            className="action-btn danger"
            onClick={() => handleDelete(rowData)}
          >
            <FaTrash />
            {/* <span>Delete</span> */}
          </button>

        </div>
      ),
    }
  ];

  // const [tableRowData, setTableRowData] = useState([]);

  // -------------------- Update Modal States ------------------
  // const [showContactUs, setShowContactUs] = useState(false);

  // const handleCloseContactUs = () => setShowContactUs(false);
  // const handleShowContactUs = () => setShowContactUs(true);

  // const handleEdit = (row) => {
  //   console.log("Edit", row);
  //   handleShowContactUs();
  //   setTableRowData(row);
  // };

  const handleMarkAsSeen = async (row) => {
    if (row.status === "SEEN") return;

    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You had seen this?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#1f4f4f",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, seen it!",
    });

    if (result.isConfirmed) {
      try {
        const res = await axiosInstance.put(
          `/updateContactUsStatusById/${row.id}/true`,
        );

        if (res.data.status === 1) {
          Swal.fire({
            title: res.data.message,
            icon: "success",
            timer: 1200,
            showConfirmButton: false
          });

          setUpdatedContactUsTable(res.data.data);
        } else {
          Swal.fire({
            title: "An error occurred",
            icon: "error",
          });
        }
      } catch (error) {
        console.log("Mark Seen contact us Error:", error);
        // Swal.fire({
        //   title: error?.message || "An error occurred",
        //   icon: "error",
        //   text: error?.response?.data?.message || "",
        // });
      }
    }
  }

  const handleDelete = async (row) => {
    console.log("DELETE ", row);
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This contact us will be deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#1f4f4f",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        const res = await axiosInstance.delete(
          `deleteContactUsById/${row.id}`,
        );

        if (res.data.status === 1) {
          Swal.fire({
            title: res.data.message,
            icon: "success",
            timer: 1200,
            showConfirmButton: false
          });

          setUpdatedContactUsTable(row.id);
        } else {
          Swal.fire({
            title: "An error occurred",
            icon: "error",
          });
        }
      } catch (error) {
        console.log("Delete Contact Us Error:", error);
        // Swal.fire({
        //   title: error?.message || "An error occurred",
        //   icon: "error",
        //   text: error?.response?.data?.message || "",
        // });
      }
    }
  };

  return (
    <>
      <DynamicTable data={contactUs} columns={columns} loading={loading} />
      {/* <UpdateContactUs
        showContactUs={showContactUs}
        handleCloseContactUs={handleCloseContactUs}
        handleShowContactUs={handleCloseContactUs}
        setUpdatedContactUsTable={setUpdatedContactUsTable}
        tableRowData={tableRowData}
      /> */}
    </>
  );
};

export default ContactUsDataTable;
