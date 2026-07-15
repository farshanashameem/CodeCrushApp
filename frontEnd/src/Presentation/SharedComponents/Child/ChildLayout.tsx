
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
  isPremium?: boolean;
}

const ChildLayout = ({
  children,
  background,
  child,
  logo,
  title,
  isPremium,
}: Props) => {
  return (
    <div
      className="min-h-screen bg-cover bg-center"
      style={{
        backgroundImage: `url(${background})`,
      }}
    >
      <ChildHeader child={child}  logo={logo} title={title}   isPremium={isPremium}/>

    

      {children}
    </div>
  );
};

export default ChildLayout;
