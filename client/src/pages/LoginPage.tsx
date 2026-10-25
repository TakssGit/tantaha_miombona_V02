import {
  useState
} from "react";

import {
  Link,
  useNavigate
} from "react-router-dom";

import {
  useAuth
} from "../hooks/useAuth";

import {
  authService
} from "../services/auth.service";

import "../styles/security-account.css";

const LoginPage = () => {
  const navigate =
    useNavigate();

  const {
    login
  } = useAuth();

  const [username,
    setUsername] =
      useState("");

  const [password,
    setPassword] =
      useState("");

  const [error, setError] =
    useState("");

  const [loading,
    setLoading] =
      useState(false);

  const submit =
    async (
      event:
        React.FormEvent
    ) => {
      event.preventDefault();
      setError("");
      setLoading(true);

      try {
        await login(
          username,
          password
        );

        const user =
          authService
            .getStoredUser();

        navigate(
          user?.mustChangePassword
            ? "/change-password"
            : "/dashboard",
          {
            replace: true
          }
        );
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Connexion impossible."
        );
      } finally {
        setLoading(false);
      }
    };

  return (
    <main className="security-page">
      <section className="security-card">
        <div className="security-brand">
          Tantsaha miombona
        </div>

        <h1>
          Connexion
        </h1>

        <p>
          Accédez à votre espace selon
          votre rôle.
        </p>

        {error && (
          <div className="security-message security-error">
            {error}
          </div>
        )}

        <form
          className="security-form"
          onSubmit={submit}
        >
          <label>
            Identifiant
          </label>

          <input
            required
            autoComplete="username"
            value={username}
            onChange={(e) =>
              setUsername(
                e.target.value
              )
            }
          />

          <label>
            Mot de passe
          </label>

          <input
            required
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) =>
              setPassword(
                e.target.value
              )
            }
          />

          <button
            type="submit"
            className="security-btn security-btn-primary"
            disabled={loading}
          >
            {loading
              ? "Connexion..."
              : "Se connecter"}
          </button>
        </form>

        <div className="security-links">
          <Link to="/forgot-password">
            Mot de passe oublié ?
          </Link>

          <Link to="/register">
            Créer un compte
          </Link>

          <Link to="/">
            Retour à l'accueil
          </Link>
        </div>
      </section>
    </main>
  );
};

export default LoginPage;
