import React, { useState, useEffect } from "react"; // Import React and necessary hooks
import styles from "./Now.module.css"; // Import CSS module for styling
import { useAppContext } from "../../../context/AppContext"; // Import context for accessing app-wide state
import { MdDateRange } from "react-icons/md"; // Import date range icon from react-icons
import { FaLocationDot } from "react-icons/fa6"; // Import location icon from react-icons

function Now() {
  const { currentWeatherData } = useAppContext(); // Access current weather data from context
  const [currentTime, setCurrentTime] = useState(new Date()); // State to hold the current time

  // useEffect to update the current time every second
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date()); // Update current time
    }, 1000);

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, []);

  // Function to get the current time adjusted for the timezone
  const getCurrentTimeWithTimezone = () => {
    if (!currentWeatherData) return currentTime;

    const localTime = new Date();
    const timezoneOffset = currentWeatherData.timezone; // Timezone offset in seconds
    const localOffset = localTime.getTimezoneOffset() * 60; // Local offset in seconds
    const adjustedTime = new Date(
      localTime.getTime() + (timezoneOffset + localOffset) * 1000,
    );

    return adjustedTime;
  };

  const adjustedTime = getCurrentTimeWithTimezone();

  return (
    <section className={styles.currentWeather} aria-label="current weather">
      <div className={styles.card}>
        <h2 className={styles.title}>Now</h2>
        <div className={styles.wrapper}>
          <span className={styles}>
            {Math.round(currentWeatherData?.main?.temp) || ""}°c{" "}
            {/* Display current temperature */}
          </span>
          <img
            src={`https://openweathermap.org/img/wn/${currentWeatherData?.weather[0].icon}@2x.png`}
            alt="Weather icon"
            className={styles.weatherIcon}
            loading="lazy"
          />
        </div>
        <p className={styles.wState}>
          {currentWeatherData?.weather[0].description}{" "}
          {/* Display weather description */}
        </p>
        <ul className={styles.metaList}>
          <li className={styles.metaItem}>
            <MdDateRange /> {/* Date range icon */}
            <div className={styles.clockContainer}>
              <p className={styles.metaText}>
                {adjustedTime.toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}{" "}
                {/* Display current time */}
              </p>
              <p className={styles.metaText}>
                {adjustedTime.toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })}{" "}
                {/* Display current date */}
              </p>
            </div>
          </li>
          <li className={styles.metaItem}>
            <FaLocationDot /> {/* Location icon */}
            <p className={styles.metaText}>{`${
              currentWeatherData?.name || ""
            }`}</p>{" "}
            {/* Display location name */}
          </li>
        </ul>
      </div>
    </section>
  );
}

export default Now; // Export the Now component
