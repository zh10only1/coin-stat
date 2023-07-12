import { TailSpin } from "react-loader-spinner";
import styles from "./Loader.module.css";

function Loader({ text }) {
  return (
    <div className={styles.loaderWrapper}>
      <h2>Loading {text}</h2>
      <TailSpin height={80} width={80} radius={1} color={"white"} wrapperStyle={{background: 'transparent'}} />

    </div>
  );
}

export default Loader;
