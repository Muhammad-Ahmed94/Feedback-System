import { Link } from "react-router-dom"
import Button from "../components/Button"

type Props = {}

const Homepage = (props: Props) => {
  return (
    <div className="w-screen h-screen overflow-hidden flex-col-center">
        <div className="bg-red-500 text-5xl mb-2">Homepage</div>
        <div className="text-lg capitalize mb-2">Smart insight aggregator-anonymized feedback system</div>
        <div>
            <Link to="/signup">
                <Button title="Get Started" styles="bg-blue-400" />
            </Link>
        </div>
    </div>
  )
}

export default Homepage