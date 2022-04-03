import { getDefaultProvider } from "ethers";
import { formatEther, Interface } from "ethers/lib/utils";

const provider = getDefaultProvider();

const erc20Interface = new Interface([
  'event Transfer(address indexed from, address indexed to, uint tokens)',
  'event Approval(address indexed tokenOwner, address indexed spender, uint tokens)',
  'function balanceOf(address) view returns (uint256)',
  'function transfer(address, uint256) returns (bool)',
  'function approve(address, uint256) returns (bool)',
  'function allowance(address, address) view returns (uint256)',
  'function transferFrom(address, address, uint256) returns (bool)',
]);


export async function getTransferEvents(token: string, account: string) {
  const logs = await provider.getLogs({
    address: token,
    topics: erc20Interface.encodeFilterTopics(erc20Interface.events.Transfer, [account, null]),
  })

  return logs.map(log => {
    const decoded = erc20Interface.parseLog(log);
    console.log(decoded)
  })
}

export async function getBalanceChanges(account: string) {
  
}

export async function getEtherBalance(account: string): Promise<number> {
  const balance = await provider.getBalance(account);

  return +formatEther(balance);
}