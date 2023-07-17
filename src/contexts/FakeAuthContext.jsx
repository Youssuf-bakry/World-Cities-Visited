import { createContext, useContext, useReducer } from "react";

const initialState = {
  isAuthinticated: false,
  user: {},
};

const reducer = function (state, action) {
  switch (action.type) {
    case "isLogginIn":
      return { ...state, isAuthinticated: true, user: action.payload };
    case "isLoggingOut":
      return initialState;
    default:
      throw new Error("Unknown action");
  }
};
const authContext = createContext();

const FAKE_USER = {
  name: "Jack",
  email: "jack@example.com",
  password: "qwerty",
  avatar: "https://i.pravatar.cc/100?u=zz",
};
function AuthProvider({ children }) {
  const [{ user, isAuthinticated }, dispatch] = useReducer(
    reducer,
    initialState
  );
  function login(email, password) {
    if (email === FAKE_USER.email && password === FAKE_USER.password)
      dispatch({ type: "isLogginIn", payload: FAKE_USER });
  }

  function logout() {
    dispatch({ type: "isLoggingOut" });
  }
  return (
    <authContext.Provider value={{ user, isAuthinticated, login, logout }}>
      {children}
    </authContext.Provider>
  );
}

function useAuth() {
  const context = useContext(authContext);
  if (!context) throw new Error("Context used outside its scope");
  return context;
}

export { AuthProvider, useAuth };
