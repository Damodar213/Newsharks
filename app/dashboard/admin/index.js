"use client";

// This is a helper file to set admin role in localStorage for testing
export default function AdminHelper() {
  const setAdminRole = () => {
    try {
      // Get current user data
      const userData = localStorage.getItem('userData');
      if (userData) {
        const parsedData = JSON.parse(userData);
        
        // Ensure it has admin role
        parsedData.role = 'admin';
        
        // Save it back to localStorage
        localStorage.setItem('userData', JSON.stringify(parsedData));
        alert('Admin role set successfully! You can now access admin features.');
      } else {
        alert('No user data found. Please log in first.');
      }
    } catch (error) {
      console.error('Error setting admin role:', error);
      alert('Error setting admin role. See console for details.');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Admin Role Helper</h1>
      <p className="mb-4">Use this button to set your account to admin role for testing:</p>
      <button 
        onClick={setAdminRole}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Set Admin Role
      </button>
    </div>
  );
} 