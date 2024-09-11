import { Spinner } from "@nextui-org/react";

const Loader = () => {
  return (
    <div className="flex h-screen items-center justify-center bg-white dark:bg-black">

      <Spinner size="lg" />
    </div>
  );
};

export default Loader;
