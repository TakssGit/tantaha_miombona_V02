import type { LucideIcon } from "lucide-react";
import {
  AlertTriangle,
  Boxes,
  CalendarDays,
  ClipboardCheck,
  ClipboardList,
  Factory,
  Gauge,
  KeyRound,
  LogOut,
  PackageCheck,
  Scale,
  Search,
  Settings,
  ShoppingBasket,
  ShoppingCart,
  Sprout,
  Store,
  Truck,
  UserCheck,
  UserCog,
  Users,
  Warehouse
} from "lucide-react";

import {
  NavLink,
  useNavigate
} from "react-router-dom";

import useAuth
  from "../../hooks/useAuth";

import type {
  UserRole
} from "../../types/user";

interface Props {
  open: boolean;
  onClose: () => void;
}

type MenuItem = {
  label: string;
  to: string;
  icon: LucideIcon;
  roles: UserRole[];
};

type MenuSection = {
  title: string;
  items: MenuItem[];
};

const STAFF: UserRole[] = [
  "ADMIN",
  "GESTIONNAIRE",
  "QUALITE",
  "PRODUCTION",
  "COMMERCIAL"
];

const sections: MenuSection[] = [
  {
    title: "Pilotage",
    items: [
      {
        label: "Tableau de bord",
        to: "/dashboard",
        icon: Gauge,
        roles: STAFF
      },
      {
        label: "Mon espace producteur",
        to: "/espace-producteur",
        icon: Sprout,
        roles: ["PRODUCTEUR"]
      },
      {
        label: "Espace point focal",
        to: "/point-focal",
        icon: Users,
        roles: ["POINT_FOCAL"]
      },
      {
        label: "Mon espace commercial",
        to: "/espace-commercial",
        icon: ShoppingBasket,
        roles: ["DISTRIBUTEUR"]
      }
    ]
  },
  {
    title: "Approvisionnement",
    items: [
      { label: "PrÃ©commandes agricoles", to: "/precommandes-approvisionnement", icon: CalendarDays, roles: ["PRODUCTEUR","POINT_FOCAL","ADMIN","GESTIONNAIRE"] },
      {
        label: "Producteurs",
        to: "/producteurs",
        icon: Users,
        roles: ["ADMIN", "GESTIONNAIRE"]
      },
      {
        label: "Prévisions",
        to: "/previsions",
        icon: CalendarDays,
        roles: ["ADMIN", "GESTIONNAIRE"]
      },
      {
        label: "Lots",
        to: "/lots",
        icon: Sprout,
        roles: [
          "ADMIN",
          "GESTIONNAIRE",
          "QUALITE",
          "PRODUCTION"
        ]
      },
      {
        label: "Qualité",
        to: "/qualite",
        icon: ClipboardCheck,
        roles: [
          "ADMIN",
          "GESTIONNAIRE",
          "QUALITE"
        ]
      },
      {
        label: "Collecte",
        to: "/collecte",
        icon: Scale,
        roles: ["ADMIN", "GESTIONNAIRE"]
      },
      {
        label: "Transport",
        to: "/transports",
        icon: Truck,
        roles: ["ADMIN", "GESTIONNAIRE"]
      },
      {
        label: "Réception",
        to: "/receptions",
        icon: Warehouse,
        roles: [
          "ADMIN",
          "GESTIONNAIRE",
          "QUALITE",
          "PRODUCTION"
        ]
      }
    ]
  },
  {
    title: "Transformation",
    items: [
      {
        label: "Transformation",
        to: "/transformations",
        icon: Factory,
        roles: [
          "ADMIN",
          "GESTIONNAIRE",
          "PRODUCTION"
        ]
      },
      {
        label: "Produits finis",
        to: "/produits",
        icon: PackageCheck,
        roles: [
          "ADMIN",
          "GESTIONNAIRE",
          "PRODUCTION",
          "COMMERCIAL"
        ]
      },
      {
        label: "Stock",
        to: "/stocks",
        icon: Boxes,
        roles: [
          "ADMIN",
          "GESTIONNAIRE",
          "PRODUCTION",
          "COMMERCIAL"
        ]
      }
    ]
  },
  {
    title: "Commercial",
    items: [
      {
        label: "Clients",
        to: "/clients",
        icon: Store,
        roles: [
          "ADMIN",
          "GESTIONNAIRE",
          "COMMERCIAL"
        ]
      },
      {
        label: "Commandes",
        to: "/commandes",
        icon: ClipboardList,
        roles: ["ADMIN", "COMMERCIAL"]
      },
      {
        label: "Ventes",
        to: "/ventes",
        icon: ShoppingCart,
        roles: [
          "ADMIN",
          "GESTIONNAIRE",
          "COMMERCIAL"
        ]
      }
    ]
  },
  {
    title: "Suivi",
    items: [
      {
        label: "Traçabilité",
        to: "/tracabilite",
        icon: Search,
        roles: STAFF
      },
      {
        label: "Non-conformités",
        to: "/non-conformites",
        icon: AlertTriangle,
        roles: [
          "ADMIN",
          "GESTIONNAIRE",
          "QUALITE"
        ]
      }
    ]
  },
  {
    title: "Administration",
    items: [
      {
        label: "Demandes de compte",
        to: "/admin/registrations",
        icon: UserCheck,
        roles: ["ADMIN"]
      },
      {
        label: "Réinitialisations MDP",
        to: "/admin/password-resets",
        icon: KeyRound,
        roles: ["ADMIN"]
      },
      {
        label: "Utilisateurs",
        to: "/admin/users",
        icon: UserCog,
        roles: ["ADMIN"]
      },
      {
        label: "Accès producteurs",
        to: "/admin/producer-access",
        icon: Users,
        roles: ["ADMIN"]
      },
      {
        label: "Paramètres",
        to: "/administration",
        icon: Settings,
        roles: ["ADMIN"]
      }
    ]
  }
];

