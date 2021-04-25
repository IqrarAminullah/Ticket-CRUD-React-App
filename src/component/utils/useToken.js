import { useState } from 'react';

export default function useLocalStorage() {
  const getToken = () => {
    const tokenString = localStorage.getItem('token');
    const localToken = JSON.parse(tokenString);
    return localToken?.token;
  };

  const getUserName = () =>{
    const tokenString = localStorage.getItem('token');
    const localToken = JSON.parse(tokenString);
    return localToken?.username;
  }
  const getUserId = () =>{
    const tokenString = localStorage.getItem('token');
    const localToken = JSON.parse(tokenString);
    return localToken?.id;
  }

  const [token, setToken] = useState(getToken());
  const username = getUserName();
  const userId = getUserId();

  const saveToken = userToken => {
    localStorage.setItem('token', JSON.stringify(userToken));
    setToken(userToken.token);
  };

  const clearToken = () =>{
    localStorage.setItem('token','');
    localStorage.clear();
  }

  return {
    setToken: saveToken,
    token,
    username,
    deleteToken: clearToken,
    userId
  }
}