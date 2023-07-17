import { createContext, useContext, useReducer } from "react";
import { useEffect } from "react";

const base_Url = "http://localhost:9000";

const CitiesContext = createContext();

const initialState = {
  isLoading: false,
  cities: [],
  currentCity: {},
  error: "",
};

const reducer = function (state, action) {
  switch (action.type) {
    case "loading":
      return { ...state, isLoading: true };
    case "cities/loaded":
      return { ...state, isLoading: false, cities: action.payload };
    case "city/loaded":
      return { ...state, currentCity: action.payload, isLoading: false };
    case "city/added":
      return {
        ...state,
        currentCity: action.payload,
        isLoading: false,
        cities: [...state.cities, action.payload],
      };
    case "city/deleted":
      return {
        ...state,
        isLoading: false,
        currentCity: {},
        cities: state.cities.filter((city) => city.id !== action.payload),
      };
    default:
      return { ...state, error: action.payload };
  }
};
function CitiesProvider({ children }) {
  const [{ cities, isLoading, currentCity }, dispatch] = useReducer(
    reducer,
    initialState
  );

  // const [cities, setCities] = useState([]);
  // const [isLoading, setIsloading] = useState(false);
  // const [currentCity, setCurrentCity] = useState({});

  useEffect(() => {
    async function fetchCities() {
      try {
        dispatch({ type: "loading" });
        const res = await fetch(`${base_Url}/cities`);
        const data = await res.json();
        dispatch({ type: "cities/loaded", payload: data });
      } catch (err) {
        dispatch({ type: "error", payload: "Error fetching cities" + err });
      }
    }
    fetchCities();
  }, []);

  async function getCurrentCity(id) {
    //an excellent trick for maximum performance to avoid refetching the api wihout any need
    if (currentCity.id === Number(id)) return;
    try {
      dispatch({ type: "loading" });
      const res = await fetch(`${base_Url}/cities/${id}`);
      const data = await res.json();
      dispatch({ type: "city/loaded", payload: data });
    } catch (err) {
      dispatch({ type: "error", payload: "Error fetching current city" + err });
    }
  }
  async function addCity(newCity) {
    try {
      dispatch({ type: "loading" });
      const res = await fetch(`${base_Url}/cities`, {
        method: "POST",
        body: JSON.stringify(newCity),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      dispatch({ type: "city/added", payload: data });
    } catch (err) {
      dispatch({ type: "error", payload: "Error adding new city" + err });
    }
  }

  async function deleteCity(id) {
    try {
      dispatch({ type: "loading" });

      await fetch(`${base_Url}/cities/${id}`, {
        method: "DELETE",
      });

      dispatch({ type: "city/deleted", payload: id });
    } catch (err) {
      dispatch({ type: "error", payload: "Error deleting city" + err });
    }
  }

  return (
    <CitiesContext.Provider
      value={{
        cities,
        isLoading,
        getCurrentCity,
        currentCity,
        addCity,
        deleteCity,
      }}
    >
      {children}
    </CitiesContext.Provider>
  );
}
function useCities() {
  const context = useContext(CitiesContext);
  if (context === undefined) throw new Error("Using context oustide its scope");
  return context;
}
export { CitiesProvider, useCities };
