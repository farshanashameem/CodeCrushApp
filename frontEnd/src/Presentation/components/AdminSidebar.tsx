// AdminSidebar.tsx
import { Link } from "react-router-dom";

const AdminSidebar = () => {
  return (
    <aside className="w-64 bg-white/20 backdrop-blur-md">
      <nav className="flex flex-col p-4 gap-2">
        <Link to="/admin/dashboard">Dashboard</Link>
        <Link to="/admin/users">Users</Link>
        <Link to="/admin/reports">Reports</Link>
        <Link to="/admin/security">Security</Link>
      </nav>
    </aside>
  );
};

export default AdminSidebar;