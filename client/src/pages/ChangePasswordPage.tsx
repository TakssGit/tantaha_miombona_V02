import {
  useState
} from "react";

import {
  authService
} from "../services/auth.service";

import {
  securityService
} from "../services/security.service";

import "../styles/security-account.css";

const ChangePasswordPage = () => {
  const [currentPassword,
    setCurrentPassword] =
      useState("");

  const [newPassword,
    setNewPassword] =
      useState("");

  const [confirmPassword,
    setConfirmPassword] =
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

      if (
        newPassword !==
        confirmPassword
      ) {
        setError(
          "Les nouveaux mots de passe ne correspondent pas."
        );
        return;
      }

      try {
        await securityService
          .changePassword(
            currentPassword,
            newPassword
          );

        authService
          .markPasswordChanged();

        window.location.href =
          "/dashboard";
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Modification impossible."
        );
      }
    };

  return (
    <main className="security-page">
      <section className="security-card">
        <h1>
          Modifier le mot de passe
        </h1>

        <p>
          Cette modification est obligatoire
          après une réinitialisation
          administrative.
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
            Mot de passe actuel
          </label>

          <input
            required
            type="password"
            autoComplete="current-password"
            value={currentPassword}
            onChange={(e) =>
              setCurrentPassword(
                e.target.value
              )
            }
          />

          <label>
            Nouveau mot de passe
          </label>

          <input
            required
            type="password"
            autoComplete="new-password"
            value={newPassword}
            onChange={(e) =>
              setNewPassword(
                e.target.value
              )
            }
          />

          <label>
            Confirmer
          </label>

          <input
            required
            type="password"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) =>
              setConfirmPassword(
                e.target.value
              )
            }
          />

          <button
            type="submit"
            className="security-btn security-btn-primary"
          >
            Enregistrer
          </button>
        </form>
      </section>
    </main>
  );
};

export default ChangePasswordPage;
