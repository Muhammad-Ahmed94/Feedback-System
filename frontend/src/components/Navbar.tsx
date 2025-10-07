import { Link } from "react-router-dom"

import Button from "./Button"
import useUserStore from "../stores/useUserStore"


const Navbar = () => {
  const { user, logout } = useUserStore();
  return (
    <div className="flex justify-between">
        <div><Link to="/">
         <Button title="Home" styles="bg-blue-400" />
        </Link></div>
        <div>{!user ? "Lets get started" : <button onClick={logout}>logout</button>}</div>
    </div>
  )
}

export default Navbar