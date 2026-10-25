
import useAuth
  from "../../hooks/useAuth";

interface Props {
  onMenuClick: () => void;
}

const Header = ({
  onMenuClick
}: Props) => {
  const {
    user
  } = useAuth();

  const date =
    new Intl.DateTimeFormat(
      "fr-FR",
      {
        weekday:
          "long",
        day: "2-digit",
        month: "long",
        year: "numeric"
      }
    ).format(
      new Date()
    );

  return (
    <header className="app-header">
      <div className="header-left">
        <button
          className="header-menu-button"
          onClick={
            onMenuClick
          }
        >
          <img className="tm29-header-logo" src="/assets/images/tm29/tomato-logo.svg" alt="Tantsaha Miombona" style={{width:42,height:42,objectFit:"contain",display:"block",flex:"0 0 auto"}} />
        </button>

        <div>
          <div className="header-title">
            Tantsaha miombona
          </div>

          <div className="header-date">
            {date}
          </div>
        </div>
      </div>

      <div className="header-right">
        <div className="header-user">
          <div className="header-avatar">
            {user
              ?.fullName
              ?.charAt(0)
              .toUpperCase() ||
              "U"}
          </div>

          <div className="header-user-details">
            <div className="header-user-name">
              {
                user?.fullName
              }
            </div>

            <div className="header-user-role">
              {
                user?.role
              }
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
