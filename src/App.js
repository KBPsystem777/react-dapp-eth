import "./App.css"
import { useState } from "react"
import { ethers } from "ethers"
import Greeter from "./artifacts/contracts/Greeter.sol/Greeter.json"

// update with the contract address
// logged out to the CLI when it was deployed

const greeterAddress = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8"

function App() {
  // store greeting in local state
  const [greeting, setGreetingValue] = useState()

  // request access to user's metamask wallet
  async function requestAccount() {
    await window.ethereum.request({
      method: "eth_requestAccounts",
    })
  }

  // call the smart contract and read the current greeting value
  async function fetchGreeting() {
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const contract = new ethers.Contract(
        greeterAddress,
        Greeter.abi,
        provider
      )
      try {
        const data = await contract.greet()
        console.log("data: ", data)
      } catch (err) {
        console.log("Error: ", err)
      }
    }
  }

  // call the smart contract and send an update
  async function setGreeting() {
    if (!greeting) return
    if (typeof window.ethereum !== "undefined") {
      await requestAccount()
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const contract = new ethers.Contract(greeterAddress, Greeter.abi, signer)
      const transaction = await contract.setGreeting(greeting)
      await transaction.wait()
      fetchGreeting()
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <button onClick={fetchGreeting}>Fetch Greeting</button>
        <button onClick={setGreeting}>Set Greeting</button>
        <input
          onChange={(e) => setGreetingValue(e.target.value)}
          placeholder="Set greeting"
        />
      </header>
    </div>
  )
}

export default App
