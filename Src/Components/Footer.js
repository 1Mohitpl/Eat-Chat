import { useContext } from "react";
import UserContext from "../../utils/UserContext";

const Footer = () => {
  const {user} = useContext(UserContext); 
  const name = user?.name || "Mohit";
  const email = user?.email || "mohit1paul@gmail.com";

    return (
      
      <h1 className="p-11 m-14 font-bold text-lime-800"> This site is developed by {name} -  {email}</h1>
  
      
    )
  };

  export default Footer;