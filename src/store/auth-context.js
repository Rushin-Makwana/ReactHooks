import React, { useEffect, useState } from 'react'
const AuthContext = React.createContext({
    isLoggedIn: false,
    onLogout: () => {},
    onLogin: (email, pass)=>{}

})
export const AuthContextProvider = (props) => {
useEffect(()=>{
const userLoggedInInformation = localStorage.getItem('isLoggedIn')
if(userLoggedInInformation === '1')
    setIsLoggedIn(true)
}, [])
    const [isLoggedIn, setIsLoggedIn] =  useState(false)


const logoutHandler = ()=>{
    localStorage.setItem('isLoggedIn', '1')
    setIsLoggedIn(false)
}
const loginHandler = ()=>{
    localStorage.removeItem('isLoggedIn')    
    setIsLoggedIn(true)
}
return(
<AuthContext.Provider value={{isLoggedIn : isLoggedIn, onLogout : logoutHandler, onLogin:loginHandler}}>{props.childern}</AuthContext.Provider>
)}
export default AuthContext;

