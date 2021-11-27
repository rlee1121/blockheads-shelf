import { Link } from "react-router-dom"
import "./TitleBar.css"

export default function TitleBar() {
    return <div className="title-bar">
        <div><Link to="/collection">Blockheads</Link></div>
        <div>v1.0</div>
    </div>
}