interface AuthCardProps {
  children: React.ReactNode;
}

const AuthCard = ({ children }: AuthCardProps) => {
  return (
    <div className="w-[90%] sm:w-[420px] md:w-[450px] bg-white/70 backdrop-blur-xl border border-white/40 rounded-[35px] shadow-2xl px-8 py-8 text-center">
      {children}
    </div>
  );
};

export default AuthCard;