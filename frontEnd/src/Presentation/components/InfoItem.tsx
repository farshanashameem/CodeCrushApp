import React from "react";

interface InfoItemProps {
  label: string;
  value: React.ReactNode;
}

const InfoItem = ({ label, value }: InfoItemProps) => {
  return (
    <div className="bg-white/40 border border-white/50 px-4 py-3 rounded-xl shadow-sm backdrop-blur-xs">
     
      <p className="text-[10px] font-sans font-bold uppercase tracking-wider text-slate-400 mb-0.5">
        {label}
      </p>
      <div className="text-sm font-semibold text-slate-800">
        {value ?? "N/A"}
      </div>
    </div>
  );
};

export default InfoItem;