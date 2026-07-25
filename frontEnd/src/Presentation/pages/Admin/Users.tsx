import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import AdminDashboardLayout from "../../layouts/AdminDashboardLayout";
import ConfirmationModal from "../../SharedComponents/ConfirmationModal";

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
      <AdminDashboardLayout pageTitle="USERS MANAGEMENT 🎮">
        
        {/* INNER DIVISION DEFINED SPECIFICALLY BY THE USERS PAGE */}
        <div className="bg-white/25 backdrop-blur-md border border-white/30 rounded-3xl w-full p-5 sm:p-8 shadow-2xl flex-1 flex flex-col">
          
          {/* Search Row Container */}
          <div className="mb-6 relative max-w-md">
            <input
              type="text"
              placeholder="Search users by name..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-white rounded-xl px-5 py-3.5 shadow-sm border border-slate-200/80 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm text-slate-700 placeholder:text-slate-400"
            />
          </div>

          {/* Table Data Board Display */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden flex-1 flex flex-col justify-between">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-xs">
                    <th className="py-4 px-6">User</th>
                    <th className="py-4 px-6 text-center">Children</th>
                    <th className="py-4 px-6 text-center">Type</th>
                    <th className="py-4 px-6 text-center">Status</th>
                    <th className="py-4 px-6 text-center">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {loading ? (
                    <tr>
                      <td colSpan={4} className="text-center py-12 text-slate-400 font-medium">
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                          <span>Loading users...</span>
                        </div>
                      </td>
                    </tr>
                  ) : users.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="text-center py-12 text-slate-400 font-medium">
                        No Users Found
                      </td>
                    </tr>
                  ) : (
                    users.map((user) => (
                      <tr key={user.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-4 px-6 font-medium text-slate-900">
                          {user.name}
                        </td>

                        <td className="py-4 px-6 text-center font-mono text-slate-600">
                          {user.childrenIds?.length || 0}
                        </td>
                        <td className="py-4 px-6 text-center font-mono text-slate-600">
                          {user.isPremium? "Premium":" Free"}
                        </td>

                        <td className="py-4 px-6 text-center">
                          <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${
                              user.status === "BLOCKED"
                                ? "bg-red-50 text-red-700 border border-red-200"
                                : user.status === "DELETED"
                                ? "bg-amber-50 text-amber-700 border border-amber-200"
                                : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            }`}
                          >
                            {user.status}
                          </span>
                        </td>

                        <td className="py-4 px-6 text-center">
                          <div className="flex justify-center items-center gap-4">
                            <button
                              onClick={() => {
                                setSelectedUserId(user.id);
                                setModalAction(user.status === "BLOCKED" ? "UNBLOCK" : "BLOCK");
                                setIsModalOpen(true);
                              }}
                              className={`text-xs font-semibold px-2 py-1 rounded transition-colors ${
                                user.status === "BLOCKED"
                                  ? "text-emerald-600 hover:bg-emerald-50"
                                  : "text-rose-600 hover:bg-rose-50"
                              }`}
                            >
                              {user.status === "BLOCKED" ? "Unblock" : "Block"}
                            </button>

                            <button
                              onClick={() => {
                                setSelectedUserId(user.id);
                                setModalAction(user.status === "DELETED" ? "RESTORE" : "DELETE");
                                setIsModalOpen(true);
                              }}
                              className={`text-xs font-semibold px-2 py-1 rounded transition-colors ${
                                user.status === "DELETED"
                                  ? "text-blue-600 hover:bg-blue-50"
                                  : "text-amber-600 hover:bg-amber-50"
                              }`}
                            >
                              {user.status === "DELETED" ? "Restore" : "Delete"}
                            </button>

                            <button
                              onClick={() =>
                                navigate(ROUTES.ADMIN.USER_DETAILS.replace(":id", user.id))
                              }
                              className="text-xs font-semibold text-slate-600 px-2 py-1 rounded hover:bg-slate-100 transition-colors border border-slate-200"
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
            </div>

            {/* Pagination Panel Section */}
            <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50/50 px-6 py-4 mt-auto">
              <div className="text-xs text-slate-500 font-medium">
                Page {currentPage} of {pagination.totalPages || 1}
              </div>

              <div className="flex items-center gap-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:hover:bg-white disabled:cursor-not-allowed transition-all shadow-sm"
                >
                  Prev
                </button>

                <div className="flex items-center gap-1">
                  {[...Array(pagination.totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`w-8 h-8 rounded-lg text-xs font-semibold transition-all ${
                        currentPage === i + 1
                          ? "bg-blue-600 text-white shadow-sm shadow-blue-500/20"
                          : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>

                <button
                  disabled={currentPage === pagination.totalPages}
                  onClick={() => setCurrentPage((p) => p + 1)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:hover:bg-white disabled:cursor-not-allowed transition-all shadow-sm"
                >
                  Next
                </button>
              </div>
            </div>
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