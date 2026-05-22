// src/features/Admin/pages/Users/Users.tsx

import  { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import AdminDashboardLayout from "../../layouts/AdminDashboardLayout";

import ConfirmationModal from "../../components/ConfirmationModal";

import type { AppDispatch, RootState } from "../../../redux/store";

import {
  fetchUsers,
  toggleUserStatus,
} from "../../../redux/Slices/UserManagementSlice";

import { ROUTES } from "../../../Constants/Routes";

const Users = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { users, loading, pagination } = useSelector(
    (state: RootState) => state.user
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const [modalAction, setModalAction] = useState<
    "BLOCK" | "UNBLOCK" | "DELETE" | "RESTORE" | null
  >(null);

  useEffect(() => {
    dispatch(
      fetchUsers({
        search: debouncedSearch,
        page: currentPage,
        limit: 5,
      })
    );
  }, [dispatch, debouncedSearch, currentPage]);

useEffect(() => {
  const timer = setTimeout(() => {
    setDebouncedSearch(searchTerm);
  }, 500);

  return () => clearTimeout(timer);
}, [searchTerm]);

  const handleConfirm = () => {
    if (!selectedUserId || !modalAction) return;

    dispatch(
      toggleUserStatus({
        id: selectedUserId,
        action: modalAction,
      })
    );

    setIsModalOpen(false);
    setSelectedUserId(null);
    setModalAction(null);
  };

  
    return (
<>
  <AdminDashboardLayout pageTitle="USERS">

    {/* Search */}

    <input
      type="text"
      placeholder="Search user..."
      value={searchTerm}
      onChange={(e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
      }}
      className="w-full bg-white rounded-2xl px-6 py-4 shadow mb-8"
    />

    {/* Table */}

    <div className="bg-white rounded-3xl overflow-hidden shadow-lg">

      <table className="w-full">

        <thead>
          <tr className="bg-blue-800 text-white">
            <th className="py-5 px-6 text-left">
              User
            </th>

            <th className="text-center">
              Children
            </th>

            <th className="text-center">
              Status
            </th>

            <th className="text-center">
              Actions
            </th>
          </tr>
        </thead>

        <tbody>

          {loading ? (

            <tr>
              <td
                colSpan={4}
                className="text-center py-8"
              >
                Loading...
              </td>
            </tr>

          ) : users.length === 0 ? (

            <tr>
              <td
                colSpan={4}
                className="text-center py-8"
              >
                No Users Found
              </td>
            </tr>

          ) : (

            users.map((user, index) => (

              <tr
                key={user.id}
                className={
                  index % 2
                  ? "bg-white"
                  : "bg-gray-50"
                }
              >

                <td className="py-5 px-6 font-semibold">
                  {user.name}
                </td>

                <td className="text-center">
                  {user.childrenIds?.length || 0}
                </td>

                <td className="text-center">

                  <span
                    className={
                      user.status==="BLOCKED"
                      ? "text-red-500 font-bold"
                      : "text-green-500 font-bold"
                    }
                  >
                    {user.status}
                  </span>

                </td>

                <td>
                  <div className="flex justify-center gap-6">

                    <button
                      onClick={()=>{
                        setSelectedUserId(user.id)

                        setModalAction(
                          user.status==="BLOCKED"
                          ? "UNBLOCK"
                          : "BLOCK"
                        )

                        setIsModalOpen(true)
                      }}
                      className="text-red-500 font-semibold"
                    >
                      {user.status==="BLOCKED"
                        ? "Unblock"
                        : "Block"}
                    </button>

                    <button
                      onClick={()=>{
                        setSelectedUserId(user.id)

                        setModalAction(
                          user.status==="DELETED"
                          ? "RESTORE"
                          : "DELETE"
                        )

                        setIsModalOpen(true)
                      }}
                      className="text-orange-500 font-semibold"
                    >
                      {user.status==="DELETED"
                        ? "Restore"
                        : "Delete"}
                    </button>

                    <button
                      onClick={() =>
                        navigate(
                          ROUTES.ADMIN.USER_DETAILS.replace(
                            ":id",
                            user.id
                          )
                        )
                      }
                      className="text-blue-500 font-semibold"
                    >
                      View
                    </button>

                  </div>
                </td>

              </tr>

            ))

          )}

        </tbody>

      </table>

      {/* pagination */}

      <div className="flex justify-center gap-3 p-5 bg-gray-100">

        <button
          disabled={currentPage===1}
          onClick={()=>setCurrentPage(p=>p-1)}
          className="px-4 py-2 rounded-xl bg-white"
        >
          Prev
        </button>

        {[...Array(
          pagination.totalPages
        )].map((_,i)=>(

          <button
            key={i}
            onClick={() =>
              setCurrentPage(i+1)
            }
            className={`w-10 h-10 rounded-full ${
              currentPage===i+1
              ? "bg-blue-700 text-white"
              : "bg-white"
            }`}
          >
            {i+1}
          </button>

        ))}

        <button
          disabled={
            currentPage===
            pagination.totalPages
          }
          onClick={() =>
            setCurrentPage(p=>p+1)
          }
          className="px-4 py-2 rounded-xl bg-white"
        >
          Next
        </button>

      </div>

    </div>

  </AdminDashboardLayout>

  <ConfirmationModal
    isOpen={isModalOpen}
    title="Confirm Action"
    message={`Are you sure you want to ${modalAction?.toLowerCase()} this user?`}
    onConfirm={handleConfirm}
    onCancel={() => setIsModalOpen(false)}
    confirmText="Yes"
    cancelText="No"
  />
</>
);
 
};

export default Users;