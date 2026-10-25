import { Link } from "react-router-dom";
import Button from "../components/ui/Button";

const NotFoundPage = () => {
  return (
    <main className="login-layout">
      <section className="login-card">
        <div className="login-logo">404</div>

        <h1 className="login-title">Page introuvable</h1>

        <p className="login-subtitle">
          Cette adresse n'existe pas dans Tantsaha miombona.
        </p>

        <Link to="/dashboard">
          <Button size="lg">
            Retour au tableau de bord
          </Button>
        </Link>
      </section>
    </main>
  );
};

export default NotFoundPage;
