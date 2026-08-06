import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import UserContext from "../../utils/UserContext";

const AccountPage = () => {
  const { user, loggedIn, logout } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/account");
  };

  if (!loggedIn) {
    return (
      <div className="account-page p-11 m-14">
        <h2 className="font-bold text-2xl text-lime-800">You are logged out</h2>
        <p className="mt-4">Please log in to access your account.</p>
        <Link to="/login">
          <button className="btn mt-4">LogIn</button>
        </Link>
      </div>
    );
  }

  return (
    <div className="account-page p-11 m-14">
      <h2 className="font-bold text-2xl text-lime-800">My Account</h2>
      <div className="mt-6">
        <p className="font-bold text-xl">Name: {user.name}</p>
        <p className="mt-2">Email: {user.email}</p>
      </div>
      <button className="btn mt-6" onClick={handleLogout}>
        Signout
      </button>
    </div>
  );
};

export default AccountPage;