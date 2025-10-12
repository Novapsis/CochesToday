const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex justify-center items-start pt-28 pb-32 md:pt-40 md:pb-40">
      {children}
    </div>
  );
};

export default AuthLayout;
