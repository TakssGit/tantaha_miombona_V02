import {
  createBrowserRouter,
  Navigate
} from "react-router-dom";

import AppLayout
  from "../layouts/AppLayout";

import ProtectedRoute
  from "./ProtectedRoute";

import RoleProtectedRoute
  from "./RoleProtectedRoute";

import HomePage
  from "../pages/HomePage";
import LoginPage
  from "../pages/LoginPage";
import RegisterPage
  from "../pages/RegisterPage";
import ForgotPasswordPage
  from "../pages/ForgotPasswordPage";
import ChangePasswordPage
  from "../pages/ChangePasswordPage";
import RoleHomePage
  from "../pages/RoleHomePage";

import ProducerPortalPage
  from "../pages/ProducerPortalPage";
import PointFocalPage
  from "../pages/PointFocalPage";
import ForecastAdminPage
  from "../pages/ForecastAdminPage";
import ProducerAccessAdminPage
  from "../pages/ProducerAccessAdminPage";
import RegistrationAdminPage
  from "../pages/RegistrationAdminPage";
import PasswordResetAdminPage
  from "../pages/PasswordResetAdminPage";
import AdminUsersPage
  from "../pages/AdminUsersPage";
import CommercialPortalPage
  from "../pages/CommercialPortalPage";
import OrdersAdminPage
  from "../pages/OrdersAdminPage";

import DashboardPage
  from "../pages/DashboardPage";
import ProducersPage
  from "../pages/ProducersPage";
import LotsPage
  from "../pages/LotsPage";
import QualityPage
  from "../pages/QualityPage";
import CollectionsPage
  from "../pages/CollectionsPage";
import TransportsPage
  from "../pages/TransportsPage";
import ReceptionsPage
  from "../pages/ReceptionsPage";
import ProductionsPage
  from "../pages/ProductionsPage";
import ProductsPage
  from "../pages/ProductsPage";
import StockPage
  from "../pages/StockPage";
import CustomersPage
  from "../pages/CustomersPage";
import SalesPage
  from "../pages/SalesPage";
import TraceabilityPage
  from "../pages/TraceabilityPage";
import NonConformitiesPage
  from "../pages/NonConformitiesPage";
import AdminPage
  from "../pages/AdminPage";
import NotFoundPage
  from "../pages/NotFoundPage";

import PublicCatalogPage from "../pages/PublicCatalogPage";
import PublicProducerGuidePage from "../pages/PublicProducerGuidePage";

import SupplyPreordersPage from "../pages/SupplyPreordersPage";

import AppConfigAdminPage from "../pages/AppConfigAdminPage";
const protectedLayout = (
  <ProtectedRoute>
    <AppLayout />
  </ProtectedRoute>
);

