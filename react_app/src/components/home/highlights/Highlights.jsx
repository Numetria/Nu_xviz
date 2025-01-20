import React, { useState, useEffect } from "react";
import styles from "./Highlights.module.css";
import { FaTemperatureLow, FaWater } from "react-icons/fa";
import { MdOutlineVisibility, MdOutlineWaterDrop } from "react-icons/md";
import { IoMdSunny } from "react-icons/io";
import { IoMoonOutline } from "react-icons/io5";
import { useAppContext } from "../../../context/AppContext";
import axios from 'axios';
import LoadDataButton from "../../buttons/Button1"
import PlotDisplay from "../../plots/Plot_ts_test";


function Highlights() {
  const { currentWeatherData } = useAppContext();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date()); // Update current time
    }, 1000);

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, []);

  function formatTime(timeUnix, timezone) {
    const date = new Date((timeUnix + timezone) * 1000);
    const hours = date.getUTCHours();
    const minutes = date.getUTCMinutes();
    const amPm = hours >= 12 ? "PM" : "AM";
    return `${hours % 12 || 12}:${minutes} ${amPm}`;
  }

  // Calculate if the current time is less than 30 minutes before sunset
  const sunsetTime = new Date(
    (currentWeatherData?.sys.sunset + currentWeatherData?.timezone) * 1000,
  );
  const timeDifference = Math.abs((sunsetTime - currentTime) / (1000 * 60)); // Difference in minutes
  const isGoldenTime = timeDifference <= 30;

  return (
    <section className={styles.highlights} aria-label="highlights label">
      <h2 className={styles.tH} id="highlights-label">
        Today Highligshts
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
