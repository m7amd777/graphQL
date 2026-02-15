import { useEffect, useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
// import {Profile} from'./components/Profile.jsx'
import { Dashboard } from './components/Dashboard.jsx'
import { Auth } from './components/Auth.jsx'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (!isLoggedIn && localStorage.getItem("jwt")) {
      console.log("the local storage is having jwt so we setting to logged int")
      setIsLoggedIn(true);
    }
  }, [isLoggedIn])

  return (
    <div className='bigContainer'>
      <Routes>
        <Route
          path="/login"
          element={
            isLoggedIn
              ? <Navigate to="/" replace />
              : <Auth onLogin={() => setIsLoggedIn(true)} />
          }
        />
        <Route
          path="/"
          element={
            isLoggedIn
              ? <Dashboard onLogout={() => setIsLoggedIn(false)} />
              : <Navigate to="/login" replace />
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}


// async function fetchBasicCredentials(){


//     const rea = {
//     query: `
//       query {
//         user {
//           id
//         }
//       }
//     `
//   };

//   const req = await fetch("https://learn.reboot01.com/api/graphql-engine/v1/graphql", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       "Authorization": `Bearer ${localStorage.getItem("jwt")}`
//     },
//     body : JSON.stringify(rea),
//     // Authorization: `Bearer ${localStorage.getItem("jwt")}`
//   })

//   const data = await req.json()
//   console.log(data)


// }

//fetch the user data
//make queries public and then apply it to the state and pass it into the dashboard
// or just pass the json into it

export default App