const router =
  createBrowserRouter([
    {
      path: "/",
      element: <HomePage />
    },
    { path: "/catalogue", element: <PublicCatalogPage /> },
    { path: "/producteurs", element: <PublicProducerGuidePage /> },
    {
      path: "/login",
      element: <LoginPage />
    },
    {
      path: "/register",
      element: <RegisterPage />
    },
    {
      path: "/forgot-password",
      element:
        <ForgotPasswordPage />
    },
    {
      path: "/change-password",
      element: (
        <ProtectedRoute>
          <ChangePasswordPage />
        </ProtectedRoute>
      )
    },
    {
      path: "/app",
      element: protectedLayout,
      children: [
        {
          index: true,
          element: (
            <Navigate
              to="/dashboard"
              replace
            />
          )
        }
      ]
    },
    {
      path: "/dashboard",
      element: protectedLayout,
      children: [
        {
          index: true,
          element: <RoleHomePage />
        }
      ]
    },

    /* Espaces P24-P25 */
    {
      path: "/espace-producteur",
      element: protectedLayout,
      children: [
        {
          index: true,
          element: (
            <RoleProtectedRoute
              allowedRoles={[
                "PRODUCTEUR"
              ]}
            >
              <ProducerPortalPage />
            </RoleProtectedRoute>
          )
        }
      ]
    },
    {
      path: "/producer-space",
      element: (
        <Navigate
          to="/espace-producteur"
          replace
        />
      )
    },
    {
      path: "/point-focal",
      element: protectedLayout,
      children: [
        {
          index: true,
          element: (
            <RoleProtectedRoute
              allowedRoles={[
                "POINT_FOCAL"
              ]}
            >
              <PointFocalPage />
            </RoleProtectedRoute>
          )
        }
      ]
    },
    {
      path: "/espace-commercial",
      element: protectedLayout,
      children: [
        {
          index: true,
          element: (
            <RoleProtectedRoute
              allowedRoles={[
                "DISTRIBUTEUR"
              ]}
            >
              <CommercialPortalPage />
            </RoleProtectedRoute>
          )
        }
      ]
    },
    {
      path: "/commercial-space",
      element: (
        <Navigate
          to="/espace-commercial"
          replace
        />
      )
    },
    {
      path: "/previsions",
      element: protectedLayout,
      children: [
        {
          index: true,
          element: (
            <RoleProtectedRoute
              allowedRoles={[
                "ADMIN",
                "GESTIONNAIRE"
              ]}
            >
              <ForecastAdminPage />
            </RoleProtectedRoute>
          )
        }
      ]
    },
    {
      path: "/forecasts",
      element: (
        <Navigate
          to="/previsions"
          replace
        />
      )
    },
    {
      path: "/commandes",
      element: protectedLayout,
      children: [
        {
          index: true,
          element: (
            <RoleProtectedRoute
              allowedRoles={[
                "ADMIN",
                "COMMERCIAL"
              ]}
            >
              <OrdersAdminPage />
            </RoleProtectedRoute>
          )
        }
      ]
    },
    {
      path: "/orders",
      element: (
        <Navigate
          to="/commandes"
          replace
        />
      )
    },

    {
      path: "/precommandes-approvisionnement",
      element: protectedLayout,
      children: [{ index: true, element: (
        <RoleProtectedRoute allowedRoles={["PRODUCTEUR","POINT_FOCAL","ADMIN","GESTIONNAIRE"]}>
          <SupplyPreordersPage />
        </RoleProtectedRoute>
      )}]
    },
    {
      path: "/admin/configuration-v02",
      element: protectedLayout,
      children: [{ index: true, element: (
        <RoleProtectedRoute allowedRoles={["ADMIN"]}>
          <AppConfigAdminPage />
        </RoleProtectedRoute>
      )}]
    },
    /* Administration P23-P27 */
    {
      path: "/admin/registrations",
      element: protectedLayout,
      children: [
        {
          index: true,
          element: (
            <RoleProtectedRoute
              allowedRoles={["ADMIN"]}
            >
              <RegistrationAdminPage />
            </RoleProtectedRoute>
          )
        }
      ]
    },
    {
      path: "/admin/password-resets",
      element: protectedLayout,
      children: [
        {
          index: true,
          element: (
            <RoleProtectedRoute
              allowedRoles={["ADMIN"]}
            >
              <PasswordResetAdminPage />
            </RoleProtectedRoute>
          )
        }
      ]
    },
    {
      path: "/admin/users",
      element: protectedLayout,
      children: [
        {
          index: true,
          element: (
            <RoleProtectedRoute
              allowedRoles={["ADMIN"]}
            >
              <AdminUsersPage />
            </RoleProtectedRoute>
          )
        }
      ]
    },
    {
      path: "/admin/producer-access",
      element: protectedLayout,
      children: [
        {
          index: true,
          element: (
            <RoleProtectedRoute
              allowedRoles={["ADMIN"]}
            >
              <ProducerAccessAdminPage />
            </RoleProtectedRoute>
          )
        }
      ]
    },

    /* Modules métier historiques avec RBAC frontend */
    {
      path: "/producteurs",
      element: protectedLayout,
      children: [
        {
          index: true,
          element: (
            <RoleProtectedRoute
              allowedRoles={[
                "ADMIN",
                "GESTIONNAIRE"
              ]}
            >
              <ProducersPage />
            </RoleProtectedRoute>
          )
        }
      ]
    },
    {
      path: "/producers",
      element: <Navigate to="/producteurs" replace />
    },
    {
      path: "/lots",
      element: protectedLayout,
      children: [
        {
          index: true,
          element: (
            <RoleProtectedRoute
              allowedRoles={[
                "ADMIN",
                "GESTIONNAIRE",
                "QUALITE",
                "PRODUCTION"
              ]}
            >
              <LotsPage />
            </RoleProtectedRoute>
          )
        }
      ]
    },
    {
      path: "/qualite",
      element: protectedLayout,
      children: [
        {
          index: true,
          element: (
            <RoleProtectedRoute
              allowedRoles={[
                "ADMIN",
                "GESTIONNAIRE",
                "QUALITE"
              ]}
            >
              <QualityPage />
            </RoleProtectedRoute>
          )
        }
      ]
    },
    {
      path: "/quality",
      element: <Navigate to="/qualite" replace />
    },
    {
      path: "/quality-checks",
      element: <Navigate to="/qualite" replace />
    },
    {
      path: "/collecte",
      element: protectedLayout,
      children: [
        {
          index: true,
          element: (
            <RoleProtectedRoute
              allowedRoles={[
                "ADMIN",
                "GESTIONNAIRE"
              ]}
            >
              <CollectionsPage />
            </RoleProtectedRoute>
          )
        }
      ]
    },
    {
      path: "/collections",
      element: <Navigate to="/collecte" replace />
    },
    {
      path: "/transports",
      element: protectedLayout,
      children: [
        {
          index: true,
          element: (
            <RoleProtectedRoute
              allowedRoles={[
                "ADMIN",
                "GESTIONNAIRE"
              ]}
            >
              <TransportsPage />
            </RoleProtectedRoute>
          )
        }
      ]
    },
    {
      path: "/receptions",
      element: protectedLayout,
      children: [
        {
          index: true,
          element: (
            <RoleProtectedRoute
              allowedRoles={[
                "ADMIN",
                "GESTIONNAIRE",
                "QUALITE",
                "PRODUCTION"
              ]}
            >
              <ReceptionsPage />
            </RoleProtectedRoute>
          )
        }
      ]
    },
    {
      path: "/transformations",
      element: protectedLayout,
      children: [
        {
          index: true,
          element: (
            <RoleProtectedRoute
              allowedRoles={[
                "ADMIN",
                "GESTIONNAIRE",
                "PRODUCTION"
              ]}
            >
              <ProductionsPage />
            </RoleProtectedRoute>
          )
        }
      ]
    },
    {
      path: "/productions",
      element: <Navigate to="/transformations" replace />
    },
    {
      path: "/produits",
      element: protectedLayout,
      children: [
        {
          index: true,
          element: (
            <RoleProtectedRoute
              allowedRoles={[
                "ADMIN",
                "GESTIONNAIRE",
                "PRODUCTION",
                "COMMERCIAL"
              ]}
            >
              <ProductsPage />
            </RoleProtectedRoute>
          )
        }
      ]
    },
    {
      path: "/products",
      element: <Navigate to="/produits" replace />
    },
    {
      path: "/stocks",
      element: protectedLayout,
      children: [
        {
          index: true,
          element: (
            <RoleProtectedRoute
              allowedRoles={[
                "ADMIN",
                "GESTIONNAIRE",
                "PRODUCTION",
                "COMMERCIAL"
              ]}
            >
              <StockPage />
            </RoleProtectedRoute>
          )
        }
      ]
    },
    {
      path: "/stock",
      element: <Navigate to="/stocks" replace />
    },
    {
      path: "/clients",
      element: protectedLayout,
      children: [
        {
          index: true,
          element: (
            <RoleProtectedRoute
              allowedRoles={[
                "ADMIN",
                "GESTIONNAIRE",
                "COMMERCIAL"
              ]}
            >
              <CustomersPage />
            </RoleProtectedRoute>
          )
        }
      ]
    },
    {
      path: "/customers",
      element: <Navigate to="/clients" replace />
    },
    {
      path: "/ventes",
      element: protectedLayout,
      children: [
        {
          index: true,
          element: (
            <RoleProtectedRoute
              allowedRoles={[
                "ADMIN",
                "GESTIONNAIRE",
                "COMMERCIAL"
              ]}
            >
              <SalesPage />
            </RoleProtectedRoute>
          )
        }
      ]
    },
    {
      path: "/sales",
      element: <Navigate to="/ventes" replace />
    },
    {
      path: "/tracabilite",
      element: protectedLayout,
      children: [
        {
          index: true,
          element: <TraceabilityPage />
        }
      ]
    },
    {
      path: "/traceability",
      element: <Navigate to="/tracabilite" replace />
    },
    {
      path: "/non-conformites",
      element: protectedLayout,
      children: [
        {
          index: true,
          element: (
            <RoleProtectedRoute
              allowedRoles={[
                "ADMIN",
                "GESTIONNAIRE",
                "QUALITE"
              ]}
            >
              <NonConformitiesPage />
            </RoleProtectedRoute>
          )
        }
      ]
    },
    {
      path: "/non-conformities",
      element: <Navigate to="/non-conformites" replace />
    },
    {
      path: "/administration",
      element: protectedLayout,
      children: [
        {
          index: true,
          element: (
            <RoleProtectedRoute
              allowedRoles={["ADMIN"]}
            >
              <AdminPage />
            </RoleProtectedRoute>
          )
        }
      ]
    },
    {
      path: "/admin",
      element: <Navigate to="/administration" replace />
    },
    {
      path: "*",
      element: <NotFoundPage />
    }
  ], { basename: import.meta.env.BASE_URL });

export default router;
