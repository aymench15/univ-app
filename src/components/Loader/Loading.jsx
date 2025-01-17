import { HashLoader } from "react-spinners";
import loader from "../../assets/images/loader.gif";

const Loading = () => {
  return (
    <div className="flex items-center justify-center w-full h-full">
      <img
        src={loader}
        alt="loader"
      />
    </div>
  );
};

export default Loading;
