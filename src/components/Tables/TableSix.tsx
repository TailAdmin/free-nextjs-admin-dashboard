
import { useState, useEffect } from "react";
import axios from "axios";
import dynamic from 'next/dynamic';

interface User {
  userid:number;
  fname: string;
  lname: string;
  email: string;
  phone: string;
  status: string;
  type: string;
}

const TableThree = () => {
  const url = "http://localhost:8000/users";
  const [users, setusers] = useState<User[]>([]);
  const [editingRow, setEditingRow] = useState<number | null>(null);
  const [editedFname, setEditedFname] = useState("");
  const [editedLname, setEditedLname] = useState("");
  const [editedEmail, setEditedEmail] = useState("");
  const [editedPhone, setEditedPhone] = useState("");
  const [editedStatus, setEditedStatus] = useState("");
  const [editedType, setEditedType] = useState("");

   // New states for pop-up
   const [isAddUserPopupOpen, setAddUserPopupOpen] = useState(false);
   const [newUserFname, setNewUserFname] = useState("");
   const [newUserLname, setNewUserLname] = useState("");
   const [newUserEmail, setNewUserEmail] = useState("");
   const [newUserPhone, setNewUserPhone] = useState("");
   const [newUserStatus, setNewUserStatus] = useState("");
   const [newUserType, setNewUserType] = useState("");

  useEffect(() => {
  axios
  .get(url)
  .then((res) => {
  setusers(res.data);
  console.log(res);
  })
  .catch((err) => {
  console.log(err);
  });
  }, []);

  const handleDeleteUser = async (providerName: number) => {
    try {
      // Make a DELETE request to the server using the name
      await axios.delete(`http://localhost:8000/users/${encodeURIComponent(providerName)}`);
      // Update the local state to remove the deleted provider
      setusers((prevUsers) => prevUsers.filter((user) => user.userid !== providerName));
    } catch (error) {
      console.error(error);
    }
  };
  const handleEditClick = (index: number) => {
    setEditingRow(index);
    setEditedFname(users[index].fname);
    setEditedLname(users[index].lname);
    setEditedEmail(users[index].email);
    setEditedPhone(users[index].phone);
    setEditedStatus(users[index].status);
    setEditedType(users[index].type);
  };

  const handleSaveClick = async (index: number) => {
    // Save the edited data to the server 
    try {
      // Make a PUT request to update the provider data on the server
      await axios.put(`http://localhost:8000/users/${encodeURIComponent(users[index].userid)}`, {
        fname: editedFname,
        lname: editedLname,
        email: editedEmail,
        phone: editedPhone,
        status: editedStatus,
        type: editedType,
      });
  
      // Update the local state with the edited values
      setusers((prevUsers) =>
        prevUsers.map((user, i) =>
          i === index
            ? {
                ...user,
                fname: editedFname,
                lname: editedLname,
                email: editedEmail,
                phone: editedPhone,
                status: editedStatus,
                type: editedType,
              }
            : user
        )
      );
  
      setEditingRow(null); // Reset editing state after saving
    } catch (error) {
      console.error(error);
    }
  };

// Function to handle opening the pop-up
const handleOpenPopup = () => {
  setAddUserPopupOpen(true);
};

// Function to handle closing the pop-up
const handleClosePopup = () => {
  setAddUserPopupOpen(false);
  // Reset input fields when closing the pop-up
  setNewUserFname("");
  setNewUserLname("");
  setNewUserEmail("");
  setNewUserPhone("");
  setNewUserStatus("");
  setNewUserType("");
};

// Function to handle adding a new user
const handleAddUser = async () => {
  try {
    // Make a POST request to add a new user to the server
    await axios.post("http://localhost:8000/users", {
      fname: newUserFname,
      lname: newUserLname,
      email: newUserEmail,
      phone: newUserPhone,
      status: newUserStatus,
      type: newUserType,
    });
    
    // Refresh the list of providers
    const res = await axios.get(url);
    setusers(res.data);

    // Close the pop-up
    handleClosePopup();
  } catch (error) {
    console.error(error);
  }
};

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="max-w-full overflow-x-auto">
      <div className="flex justify-between items-center mb-6">
  <h4 className="text-xl font-semibold text-black dark:text-white">
    Users' List
  </h4>
  <button onClick={handleOpenPopup} className="bg-primary text-white px-4 py-2 rounded">
    Add New User
  </button>
</div>
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
            <th className="min-w-[220px] px-4 py-4 font-medium text-black dark:text-white xl:pl-11">
                UserId
              </th>
              <th className="min-w-[220px] px-4 py-4 font-medium text-black dark:text-white xl:pl-11">
                First Name
              </th>
              <th className="min-w-[150px] px-4 py-4 font-medium text-black dark:text-white">
                Last Name
              </th>
              <th className="min-w-[120px] px-4 py-4 font-medium text-black dark:text-white">
                Email
              </th>
              <th className="min-w-[120px] px-4 py-4 font-medium text-black dark:text-white">
                Phone Number
              </th>
              <th className="min-w-[120px] px-4 py-4 font-medium text-black dark:text-white">
                Status
              </th>
              <th className="min-w-[120px] px-4 py-4 font-medium text-black dark:text-white">
                Type
              </th>
              <th className="px-4 py-4 font-medium text-black dark:text-white">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((item, key) => (
              <tr key={key}>
                 <td className="border-b border-[#eee] px-4 py-5 pl-9 dark:border-strokedark xl:pl-11">
                  <h5 className="font-medium text-black dark:text-white">
                    {item.userid}
                  </h5>
                  
                </td>
                  <td className="border-b border-[#eee] px-4 py-5 pl-9 dark:border-strokedark xl:pl-11">
                  {editingRow === key ? (
          <input
            type="text"
            value={editedFname}
            onChange={(e) => setEditedFname(e.target.value)}
          />
        ) : (
          <h5 className="font-medium text-black dark:text-white">{item.fname}</h5>
        )}
                  
                </td>
               <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
        {editingRow === key ? (
          <input
            type="text"
            value={editedLname}
            onChange={(e) => setEditedLname(e.target.value)}
          />
        ) : (
          <h5 className="font-medium text-black dark:text-white">{item.lname}</h5>
        )}
      </td>
      <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
        {editingRow === key ? (
          <input
            type="text"
            value={editedEmail}
            onChange={(e) => setEditedEmail(e.target.value)}
          />
        ) : (
          <h5 className="font-medium text-black dark:text-white">{item.email}</h5>
        )}
      </td>
      <td className="border-b border-[#eee] px-4 py-5 pl-9 dark:border-strokedark xl:pl-11">
        {editingRow === key ? (
          <input
            type="text"
            value={editedPhone}
            onChange={(e) => setEditedPhone(e.target.value)}
          />
        ) : (
          <h5 className="font-medium text-black dark:text-white">{item.phone}</h5>
        )}
      </td>
               
                
      <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
  {editingRow === key ? (
    <select
      value={editedStatus}
      onChange={(e) => setEditedStatus(e.target.value)}
    >
      <option value="Active">Active</option>
      <option value="Inactive">Inactive</option>
    </select>
  ) : (
    <p
      className={`inline-flex rounded-full bg-opacity-10 px-3 py-1 text-sm font-medium ${
        item.status === "Active"
          ? "bg-success text-success"
          : item.status === "Inactive"
          ? "bg-danger text-danger"
          : "bg-warning text-warning"
      }`}
    >
      {item.status}
    </p>
  )}
</td>
<td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
  {editingRow === key ? (
    <select
      value={editedType}
      onChange={(e) => setEditedType(e.target.value)}
    >
      <option value="Provider">Provider</option>
      <option value="Seeker">Seeker</option>
    </select>
  ) : (
    <p
      className={`inline-flex rounded-full bg-opacity-10 px-3 py-1 text-sm font-medium ${
        item.type === "Provider"
          ? "bg-success text-success"
          : item.status === "Seeker"
          ? "bg-danger text-danger"
          : "bg-warning text-warning"
      }`}
    >
      {item.type}
    </p>
  )}
</td>
{isAddUserPopupOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-md shadow-md">
              <h2 className="text-lg font-semibold mb-4">Add New User</h2>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  value={newUserFname}
                  onChange={(e) => setNewUserFname(e.target.value)}
                  className="border p-2 w-full"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  value={newUserLname}
                  onChange={(e) => setNewUserLname(e.target.value)}
                  className="border p-2 w-full"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="text"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  className="border p-2 w-full"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Phone</label>
                <input
                  type="text"
                  value={newUserPhone}
                  onChange={(e) => setNewUserPhone(e.target.value)}
                  className="border p-2 w-full"
                />
              </div>
              <div className="mb-4">
  <label className="block text-sm font-medium text-gray-700">Status</label>
  <select
    value={newUserStatus}
    onChange={(e) => setNewUserStatus(e.target.value)}
    className="border p-2 w-full"
  >
    <option value="">Select Status</option>
    <option value="Active">Active</option>
    <option value="Inactive">Inactive</option>
  </select>
</div>
<div className="mb-4">
  <label className="block text-sm font-medium text-gray-700">Type</label>
  <select
    value={newUserType}
    onChange={(e) => setNewUserType(e.target.value)}
    className="border p-2 w-full"
  >
    <option value="">Select Type</option>
    <option value="Provider">Provider</option>
    <option value="Seeker">Seeker</option>
  </select>
</div>
              <div className="flex justify-end">
                <button onClick={handleClosePopup} className="mr-2 bg-gray-300 px-4 py-2 rounded">
                  Cancel
                </button>
                <button onClick={handleAddUser} className="bg-primary text-white px-4 py-2 rounded">
                  Add User
                </button>
              </div>
            </div>
          </div>
        )}
                <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                  <div className="flex items-center space-x-3.5">
                  {editingRow === key ? (
                      <>
                        <button onClick={() => handleSaveClick(key)} className="hover:text-primary">
                          Save
                        </button>
                        {/* ... (other buttons) */}
                      </>
                    ) : (
                      <button onClick={() => handleEditClick(key)} className="hover:text-primary">
                        {/* Edit icon SVG goes here */}
                        <svg
                          className="fill-current"
                          width="18"
                          height="18"
                          viewBox="0 0 18 18"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                        <path
                          d="M8.99981 14.8219C3.43106 14.8219 0.674805 9.50624 0.562305 9.28124C0.47793 9.11249 0.47793 8.88749 0.562305 8.71874C0.674805 8.49374 3.43106 3.20624 8.99981 3.20624C14.5686 3.20624 17.3248 8.49374 17.4373 8.71874C17.5217 8.88749 17.5217 9.11249 17.4373 9.28124C17.3248 9.50624 14.5686 14.8219 8.99981 14.8219ZM1.85605 8.99999C2.4748 10.0406 4.89356 13.5562 8.99981 13.5562C13.1061 13.5562 15.5248 10.0406 16.1436 8.99999C15.5248 7.95936 13.1061 4.44374 8.99981 4.44374C4.89356 4.44374 2.4748 7.95936 1.85605 8.99999Z"
                          fill=""
                        />
                        <path
                          d="M9 11.3906C7.67812 11.3906 6.60938 10.3219 6.60938 9C6.60938 7.67813 7.67812 6.60938 9 6.60938C10.3219 6.60938 11.3906 7.67813 11.3906 9C11.3906 10.3219 10.3219 11.3906 9 11.3906ZM9 7.875C8.38125 7.875 7.875 8.38125 7.875 9C7.875 9.61875 8.38125 10.125 9 10.125C9.61875 10.125 10.125 9.61875 10.125 9C10.125 8.38125 9.61875 7.875 9 7.875Z"
                          fill=""
                        />
                      </svg>
                    </button>
                    )}
                    <button className="hover:text-primary" onClick={() => handleDeleteUser(item.userid)}>
                      <svg
                        className="fill-current"
                        width="18"
                        height="18"
                        viewBox="0 0 18 18"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M13.7535 2.47502H11.5879V1.9969C11.5879 1.15315 10.9129 0.478149 10.0691 0.478149H7.90352C7.05977 0.478149 6.38477 1.15315 6.38477 1.9969V2.47502H4.21914C3.40352 2.47502 2.72852 3.15002 2.72852 3.96565V4.8094C2.72852 5.42815 3.09414 5.9344 3.62852 6.1594L4.07852 15.4688C4.13477 16.6219 5.09102 17.5219 6.24414 17.5219H11.7004C12.8535 17.5219 13.8098 16.6219 13.866 15.4688L14.3441 6.13127C14.8785 5.90627 15.2441 5.3719 15.2441 4.78127V3.93752C15.2441 3.15002 14.5691 2.47502 13.7535 2.47502ZM7.67852 1.9969C7.67852 1.85627 7.79102 1.74377 7.93164 1.74377H10.0973C10.2379 1.74377 10.3504 1.85627 10.3504 1.9969V2.47502H7.70664V1.9969H7.67852ZM4.02227 3.96565C4.02227 3.85315 4.10664 3.74065 4.24727 3.74065H13.7535C13.866 3.74065 13.9785 3.82502 13.9785 3.96565V4.8094C13.9785 4.9219 13.8941 5.0344 13.7535 5.0344H4.24727C4.13477 5.0344 4.02227 4.95002 4.02227 4.8094V3.96565ZM11.7285 16.2563H6.27227C5.79414 16.2563 5.40039 15.8906 5.37227 15.3844L4.95039 6.2719H13.0785L12.6566 15.3844C12.6004 15.8625 12.2066 16.2563 11.7285 16.2563Z"
                          fill=""
                        />
                        <path
                          d="M9.00039 9.11255C8.66289 9.11255 8.35352 9.3938 8.35352 9.75942V13.3313C8.35352 13.6688 8.63477 13.9782 9.00039 13.9782C9.33789 13.9782 9.64727 13.6969 9.64727 13.3313V9.75942C9.64727 9.3938 9.33789 9.11255 9.00039 9.11255Z"
                          fill=""
                        />
                        <path
                          d="M11.2502 9.67504C10.8846 9.64692 10.6033 9.90004 10.5752 10.2657L10.4064 12.7407C10.3783 13.0782 10.6314 13.3875 10.9971 13.4157C11.0252 13.4157 11.0252 13.4157 11.0533 13.4157C11.3908 13.4157 11.6721 13.1625 11.6721 12.825L11.8408 10.35C11.8408 9.98442 11.5877 9.70317 11.2502 9.67504Z"
                          fill=""
                        />
                        <path
                          d="M6.72245 9.67504C6.38495 9.70317 6.1037 10.0125 6.13182 10.35L6.3287 12.825C6.35683 13.1625 6.63808 13.4157 6.94745 13.4157C6.97558 13.4157 6.97558 13.4157 7.0037 13.4157C7.3412 13.3875 7.62245 13.0782 7.59433 12.7407L7.39745 10.2657C7.39745 9.90004 7.08808 9.64692 6.72245 9.67504Z"
                          fill=""
                        />
                      </svg>
                    </button>
                    
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default dynamic(() => Promise.resolve(TableThree), {
  ssr: false,
});
