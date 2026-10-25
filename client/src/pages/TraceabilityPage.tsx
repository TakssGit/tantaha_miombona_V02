import {
  useState
} from "react";

import {
  Factory,
  PackageCheck,
  Search,
  ShoppingCart,
  Sprout,
  Truck,
  User,
  Warehouse
} from "lucide-react";

import PageHeader
  from "../components/layout/PageHeader";

import Button
  from "../components/ui/Button";

import Card
  from "../components/ui/Card";

import SearchInput
  from "../components/common/SearchInput";

import {
  businessService
} from "../services/business.service";

import type {
  TraceabilityRecord
} from "../types/traceability";

const TraceabilityPage = () => {
  const [
    query,
    setQuery
  ] = useState("");

  const [
    data,
    setData
  ] =
    useState<
      TraceabilityRecord | null
    >(null);

  const [
    error,
    setError
  ] = useState("");

  const search =
    async () => {
      try {
        setError("");

        const result =
          await businessService
            .traceability(
              query
            );

        setData(result);
      } catch (
        current
      ) {
        setData(null);

        setError(
          current instanceof
          Error
            ? current.message
            : "Introuvable."
        );
      }
    };

  const getIcon = (
    type: string
  ) => {
    if (
      type === "Producteur"
    ) {
      return User;
    }

    if (
      type === "Lot"
    ) {
      return Sprout;
    }

    if (
      type === "Transport"
    ) {
      return Truck;
    }

    if (
      type === "Transformation"
    ) {
      return Factory;
    }

    if (
      type === "Produit fini"
    ) {
      return PackageCheck;
    }

    if (
      type === "Vente"
    ) {
      return ShoppingCart;
    }

    return Warehouse;
  };

  return (
    <>
      <PageHeader
        title="Traçabilité"
        description="Recherche directe dans la base SQLite."
      />

      <div className="trace-search-panel">
        <div className="trace-search-row">
          <SearchInput
            value={query}
            onChange={setQuery}
            placeholder="PF-..., FAB-..., TOM-..., P001, VTE-..."
          />

          <Button
            onClick={search}
          >
            <Search size={16} />
            Rechercher
          </Button>
        </div>

        {error && (
          <div className="trace-error">
            {error}
          </div>
        )}
      </div>

      {data && (
        <Card
          title={`${data.productName} - ${data.finalProductCode}`}
        >
          <div className="trace-timeline">
            {data.nodes.map(
              (node) => {
                const Icon =
                  getIcon(
                    node.type
                  );

                return (
                  <div
                    className="trace-node"
                    key={
                      node.id
                    }
                  >
                    <div className="trace-node-marker">
                      <Icon
                        size={12}
                      />
                    </div>

                    <div className="trace-node-card">
                      <div className="trace-node-type">
                        {
                          node.type
                        }
                      </div>

                      <div className="trace-node-title">
                        {
                          node.title
                        }
                      </div>

                      <div className="trace-node-description">
                        {
                          node.description
                        }
                      </div>

                      <div className="trace-node-meta">
                        {
                          node.code
                        }
                      </div>
                    </div>
                  </div>
                );
              }
            )}
          </div>
        </Card>
      )}
    </>
  );
};

export default TraceabilityPage;
