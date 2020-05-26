import { useState , useCallback , useEffect } from 'react';
import { useHistory } from 'react-router-dom';

let logoutTimer;

export const useAuth = () => {

  const history = useHistory();

    const [token, setToken] = useState();
    const [userId, setUserId] = useState();
    const [userRole, setUserRole] = useState();
    const [tokenExpirationDate , setTokenExpirationDate] = useState();
    
    const login = useCallback((uid, token, role, expirationDate) => {
      setToken(token);
      setUserId(uid);
      setUserRole(role);
      const tokenExpiration = expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60);
      setTokenExpirationDate(tokenExpiration);
      localStorage.setItem(
        "userData",
        JSON.stringify({
          userId: uid,
          token: token,
          role: role,
          expiration: tokenExpiration.toISOString()
        })
      );
    }, []);
    
    const logout = useCallback(() => {
      setToken(null);
      setTokenExpirationDate(null);
      setUserId(null);
      setUserRole(null);
      localStorage.removeItem("userData");
    }, []);
    
    
    useEffect(() => {
      if(token && tokenExpirationDate){
        const remianingTime = tokenExpirationDate.getTime() - new Date().getTime();
        logoutTimer = setTimeout(logout , remianingTime);
      } else {
        clearTimeout(logoutTimer);
      }
    } ,[token , logout , tokenExpirationDate]);
    
    useEffect(() => {
      const storedData = JSON.parse(localStorage.getItem("userData"));
      if (storedData && storedData.token && new Date(storedData.expiration) > new Date()) {
        login(storedData.userId, storedData.token , storedData.role, new Date(storedData.expiration));
      }
    }, [login]);
    
    return { token, login, logout, userId, userRole };
};