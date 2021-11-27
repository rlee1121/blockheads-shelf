
import { useEthers } from '@usedapp/core'
import './Connect.css'
export default function Connect() {
    const { activateBrowserWallet } = useEthers()
    const connect = () => {
        activateBrowserWallet()
    }
    return <button className="connect-button" onClick={connect}>Click to connect your wallet</button>
}