const Sidebar = ({
  open,
  onClose
}: Props) => {
  const navigate =
    useNavigate();

  const {
    user,
    logout
  } = useAuth();

  const linkClass = ({
    isActive
  }: {
    isActive: boolean;
  }) =>
    `sidebar-link ${
      isActive
        ? "active"
        : ""
    }`;

  const exit = () => {
    logout();
    onClose();

    navigate(
      "/login",
      {
        replace: true
      }
    );
  };

  return (
    <>
      {open && (
        <button
          type="button"
          className="sidebar-overlay"
          onClick={onClose}
          aria-label="Fermer le menu"
        />
      )}

      <aside
        className={`app-sidebar ${
          open ? "open" : ""
        }`}
      >
        <div className="sidebar-brand">
          <div className="sidebar-brand-logo">
            TM
          </div>

          <div>
            <div className="sidebar-brand-title">
              TANTSAHA
              <br />
              MIOMBONA
            </div>

            <div className="sidebar-brand-subtitle">
              Gestion circuit court
            </div>
          </div>
        </div>

        <nav className="sidebar-nav">
          {sections.map(
            (section) => {
              const items =
                user
                  ? section.items.filter(
                      (item) =>
                        item.roles.includes(
                          user.role
                        )
                    )
                  : [];

              if (
                items.length === 0
              ) {
                return null;
              }

              return (
                <div
                  key={section.title}
                >
                  <div className="sidebar-section-title">
                    {section.title}
                  </div>

                  {items.map(
                    ({
                      label,
                      to,
                      icon: Icon
                    }) => (
                      <NavLink
                        key={to}
                        className={linkClass}
                        to={to}
                        onClick={onClose}
                      >
                        <Icon />
                        {label}
                      </NavLink>
                    )
                  )}
                </div>
              );
            }
          )}
        </nav>

        <div className="sidebar-footer">
          {user && (
            <div
              style={{
                padding:
                  "8px 14px 12px",
                fontSize: 11,
                color: "#7b8a80"
              }}
            >
              <strong
                style={{
                  display: "block",
                  color: "#355242"
                }}
              >
                {user.fullName}
              </strong>
              {user.role}
            </div>
          )}

          <button
            className="sidebar-link"
            style={{
              width: "100%",
              border: 0,
              background:
                "transparent"
            }}
            onClick={exit}
          >
            <LogOut />
            Déconnexion
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
