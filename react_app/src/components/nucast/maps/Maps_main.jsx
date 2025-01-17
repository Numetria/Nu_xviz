import React, { useState, useEffect } from "react";
import styles from "./maps.module.css";
import { FaTemperatureLow, FaWater } from "react-icons/fa";
import { MdOutlineVisibility, MdOutlineWaterDrop } from "react-icons/md";
import { IoMdSunny } from "react-icons/io";
import { IoMoonOutline } from "react-icons/io5";
import { useAppContext } from "../../../context/AppContext";





function Maps() {
  const { latitude, longitude } = useAppContext();

  return (
    <section className={styles.highlights} aria-label="map_title">
      <h2 className={styles.map_title} id="map_title">
        Synoptic Conditions (windy.com)
      </h2>
      <iframe 
        className={styles.mapIframe}
          width="800"
          height="450"
          src={`https://embed.windy.com/embed.html?type=map&location=coordinates&metricRain=mm&metricTemp=°C&metricWind=m/s&zoom=5&overlay=wind&product=ecmwf&level=surface&lat=${latitude}&lon=${longitude}&pressure=true&message=true`}
          style={{
    border: 'none',
  }}
></iframe>
    </section>
  );
}

export default Maps;
