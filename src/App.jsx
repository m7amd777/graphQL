import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
// import {Profile} from'./components/Profile.jsx'
import {Dashboard} from'./components/Dashboard.jsx'
import { Auth } from './components/Auth.jsx'

function App() {
  // const [count, setCount] = useState(0)

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [fetched, setFetch] = useState(false)

  useEffect(()=> {
    console.log("use effect is called")
    if(!isLoggedIn) {
      if (localStorage.getItem("jwt")) {
        console.log("the local storage is having jwt so we setting to logged int")
        setIsLoggedIn(true);
      } else {
        console.log("no local storage leaccing")
        return;
      }
    }
    console.log("we logged in so we are fetching")
    //FETCH dashboard data

    if(!fetched) {
      fetchBasicCredentials()
    }

  }, [isLoggedIn])

  return (
    <div className='bigContainer'>
      {!isLoggedIn && <Auth onLogin = {()=> setIsLoggedIn(true)}/>}
      {isLoggedIn && <Dashboard onLogout= {()=> setIsLoggedIn(false)}/>}
    </div>
  )
}


async function fetchBasicCredentials(){

  
    const rea = {
    query: `
      query {
        user {
          id
        }
      }
    `
  };

  const req = await fetch("https://learn.reboot01.com/api/graphql-engine/v1/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${localStorage.getItem("jwt")}`
    },
    body : JSON.stringify(rea),
    // Authorization: `Bearer ${localStorage.getItem("jwt")}`
  })

  const data = await req.json()
  console.log(data)


}

//fetch the user data
//make queries public and then apply it to the state and pass it into the dashboard
// or just pass the json into it

export default App
