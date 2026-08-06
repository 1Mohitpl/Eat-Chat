import { createContext, useState } from "react";
import { getUser, setAuth, clearAuth } from "./auth";

const UserContext = createContext({
  user: null,
  loggedIn: false,
  login: () => {},
  logout: () => {},
});

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => getUser());

  const login = (data) => {
    setAuth(data);
    setUser(getUser());
  };

  const logout = () => {
    clearAuth();
    setUser(null);
  };

  return (
    <UserContext.Provider
      value={{
        user,
        loggedIn: !!user,
        login,
        logout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;