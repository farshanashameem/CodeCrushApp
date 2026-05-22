import BG from "../../assets/authBG.png";
import logo from "../../assets/parentPortal.png";

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
   <div className="relative min-h-screen w-full overflow-hidden">

  {/* Background */}
  <img
    src={BG}
    alt="background"
    className="absolute inset-0 w-full h-full object-cover"
  />

  {/* Logo at top */}
  <div className="relative z-20 flex justify-center pt-4 sm:pt-6">
    <img
      src={logo}
      alt="logo"
     className="w-[25vw] min-w-[90px] max-w-[160px] h-auto"
    />
  </div>

  {/* Centered form */}
  <div className="relative z-20 flex items-center justify-center min-h-[80vh] px-4">
    {children}
  </div>
</div>
  );
};

export default AuthLayout;