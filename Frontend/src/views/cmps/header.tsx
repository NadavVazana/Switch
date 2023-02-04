import { useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { useRecoilValue } from "recoil";
import loggedInUser from "../../atoms/logged-in-user";

function Header() {
  const navigate = useNavigate();
  const loggedUser = useRecoilValue(loggedInUser);

  return (
    <section className="header">
      <img
        className="logo"
        src={require("../../assets/imgs/switch_icon.svg").default}
        alt="logo"
      />
      <nav>
        {!Object.keys(loggedUser).length ? (
          <NavLink to={"/login"}>Login</NavLink>
        ) : (
          <section onClick={() => navigate("/user")} className="user-nav">
            <img src={loggedUser.img} alt="" />
            <h1 className={"welcome"}>{`Welcome ${loggedUser.firstName}`}</h1>
          </section>
        )}
      </nav>
    </section>
  );
}

export default Header;
