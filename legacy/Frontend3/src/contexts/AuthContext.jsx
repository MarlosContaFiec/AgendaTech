import React,{createContext,useState,useEffect} from 'react';
import {apiLogin} from '../services/auth';
import {api,setTokens,clearTokens} from '../services/api';
export const AuthContext=createContext(null);
export function AuthProvider({children}){
  const [user,setUser]=useState(null);
  const [token,setToken]=useState(null);
  const [loading,setLoading]=useState(true);
  useEffect(function(){
    var cancelled=false;
    function onExpired(){localStorage.removeItem('access_token');localStorage.removeItem('refresh_token');clearTokens();setToken(null);setUser(null);}
    window.addEventListener('auth:expired',onExpired);
    async function init(){
      var stored=localStorage.getItem('access_token');var refresh=localStorage.getItem('refresh_token');
      if(!stored){setLoading(false);return;}
      setTokens(stored,refresh);
      var res=await api('GET','/api/auth/me',null,stored);
      if(!cancelled){if(res.success){setUser(Object.assign({},res.data,{token:stored}));setToken(stored);}else{localStorage.removeItem('access_token');localStorage.removeItem('refresh_token');clearTokens();}setLoading(false);}
    }
    init();
    return function(){cancelled=true;window.removeEventListener('auth:expired',onExpired);};
  },[]);
  async function login(documento,senha){
    var res=await apiLogin(documento,senha);
    if(res.success){var tk=res.data.tokens;localStorage.setItem('access_token',tk.access);localStorage.setItem('refresh_token',tk.refresh);setTokens(tk.access,tk.refresh);setToken(tk.access);var me=await api('GET','/api/auth/me',null,tk.access);if(me.success)setUser(Object.assign({},me.data,{token:tk.access}));else setUser(Object.assign({},res.data.user,{token:tk.access}));return{success:true};}
    return{success:false,message:res.message};
  }
  function logout(){localStorage.removeItem('access_token');localStorage.removeItem('refresh_token');clearTokens();setToken(null);setUser(null);}
  return(<AuthContext.Provider value={{user:user,token:token,loading:loading,login:login,logout:logout,isAuthenticated:!!user}}>{children}</AuthContext.Provider>);
}