import React, { useState } from "react";
import { useAuth } from "../context/useContext";
import api from "../api";
import { toast } from "react-hot-toast";
import { FiUser, FiLock, FiMail, FiAward, FiEdit, FiCheck } from "react-icons/fi";

export default function ProfilePage() {
  const { user, token } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const [passwords, setPasswords] = useState({ old_password: "", new_password: "" });
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({
    prenom: user?.prenom || "",
    nom: user?.nom || ""
  });

  if (!user) return <div className="text-center mt-10">Please login to access your profile.</div>;

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post(
        "/utilisateurs/change-password",
        passwords,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Password updated successfully!");
      setPasswords({ old_password: "", new_password: "" });
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.detail || "Error changing password");
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async () => {
    try {
      await api.patch(
        "/utilisateurs/update-profile",
        editedUser,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Profile updated successfully!");
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.detail || "Error updating profile");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6">
      <div className="flex items-center gap-4 mb-8">
        <div className="relative">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold">
            {user.prenom.charAt(0)}{user.nom.charAt(0)}
          </div>
          <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full w-4 h-4 border-2 border-white"></div>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            {user.prenom} {user.nom}
          </h1>
          <p className="text-gray-600 dark:text-gray-300 flex items-center gap-1">
            <FiAward className="text-blue-500" size={14} />
            <span className="capitalize">{user.role}</span>
          </p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
        <nav className="flex space-x-4">
          <button
            onClick={() => setActiveTab("profile")}
            className={`py-3 px-4 font-medium text-sm rounded-t-lg transition-all ${
              activeTab === "profile"
                ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-500"
                : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            }`}
          >
            Profile Information
          </button>
          <button
            onClick={() => setActiveTab("security")}
            className={`py-3 px-4 font-medium text-sm rounded-t-lg transition-all ${
              activeTab === "security"
                ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-500"
                : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            }`}
          >
            Security
          </button>
          <button
            onClick={() => setActiveTab("activity")}
            className={`py-3 px-4 font-medium text-sm rounded-t-lg transition-all ${
              activeTab === "activity"
                ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-500"
                : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            }`}
          >
            Activity
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
        {/* Profile Tab */}
        {activeTab === "profile" && (
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                Personal Information
              </h2>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                >
                  <FiEdit size={14} /> Edit
                </button>
              ) : (
                <button
                  onClick={handleProfileUpdate}
                  className="flex items-center gap-1 text-sm text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300"
                >
                  <FiCheck size={14} /> Save Changes
                </button>
              )}
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
                  First Name
                </label>
                {!isEditing ? (
                  <div className="text-lg font-medium text-gray-900 dark:text-white">
                    {user.prenom}
                  </div>
                ) : (
                  <input
                    type="text"
                    value={editedUser.prenom}
                    onChange={(e) =>
                      setEditedUser({ ...editedUser, prenom: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                  />
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
                  Last Name
                </label>
                {!isEditing ? (
                  <div className="text-lg font-medium text-gray-900 dark:text-white">
                    {user.nom}
                  </div>
                ) : (
                  <input
                    type="text"
                    value={editedUser.nom}
                    onChange={(e) =>
                      setEditedUser({ ...editedUser, nom: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                  />
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1 flex items-center gap-1">
                  <FiMail size={14} /> Email
                </label>
                <div className="text-lg font-medium text-gray-900 dark:text-white">
                  {user.email}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1 flex items-center gap-1">
                  <FiAward size={14} /> Role
                </label>
                <div className="text-base font-medium px-3 py-1 inline-block rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300">
                  {user.role}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Security Tab */}
        {activeTab === "security" && (
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">
              Change Password
            </h2>
            <form onSubmit={handlePasswordChange} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1 flex items-center gap-1">
                  <FiLock size={14} /> Current Password
                </label>
                <input
                  type="password"
                  value={passwords.old_password}
                  onChange={(e) =>
                    setPasswords({ ...passwords, old_password: e.target.value })
                  }
                  required
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                  placeholder="Enter current password"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1 flex items-center gap-1">
                  <FiLock size={14} /> New Password
                </label>
                <input
                  type="password"
                  value={passwords.new_password}
                  onChange={(e) =>
                    setPasswords({ ...passwords, new_password: e.target.value })
                  }
                  required
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                  placeholder="Enter new password"
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Password must be at least 8 characters long
                </p>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2.5 rounded-lg transition disabled:opacity-50 flex items-center justify-center gap-2 w-full sm:w-auto"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Updating...
                    </>
                  ) : (
                    "Update Password"
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Activity Tab */}
        {activeTab === "activity" && (
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">
              Recent Activity
            </h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/30">
                <div className="mt-1 p-2 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300">
                  <FiUser size={16} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                    You updated your profile information
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    2 days ago
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/30">
                <div className="mt-1 p-2 rounded-full bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-300">
                  <FiLock size={16} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                    You changed your password
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    1 week ago
                  </p>
                </div>
              </div>
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <p>No more activities to show</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}