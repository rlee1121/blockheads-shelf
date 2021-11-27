import { useEthers } from "@usedapp/core";
import "./StatusBar.css"

export default function StatusBar() {
    const { account } = useEthers();
    const accountDisplay = account ? `connected to ${account}` : `disconnected`
    const statusClass = account ? "connected" : "disconnected"
    return <div className={`status-bar ${statusClass}`}>
        <span className="label">Status:</span> <span className="connection-message">{accountDisplay}</span>
    </div>

}