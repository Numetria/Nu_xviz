import { Suspense, lazy } from "react";
import loadingSvg from "../../../assets/loading-spinner.svg";
const Header = lazy(() => import("../header/Header_nu"));
const Maps = lazy(() => import("../maps/Maps_main"));
const Highlights = lazy(() => import("../highlights/Highlights"));
import styles from "./Nucast.module.css";
const Forecast = lazy(() => import("../Forecast/Forecast_5day"));

const Now = lazy(() => import("../../home/now/Now"));

function Loading() {
  return <img src={loadingSvg} alt="Loading..." />;
}

function Nucast() { // Rename to match file name
  return (
    <div>
      <Suspense fallback={<Loading />}>
        <Header />
      </Suspense>
      <main className={`${styles.main} container`}>
        <section className={styles.leftConent}>
          <Suspense fallback={<Loading />}>
            <Now />
          </Suspense>
        </section>
        <section className={styles.rightContent}>
          <Suspense fallback={<Loading />}>

            <Highlights />
            <Maps/>
            <Forecast />

          </Suspense>
        </section>
      </main>
    </div>
  );
}

export default Nucast;