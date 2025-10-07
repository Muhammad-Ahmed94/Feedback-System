import { Link } from "react-router-dom"
import Button from "./Button"

type Props = {}

const Navbar = (props: Props) => {
  return (
    <div>
        <Link to="/">
         <Button title="Home" styles="bg-blue-400" />
        </Link>
    </div>
  )
}

export default Navbar