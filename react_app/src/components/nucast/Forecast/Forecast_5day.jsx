import { useAppContext } from "../../../context/AppContext";
import styles from "./Forecast.module.css";
import windSpeed from "../../../assets/windSpeed.png";

function Forecast() {
  const { forecastData } = useAppContext();
  let fiveDaysForecast = [];
  let todayAtArr = [];

  for (let i = 7; i < forecastData?.list.length; i += 8) {
    const forecastItem = forecastData?.list[i];
    const date = new Date(forecastItem?.dt * 1000);
    const options = { day: "numeric", month: "long" };
    const formattedDate = date.toLocaleDateString("en-US", options);
    const dayName = new Intl.DateTimeFormat("en-US", {
      weekday: "long",
    }).format(date);

    fiveDaysForecast.push({
      formattedDate: formattedDate,
      dayName: dayName,
      forecastItem: forecastItem,
    });
  }

  for (let i = 0; i < 8; i++) {
    const forecastItem = forecastData?.list[i];
    const date = new Date(forecastItem?.dt * 1000);
    const options = { hour: "2-digit", minute: "2-digit", hour12: true };
    const formattedTime = date.toLocaleTimeString([], options);

    todayAtArr.push({
      formattedTime: formattedTime,
      forecastItem: forecastItem,
    });
  }

  return (
    <section
      className={styles.hourlyForecast}
      aria-label="hourly forecast"
      data-hourly-forecast
    >
      <h2>5-Day Forecast</h2>
      <div className={styles.sliderContainer}>
        <ul className={styles.sliderList} data-temp>
          {fiveDaysForecast.map((item, index) => (
            <li className={styles.sliderItem} key={index}>
              <p>{item.dayName}</p>
              <p>{item.formattedDate}</p>
              <img
                src={`https://openweathermap.org/img/wn/${item.forecastItem?.weather[0].icon}@2x.png`}
                alt='img'
                title={item.forecastItem?.weather[0].description}
                className='weather-icon'
                loading="lazy"
              />
              <span>{parseInt(item.forecastItem?.main.temp_max)}°C</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default Forecast;