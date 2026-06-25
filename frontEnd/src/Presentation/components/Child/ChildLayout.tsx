import BackgroundMusic from "./BackgroundMusic";
import ChildHeader from "./ChildHeader";

interface Child {
  name: string;
  avatar: string;
  age?: number;
}

interface Props {
  children: React.ReactNode;
  background: string;

  child?: Child | null;
  coins?: number;

  logo?: string;
  title?: string;
}

const ChildLayout = ({
  children,
  background,
  child,
  coins,
  logo,
  title,
}: Props) => {
  return (
    <div
      className="min-h-screen bg-cover bg-center"
      style={{
        backgroundImage: `url(${background})`,
      }}
    >
      <ChildHeader child={child} coins={coins} logo={logo} title={title} />

      <BackgroundMusic />

      {children}
    </div>
  );
};

export default ChildLayout;
