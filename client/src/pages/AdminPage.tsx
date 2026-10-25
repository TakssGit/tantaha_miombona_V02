import {
  KeyRound,
  Save,
  Settings,
  UserCheck,
  UserCog,
  Users
} from "lucide-react";

import {
  useEffect,
  useState
} from "react";

import {
  Link
} from "react-router-dom";

import PageHeader
  from "../components/layout/PageHeader";
import Button
  from "../components/ui/Button";
import Card
  from "../components/ui/Card";
import Input
  from "../components/ui/Input";

import {
  businessService
} from "../services/business.service";

import type {
  OrganizationSettings
} from "../types/settings";

const emptySettings:
  OrganizationSettings = {
    organizationName:
      "Tantsaha Miombona",
    address: "",
    phone: "",
    currency: "Ar",
    targetTransportHours: 8,
    maximumLossRate: 10,
    targetConformityRate: 85,
    targetYieldRate: 70
  };

const AdminPage = () => {
  const [settings, setSettings] =
    useState<OrganizationSettings>(
      emptySettings
    );

  const [message, setMessage] =
    useState("");

  useEffect(() => {
    businessService.settings
      .get()
      .then(setSettings)
      .catch(() => {
        setMessage(
          "Impossible de charger les paramètres."
        );
      });
  }, []);

  const save = async () => {
    await businessService.settings
      .save(settings);

    setMessage(
      "Paramètres enregistrés."
    );
  };

  return (
    <>
      <PageHeader
        title="Administration"
        description="Paramètres de l'établissement et accès aux fonctions administratives sécurisées."
      />

      {message && (
        <div className="portal-message">
          {message}
        </div>
      )}

      <div className="dashboard-grid-two">
        <Card
          title="Paramètres de l'établissement"
          description="Ces renseignements peuvent être adaptés avant la présentation finale."
        >
          <div className="settings-grid">
            <Input
              label="Organisation"
              value={settings.organizationName}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  organizationName:
                    e.target.value
                })
              }
            />

            <Input
              label="Téléphone"
              value={settings.phone}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  phone:
                    e.target.value
                })
              }
            />

            <Input
              label="Adresse"
              value={settings.address}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  address:
                    e.target.value
                })
              }
            />

            <Input
              label="Devise"
              value={settings.currency}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  currency:
                    e.target.value
                })
              }
            />

            <Input
              label="Transport max h"
              type="number"
              value={settings.targetTransportHours}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  targetTransportHours:
                    Number(e.target.value)
                })
              }
            />

            <Input
              label="Pertes max %"
              type="number"
              value={settings.maximumLossRate}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  maximumLossRate:
                    Number(e.target.value)
                })
              }
            />

            <Input
              label="Conformité cible %"
              type="number"
              value={settings.targetConformityRate}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  targetConformityRate:
                    Number(e.target.value)
                })
              }
            />

            <Input
              label="Rendement cible %"
              type="number"
              value={settings.targetYieldRate}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  targetYieldRate:
                    Number(e.target.value)
                })
              }
            />
          </div>

          <div style={{ marginTop: 15 }}>
            <Button onClick={save}>
              <Save size={16} />
              Enregistrer
            </Button>
          </div>
        </Card>

        <Card
          title="Gestion des comptes"
          description="Les anciennes actions directes sur les utilisateurs ont été remplacées par les modules sécurisés P23-P27."
        >
          <div className="admin-shortcuts">
            <AdminLink
              to="/admin/users"
              icon={<UserCog size={20} />}
              title="Utilisateurs"
              text="Créer, modifier, activer, désactiver et déverrouiller les comptes."
            />

            <AdminLink
              to="/admin/registrations"
              icon={<UserCheck size={20} />}
              title="Demandes de compte"
              text="Approuver les comptes Producteur et Distributeur."
            />

            <AdminLink
              to="/admin/password-resets"
              icon={<KeyRound size={20} />}
              title="Réinitialisations MDP"
              text="Traiter les demandes de mot de passe oublié."
            />

            <AdminLink
              to="/admin/producer-access"
              icon={<Users size={20} />}
              title="Accès producteurs"
              text="Lier comptes Producteur et points focaux aux fiches terrain."
            />
          </div>
        </Card>
      </div>
    </>
  );
};

const AdminLink = ({
  to,
  icon,
  title,
  text
}: {
  to: string;
  icon: React.ReactNode;
  title: string;
  text: string;
}) => (
  <Link
    to={to}
    style={{
      display: "flex",
      gap: 10,
      padding: 12,
      border:
        "1px solid #e0e8e3",
      borderRadius: 10,
      textDecoration: "none",
      color: "#294838",
      marginBottom: 10
    }}
  >
    <span style={{ color: "#17713b" }}>
      {icon}
    </span>
    <span>
      <strong style={{ display: "block" }}>
        {title}
      </strong>
      <small>{text}</small>
    </span>
  </Link>
);

export default AdminPage;
