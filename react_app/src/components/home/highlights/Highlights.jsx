import styles from "./Highlights.module.css";
import { useAppContext } from "../../../context/AppContext";
import PlotDisplaySPATIAL from "../../plots/spatial_test";
import PlotDisplay from "../../plots/Plot_ts_test";


function Highlights() {
  return (
    <section className={styles.highlights} aria-label="highlights label">
      <h2 className={styles.tH} id="highlights-label">
        Visualzer
      </h2>
      <div>
        <div className={styles.row}>
          <div className={styles.box}>
            <h3>Xarray read</h3>
            <div>
              <> <PlotDisplay/></>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Highlights;
