import { useNavigate } from "react-router-dom";
import Pagenav from "../components/Pagenav";
import { useAuth } from "../contexts/FakeAuthContext";
import styles from "./Login.module.css";
import { useEffect, useState } from "react";
import Button from "../components/Button";

export default function Login() {
  // PRE-FILL FOR DEV PURPOSES
  const [email, setEmail] = useState("jack@example.com");
  const [password, setPassword] = useState("qwerty");

  const navigate = useNavigate();
  const { login, isAuthinticated } = useAuth();

  useEffect(() => {
    if (isAuthinticated === true) navigate("/app", { replace: true });
  }, [isAuthinticated, navigate]);

  function handleLogin(e) {
    e.preventDefault();
    if (email && password) login(email, password);
  }
  return (
    <main className={styles.login}>
      <Pagenav />
      <form className={styles.form} onSubmit={handleLogin}>
        <div className={styles.row}>
          <label htmlFor="email">Email address</label>
          <input
            type="email"
            id="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
        </div>

        <div className={styles.row}>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
        </div>

        <div>
          <Button type="login">Login</Button>
        </div>
      </form>
    </main>
  );
}
