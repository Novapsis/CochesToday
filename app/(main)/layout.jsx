import React from "react";
import AuthProvider from "@/components/auth/AuthProvider";

const MainLayout = ({ children }) => {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-background">
        {children}
      </div>
    </AuthProvider>
  );
};

export default MainLayout;
