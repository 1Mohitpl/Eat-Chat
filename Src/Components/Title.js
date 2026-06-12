import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import useOnline from "../../utils/useOnline";
import UserContext from "../../utils/UserContext";
import { useSelector } from "react-redux";
import store from "../../utils/store";

const Title = () => (
  <a href="/">
    <img data-testid = "logo"
      className="logo"
      src="https://themes.muffingroup.com/be/recipes3/wp-content/uploads/2022/12/berecipes3.svg"
    />
  </a>
);
const Header = () => {
  const [islogin, setlogin] = useState(false);

  const isOnline = useOnline();
  const { user } = useContext(UserContext);

  const cartItems = useSelector(store  =>store.cart.items);




  return (
    <div className="header shadow-inner">
      {/* <h3>Eat&chat</h3> */}
      <Title />
      <div className="nave-items">
        <ul>
          <Link to="/">
            <li>Home</li>
          </Link>
          <Link to="/Contact">
            <li>Contact</li>
          </Link>

          <Link to="/about">
            <li>About</li>
          </Link>
          
          <Link to="/instaFresh">
            <li>InstaFresh</li>
          </Link>

          <Link to="/careers">
            <li>Careers</li>
          </Link>
          <Link to="/cart">
          
            <li data-testid = "cartTest">Cart {cartItems.length}</li>
          </Link>
        </ul>
      </div>
    
      <div className="log-btn">
            <h1 data-testid = "onlineStatus" className=" font-bold">Online status : {isOnline ? "✅" : "🛑"}</h1>
             {/* <span className="p-6 font-bold text-red-600">{user.name}</span> */}
        {islogin ? (
          <button className="btn" onClick={() => setlogin(false)}>Signout</button>
        ) : (
          <button className="btn" onClick={() => setlogin(true)}>LogIn</button>
        )}
      </div>
    </div>
  );
};
export default Header;
