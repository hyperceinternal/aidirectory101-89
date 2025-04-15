
import React from 'react';
import { Button } from "@/components/ui/button";

interface AdminNavbarProps {
  onLogout: () => void;
}

const AdminNavbar = ({ onLogout }: AdminNavbarProps) => {
  return (
    <div className="flex justify-between items-center mb-6 mt-8 md:mt-0">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      <Button 
        onClick={onLogout}
        variant="outline"
      >
        Logout
      </Button>
    </div>
  );
};

export default AdminNavbar;
