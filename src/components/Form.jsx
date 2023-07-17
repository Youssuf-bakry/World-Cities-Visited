// "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=0&longitude=0"
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "./Button";
import Spinner from "./Spinner";
import styles from "./Form.module.css";
import BackButton from "./BackButton";
import { useUrlParams } from "../hooks/useUrlParams";
import Message from "./Message";
import { useCities } from "../contexts/CitiesContext";

export function convertToEmoji(countryCode) {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}

const Base_Url = "https://api.bigdatacloud.net/data/reverse-geocode-client";

function Form() {
  const navigate = useNavigate();
  const [lat, lng] = useUrlParams();
  const { addCity, isLoading } = useCities();

  const [geoIsLoading, setGeoIsLoading] = useState(false);
  const [cityName, setCityName] = useState("");
  const [country, setCountry] = useState("");
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState("");
  const [geoCodingerror, setGeoCodingError] = useState(undefined);
  const [emoji, setEmoji] = useState("");

  useEffect(() => {
    if (!lat && !lng) return;

    async function fetchCityData() {
      try {
        setGeoIsLoading(true);
        setGeoCodingError(undefined);
        const res = await fetch(`${Base_Url}?latitude=${lat}&longitude=${lng}`);
        const data = await res.json();
        if (!data.countryCode) throw new Error("Choose a Valid City Please 🙂");
        setCityName(data.city || data.locality || "");
        setCountry(data.countryName || data.countryCode || "");
        setEmoji(convertToEmoji(data.countryCode));
      } catch (error) {
        setGeoCodingError(error.message);
      } finally {
        setGeoIsLoading(false);
      }
    }
    fetchCityData();
  }, [lat, lng]);

  async function handleSubmit(e) {
    e.preventDefault();
    const newCity = {
      cityName,
      country,
      date,
      notes,
      emoji,
      position: {
        lat,
        lng,
      },
    };
    await addCity(newCity);
    navigate("/app/cities");
  }
  if (geoIsLoading) return <Spinner />;

  if (!lat && !lng) return <Message message="start by clicking on the map" />;

  if (geoCodingerror) return <Message message={geoCodingerror} />;
  return (
    <form
      className={`${styles.form} ${isLoading ? styles.loading : ""}`}
      onSubmit={handleSubmit}
    >
      <div className={styles.row}>
        <label htmlFor="cityName">City name</label>
        <input
          id="cityName"
          onChange={(e) => setCityName(e.target.value)}
          value={cityName}
        />
        {/* <span className={styles.flag}>{flagemojiToPNG(emoji)}</span> */}
      </div>

      <div className={styles.row}>
        <label htmlFor="date">When did you go to {cityName}?</label>

        <DatePicker
          id="date"
          selected={date}
          onChange={(date) => setDate(date)}
          format="dd/MM/yyyy"
        />
      </div>

      <div className={styles.row}>
        <label htmlFor="notes">
          Notes about your trip to {cityName}/{country}
        </label>
        <textarea
          id="notes"
          onChange={(e) => setNotes(e.target.value)}
          value={notes}
        />
      </div>

      <div className={styles.buttons}>
        <Button type="primary">Add</Button>
        <BackButton />
      </div>
    </form>
  );
}

export default Form;
