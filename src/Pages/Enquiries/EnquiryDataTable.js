import React from "react";
import DynamicTable from "../../Components/DynamicTable";
import Swal from "sweetalert2";
import axiosInstance from "../../axios";
// import UpdateEnquiries from "./UpdateEnquiry";
import {
  FaCheck,
  // FaEdit,
  // FaEye,
  FaTrash
}
  from "react-icons/fa";
import SimpleImageCell from "../../Components/SimpleImageCell";

const EnquiriesDataTable = ({
  enquiries,
  loading,
  setUpdatedEnquiriesTable,
}) => {
  const columns = [
    { field: "id", header: "ID" },
    {
      field: "url",
      header: "Image",
      body: (rowData) => (
        <SimpleImageCell src={rowData.url} />
      ),
    },
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
      field: "description",
      header: "Description",
      style: { minWidth: "150px", textWrap: "wrap" },
      body: (rowData) => (
        <div
          style={!rowData.description ? { textAlign: "center" } : { textAlign: "left" }}
        >
          {rowData.description ? rowData.description : "-"}
        </div>
      )
    },
    {
      field: "status",
      header: "Status",
      body: (rowData) => (
        <span className={`status-badge ${rowData.status === "RESOLVED" ? "active" : "in-active"}`}>
          {rowData.status === "RESOLVED" ? "RESOLVED" : "PENDING"}
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
            disabled={rowData.status === "RESOLVED"}
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
  // const [showEnquiries, setShowEnquiries] = useState(false);

  // const handleCloseEnquiries = () => setShowEnquiries(false);
  // const handleShowEnquiries = () => setShowEnquiries(true);

  // const handleEdit = (row) => {
  //   console.log("Edit", row);
  //   handleShowEnquiries();
  //   setTableRowData(row);
  // };

  const handleMarkAsSeen = async (row) => {
    if (row.status === "RESOLVED") return;

    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You want to resolve this?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#1f4f4f",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, resolved it!",
    });

    if (result.isConfirmed) {
      try {
        const res = await axiosInstance.put(
          `/updateEnquiriesStatusById/${row.id}/true`,
        );

        if (res.data.status === 1) {
          Swal.fire({
            title: res.data.message,
            icon: "success",
            timer: 1200,
            showConfirmButton: false
          });

          setUpdatedEnquiriesTable(res.data.data);
        } else {
          Swal.fire({
            title: "An error occurred",
            icon: "error",
          });
        }
      } catch (error) {
        console.log("Mark Seen Enquiry Error:", error);
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
      text: "This enquiry will be deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#1f4f4f",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        const res = await axiosInstance.delete(
          `deleteEnquiriesById/${row.id}`,
        );

        if (res.data.status === 1) {
          Swal.fire({
            title: res.data.message,
            icon: "success",
            timer: 1200,
            showConfirmButton: false
          });

          setUpdatedEnquiriesTable(row.id);
        } else {
          Swal.fire({
            title: "An error occurred",
            icon: "error",
          });
        }
      } catch (error) {
        console.log("Delete Enquiry Error:", error);
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
      <DynamicTable data={enquiries} columns={columns} loading={loading} />
      {/* <UpdateEnquiries
        showEnquiries={showEnquiries}
        handleCloseEnquiries={handleCloseEnquiries}
        handleShowEnquiries={handleCloseEnquiries}
        setUpdatedEnquiriesTable={setUpdatedEnquiriesTable}
        tableRowData={tableRowData}
      /> */}
    </>
  );
};

export default EnquiriesDataTable;
