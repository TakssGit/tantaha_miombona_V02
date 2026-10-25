import {
  useState
} from "react";

import {
  Link
} from "react-router-dom";

import {
  securityService
} from "../services/security.service";

import "../styles/security-account.css";

const ForgotPasswordPage = () => {
  const [username, setUsername] =
    useState("");

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  const submit =
    async (
      event:
        React.FormEvent
    ) => {
      event.preventDefault();

      setError("");
      setMessage("");

      try {
        const result =
          await securityService
            .forgotPassword(
              username
            );

        setMessage(
          result.message
        );
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Demande impossible."
        );
      }
    };

  return (
    <main className="security-page">
      <section className="security-card">
        <h1>
          Mot de passe oublié
        </h1>

        <p>
          Saisissez votre identifiant.
          En mode local, la demande est
          traitée par un administrateur.
        </p>

        {message && (
          <div className="security-message">
            {message}
          </div>
        )}

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

          <button
            type="submit"
            className="security-btn security-btn-primary"
          >
            Envoyer la demande
          </button>
        </form>

        <Link
          to="/login"
          className="security-link"
        >
          Retour à la connexion
        </Link>
      </section>
    </main>
  );
};

export default ForgotPasswordPage;
