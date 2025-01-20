import React, { useState, useEffect } from "react"; // Import React and necessary hooks
import styles from "./Now.module.css"; // Import CSS module for styling
import { useAppContext } from "../../../context/AppContext"; // Import context for accessing app-wide state
import FileUpload  from "../../fileIO/upload";



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
        <h2 className={styles.title}>Upload File path</h2>
        <div className={styles.wrapper}>
          <span className={styles}>
            <FileUpload/>
          </span>
        </div>
      </div>
    </section>
  );
}

export default Now; // Export the Now component
