import { useState } from "react";
import styles from "./Forecast.module.css";
import coordlist from "../../fileIO/Coordsolver";

function Forecast() {
  const [selectedValue, setSelectedValue] = useState("");

  const randomStrings = ["Temperature", "Precipitation", "Humidity", "Wind Speed"];
  const handleChange = (event) => {
    setSelectedValue(event.target.value);
  };

  return (
    <section className={styles.forecast} aria-label="forecast label">
      <h2>Select an Variable:</h2>
      <div className={styles.cardWrapper}>
        <select value={selectedValue} onChange={handleChange} className={styles.dropdown}>
          {randomStrings.map((str, index) => (
            <option key={index} value={str}>
              {str}
            </option>
          ))}
        </select>
        {selectedValue && <p>You selected: {selectedValue}</p>}
      </div>
    </section>
  );
}

export default Forecast;