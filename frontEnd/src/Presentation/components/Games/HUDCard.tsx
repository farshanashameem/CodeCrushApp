interface Props {
  label: string;
  value: string | number;
}

const HUDCard = ({ label, value }: Props) => {
  return (
    <div
      className="
      bg-blue-500
      text-white
      rounded-full
      px-8
      py-4
      shadow-xl
      font-mochiy
    "
    >
      {label}: {value}
    </div>
  );
};

export default HUDCard;