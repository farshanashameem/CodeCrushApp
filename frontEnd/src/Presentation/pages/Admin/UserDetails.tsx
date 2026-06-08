import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";

import type { AppDispatch, RootState } from "../../../redux/store";
import AdminDashboardLayout from "../../layouts/AdminDashboardLayout";

import {
  getUserDetail,
  toggleUserStatus,
} from "../../../redux/Slices/UserManagementSlice";
import {
  adminGetChildDetail,
  adminToggleChildStatus,
} from "../../../redux/Slices/ChildManagementSlice";

import InfoItem from "../../components/InfoItem";
import ConfirmationModal from "../../components/ConfirmationModal";
import toast from "react-hot-toast";
import type { ChildGame } from "../../../Types/ChildManagement";

const UserDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { selectedUser, loading } = useSelector(
    (state: RootState) => state.user,
  );
  const { selectedChild } = useSelector(
    (state: RootState) => state.childManagement,
  );

  // Local state tracking
  const [activeChildId, setActiveChildId] = useState<string | null>(null);
  const [showChildDetails, setShowChildDetails] = useState(false);
  const [selectedEntityId, setSelectedEntityId] = useState<string>("");

  // Track whether the current action is targeted for a PARENT or a CHILD
  const [entityType, setEntityType] = useState<"PARENT" | "CHILD" | null>(null);
  const [modalAction, setModalAction] = useState<
    "BLOCK" | "UNBLOCK" | "DELETE" | "RESTORE" | null
  >(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getModalMessage = () => {
    if (!entityType || !modalAction) return "";
    const target = entityType === "PARENT" ? "parent" : "child";

    switch (modalAction) {
      case "BLOCK":
        return `Are you sure you want to block this ${target}?`;
      case "UNBLOCK":
        return `Are you sure you want to unblock this ${target}?`;
      case "DELETE":
        return `Are you sure you want to delete this ${target}?`;
      case "RESTORE":
        return `Are you sure you want to restore this ${target}?`;
      default:
        return "";
    }
  };

  useEffect(() => {
    if (id) dispatch(getUserDetail({ id }));
  }, [dispatch, id]);

  // Unified confirmation execution workflow
  const handleModalConfirm = async () => {
    if (!selectedEntityId || !modalAction || !entityType) return;

    try {
      if (entityType === "PARENT") {
        await dispatch(
          toggleUserStatus({
            id: selectedEntityId,
            action: modalAction,
          }),
        ).unwrap();

        toast.success(
          `Parent account successfully updated`,
        );
        if (id) dispatch(getUserDetail({ id }));
      } else if (entityType === "CHILD") {
        await dispatch(
          adminToggleChildStatus({
            id: selectedEntityId,
            action: modalAction,
          }),
        ).unwrap();

        toast.success(`Child profile successfully updated`);

        // If a child is deleted, close the expanded workspace view dynamically
        if (modalAction === "DELETE") {
          setShowChildDetails(false);
          setActiveChildId(null);
        } else {
          dispatch(adminGetChildDetail({ id: selectedEntityId }));
        }

        // Always sync parent profile metrics back up to keep structural arrays aligned
        if (id) dispatch(getUserDetail({ id }));
      }
    } catch (error) {
      toast.error(
        `Failed to execute status action on ${entityType.toLowerCase()}`,
      );
      console.error(error);
    } finally {
      setIsModalOpen(false);
      setSelectedEntityId("");
      setEntityType(null);
      setModalAction(null);
    }
  };

  return (
    <AdminDashboardLayout pageTitle="USER PROFILE RECORDS 👤">
      <div className="space-y-6 w-full text-slate-700">
        {/* ==================== SECTION 1: PARENT INFORMATION ==================== */}
        <div className="bg-white/25 backdrop-blur-md border border-white/30 rounded-3xl p-5 sm:p-6 shadow-2xl">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-white/20 pb-4 mb-5">
            <div>
              <h2 className="text-lg font-black tracking-wide text-slate-800 uppercase">
                Parent Account Information
              </h2>
              <p className="text-xs text-slate-500">
                Primary dashboard registrant variables
              </p>
            </div>

            {!loading && selectedUser && (
              <div className="flex items-center gap-2 self-start sm:self-auto">
                <button
                  onClick={() => {
                    setSelectedEntityId(selectedUser.id);
                    setEntityType("PARENT");
                    setModalAction(
                      selectedUser.status === "BLOCKED" ? "UNBLOCK" : "BLOCK",
                    );
                    setIsModalOpen(true);
                  }}
                  className={`text-xs font-semibold px-3 py-2 rounded-lg transition-colors ${
                    selectedUser.status === "BLOCKED"
                      ? "text-emerald-600 bg-emerald-50 hover:bg-emerald-100"
                      : "text-rose-600 bg-rose-50 hover:bg-rose-100"
                  }`}
                >
                  {selectedUser.status === "BLOCKED" ? "Unblock" : "Block"}
                </button>

                <button
                  onClick={() => {
                    setSelectedEntityId(selectedUser.id);
                    setEntityType("PARENT");
                    setModalAction(
                      selectedUser.status === "DELETED" ? "RESTORE" : "DELETE",
                    );
                    setIsModalOpen(true);
                  }}
                  className={`text-xs font-semibold px-3 py-2 rounded-lg transition-colors ${
                    selectedUser.status === "DELETED"
                      ? "text-blue-600 bg-blue-50 hover:bg-blue-100"
                      : "text-amber-600 bg-amber-50 hover:bg-amber-100"
                  }`}
                >
                  {selectedUser.status === "DELETED" ? "Restore" : "Delete"}
                </button>

                <button
                  onClick={() => navigate(-1)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
                >
                  Back
                </button>
              </div>
            )}
          </div>

          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center gap-2">
              <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-xs font-medium text-slate-400">
                Loading master files...
              </span>
            </div>
          ) : !selectedUser ? (
            <div className="text-center py-6 text-sm text-slate-400 font-medium">
              No parent profile loaded.
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
              <InfoItem label="Name" value={selectedUser.name} />
              <InfoItem label="Email" value={selectedUser.email} />
              <InfoItem
                label="Status"
                value={
                  <span
                    className={`inline-flex items-center px-2 py-0.5 mt-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                      selectedUser.status === "BLOCKED"
                        ? "bg-red-50 text-red-700 border-red-100"
                        : selectedUser.status === "DELETED"
                          ? "bg-amber-50 text-amber-700 border-amber-100"
                          : "bg-emerald-50 text-emerald-700 border-emerald-100"
                    }`}
                  >
                    {selectedUser.status}
                  </span>
                }
              />
              <InfoItem
                label="Registered Children"
                value={`👪 ${selectedUser.childrenIds?.length ?? 0} Child Profile(s)`}
              />
            </div>
          )}
        </div>

        {/* ==================== SECTION 2: CHILDREN TAB SELECTOR ==================== */}
        {selectedUser && selectedUser.childrenIds?.length > 0 && (
          <div className="bg-white/25 backdrop-blur-md border border-white/30 rounded-3xl p-5 sm:p-6 shadow-2xl">
            <div className="mb-4">
              <h2 className="text-sm font-black uppercase tracking-wider text-slate-700">
                Managed Children Modules
              </h2>
              <p className="text-xs text-slate-500">
                Select a subsystem block to dynamically load real-time analytics
              </p>
            </div>

            <div className="flex flex-wrap gap-2.5">
              {selectedUser.childrenIds.map((childId, index) => {
                const isSelected =
                  activeChildId === childId ||
                  (!activeChildId && selectedChild?.id === childId);
                return (
                  <button
                    key={childId}
                    onClick={() => {
                      setActiveChildId(childId);
                      setShowChildDetails(true);
                      dispatch(adminGetChildDetail({ id: childId }));
                    }}
                    className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wide transition-all shadow-xs ${
                      isSelected
                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white scale-102 ring-2 ring-blue-500/10"
                        : "bg-white/80 text-slate-700 hover:bg-white border border-slate-200/80"
                    }`}
                  >
                    🧒 Child #{index + 1}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ==================== SECTION 3: EXPANDED CHILD VIEW ==================== */}
        {selectedChild && showChildDetails && (
          <div className="bg-white/25 backdrop-blur-md border border-white/30 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-6 animate-fadeIn">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-white/20 pb-4">
              <div>
                <h3 className="text-lg font-black tracking-wide text-slate-800 uppercase flex items-center gap-2">
                  <span>🎮</span> Analytics Core: {selectedChild.name}
                </h3>
                <p className="text-xs text-slate-500">
                  Live profiling vectors compiled from client interactions
                </p>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => {
                    setSelectedEntityId(selectedChild.id);
                    setEntityType("CHILD");
                    setModalAction(
                      selectedChild.status === "BLOCKED" ? "UNBLOCK" : "BLOCK",
                    );
                    setIsModalOpen(true);
                  }}
                  className={`text-xs font-semibold px-3 py-2 rounded-lg transition-colors ${
                    selectedChild.status === "BLOCKED"
                      ? "text-emerald-600 bg-emerald-50 hover:bg-emerald-100"
                      : "text-rose-600 bg-rose-50 hover:bg-rose-100"
                  }`}
                >
                  {selectedChild.status === "BLOCKED" ? "Unblock" : "Block"}
                </button>

                <button
                  onClick={() => {
                    setSelectedEntityId(selectedChild.id);
                    setEntityType("CHILD");
                    setModalAction(
                      selectedChild.status === "DELETED" ? "RESTORE" : "DELETE",
                    );
                    setIsModalOpen(true);
                  }}
                  className={`text-xs font-semibold px-3 py-2 rounded-lg transition-colors ${
                    selectedChild.status === "DELETED"
                      ? "text-blue-600 bg-blue-50 hover:bg-blue-100"
                      : "text-amber-600 bg-amber-50 hover:bg-amber-100"
                  }`}
                >
                  {selectedChild.status === "DELETED" ? "Restore" : "Delete"}
                </button>

                <button
                  onClick={() => {
                    setShowChildDetails(false);
                    setActiveChildId(null);
                  }}
                  className="px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                >
                  Hide Details
                </button>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
              <InfoItem label="Profile Name" value={selectedChild.name} />
              <InfoItem
                label="Age Matrix"
                value={`${selectedChild.age} Years Old`}
              />
              <InfoItem
                label="Status Badge"
                value={
                  <span
                    className={`inline-flex items-center px-2 py-0.5 mt-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                      selectedChild.status === "BLOCKED"
                        ? "bg-red-50 text-red-700 border border-red-100"
                        : selectedChild.status === "DELETED"
                          ? "bg-amber-50 text-amber-700 border-amber-100"
                          : "bg-emerald-50 text-emerald-700 border border-emerald-100"
                    }`}
                  >
                    {selectedChild.status}
                  </span>
                }
              />
              <InfoItem
                label="Date of Birth"
                value={
                  selectedChild.dob
                    ? new Date(selectedChild.dob).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })
                    : "N/A"
                }
              />
              <InfoItem
                label="Cumulative Playtime"
                value={`${selectedChild.totalPlayTime || 0} Mins`}
              />
              <InfoItem
                label="Total Task Launches"
                value={`${selectedChild.totalGamesPlayed || 0} Iterations`}
              />
            </div>

            {/* Nested Individual Games Performance Board */}
            <div className="pt-2">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 mb-3">
                Engine Metrics Array (Games History)
              </h4>

              {selectedChild.games && selectedChild.games.length > 0 ? (
                <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-xs">
                          <th className="py-3.5 px-5">Target Engine</th>
                          <th className="py-3.5 px-5 text-center">
                            Tier Level
                          </th>
                          <th className="py-3.5 px-5 text-center">
                            High Score
                          </th>
                          <th className="py-3.5 px-5 text-center">
                            Session Duration
                          </th>
                        </tr>
                      </thead>

                      <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                        {selectedChild.games.map((game: ChildGame) => (
                          <tr
                            key={game.gameId}
                            className="hover:bg-slate-50/50 transition-colors"
                          >
                            <td className="py-3.5 px-5 font-semibold text-slate-900">
                              🎮 {game.gameName}
                            </td>
                            <td className="py-3.5 px-5 text-center font-mono text-xs text-violet-600 font-bold">
                              Lvl {game.currentLevel}
                            </td>
                            <td className="py-3.5 px-5 text-center font-mono text-xs text-emerald-600 font-bold">
                              {game.totalScore} pts
                            </td>
                            <td className="py-3.5 px-5 text-center text-xs text-slate-500">
                              {game.playTime} mins
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="bg-white/50 border border-dashed border-slate-200 rounded-2xl text-center py-8 text-xs text-slate-400 font-medium">
                  No active gameplay metric rows generated on this workspace
                  node yet.
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <ConfirmationModal
        isOpen={isModalOpen}
        title={`${modalAction} ACTION`}
        message={getModalMessage()}
        cancelText="Cancel"
        confirmText={modalAction ? modalAction : "Confirm"}
        onConfirm={handleModalConfirm}
        onCancel={() => {
          setIsModalOpen(false);
          setEntityType(null);
          setModalAction(null);
          setSelectedEntityId("");
        }}
      />
    </AdminDashboardLayout>
  );
};

export default UserDetails;
