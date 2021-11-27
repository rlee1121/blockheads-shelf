import { useEthers } from '@usedapp/core'

export default function Account() {
    const {account} = useEthers()
    console.log("Account", account)
    return <div>Account ${account}</div>
}