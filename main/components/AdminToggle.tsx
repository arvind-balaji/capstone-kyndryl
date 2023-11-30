// Your React component
import { useState, useEffect } from 'react';

const AdminToggle = ({ isAdmin }) => {

  useEffect(() => {
    // Fetch the initial admin status when the component mounts
    fetch('/api/admin')
      .then((response) => response.json())
      .then((data) => setIsAdmin(data.isAdmin))
      .catch((error) => console.error('Error fetching admin status:', error));
  }, []);

  const handleToggle = () => {
    // Toggle the admin status and update it on the server
    const newAdminStatus = !isAdmin;
    fetch('/api/admin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ isAdmin: newAdminStatus }),
    })
      .then((response) => response.json())
      .then((data) => setIsAdmin(data.isAdmin))
      .catch((error) => console.error('Error updating admin status:', error));
  };

  return (
    <div>
      <p>Admin Status: {isAdmin ? 'Enabled' : 'Disabled'}</p>
      <label className="switch">
        <input type="checkbox" checked={isAdmin} onChange={handleToggle} />
        <span className="slider round"></span>
      </label>
    </div>
  );
};

export default AdminToggle;
