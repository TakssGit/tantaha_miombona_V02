import { Menu } from "lucide-react";

interface HeaderProps {
  onMenuClick: () => void;
}

const Header = ({ onMenuClick }: HeaderProps) => {
  const formattedDate = new Intl.DateTimeFormat("fr-FR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric"
  }).format(new Date());

  return (
    <header className="app-header">
      <div className="header-left">
        <button
          className="header-menu-button"
          onClick={onMenuClick}
          aria-label="Ouvrir le menu"
        >
          <Menu size={20} />
        </button>

        <div>
          <div className="header-title">Tantsaha miombona</div>
          <div className="header-date">{formattedDate}</div>
        </div>
      </div>

      <div className="header-right">
        <div className="header-user">
          <div className="header-avatar">A</div>

          <div className="header-user-details">
            <div className="header-user-name">Administrateur</div>
            <div className="header-user-role">Mode local</div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
