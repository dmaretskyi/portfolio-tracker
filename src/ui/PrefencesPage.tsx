import { Panel, TextPrimary } from "./common"

export interface PreferencesProps {
  accounts: string[]
  setAccounts: (accounts: string[]) => void
}

export const PreferencesPage = ({accounts, setAccounts}: PreferencesProps) => {
  return (
    <Panel>
      <TextPrimary>Accounts</TextPrimary>
      <button onClick={() => setAccounts([...accounts, ''])}>Add</button>
      {accounts.map((account, index) => (
        <div key={index}>
          <input style={{ width: '500px'}} value={account} onChange={(e) => setAccounts(accounts.map((a, i) => i === index ? e.target.value : a))}/>
          <button onClick={() => setAccounts(accounts.filter((a, i) => i !== index))}>Remove</button>
        </div>
      ))}
    </Panel>
  )
}
