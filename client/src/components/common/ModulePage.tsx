import type { LucideIcon } from "lucide-react";
import PageHeader from "../layout/PageHeader";

interface ModulePageProps {
  title: string;
  description: string;
  icon: LucideIcon;
}

const ModulePage = ({
  title,
  description,
  icon: Icon
}: ModulePageProps) => {
  return (
    <>
      <PageHeader title={title} description={description} />

      <div className="module-placeholder">
        <div>
          <div className="module-placeholder-icon">
            <Icon size={30} />
          </div>

          <h3>{title}</h3>
          <p>
            Le module est correctement relié à la navigation.
            Les fonctions métier seront ajoutées dans les prochains paquets.
          </p>
        </div>
      </div>
    </>
  );
};

export default ModulePage;
