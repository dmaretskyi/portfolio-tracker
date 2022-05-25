import { useState } from "react"
import styled from "styled-components"
import { Panel, TextPrimary, TextSecondary, COLOR_PANEL, COLOR_ACCENT, COLOR_TEXT_PRIMARY, COLOR_TEXT_SECONDARY } from "./common"

export interface PreferencesProps {
  accounts: string[]
  setAccounts: (accounts: string[]) => void
}

export const PreferencesPage = ({ accounts, setAccounts }: PreferencesProps) => {
  const [uri, setUri] = useState('');
  const [accType, setAccType] = useState('');
  return (
    <Panel>
      <TextPrimary style={{ marginBottom: '3vh' }}>
        Accounts
      </TextPrimary>

      {accounts.map((account, index) => (
        <AccountEntry style={index === 0 ? { borderWidth: '1px 0px 1px 0px' } : {}} key={index}>
          {account.split(':')[0]}
          <Button style={{ justifySelf: 'end' }} onClick={() => setAccounts(accounts.filter((a, i) => i !== index))}>Remove</Button>
          <TextSecondary>Address:</TextSecondary> {account.split(':')[1]}
        </AccountEntry>
      ))}

      <AccountEntry>
        <Select onChange={e => setAccType(e.target.value)}>
          <Option value='' >-</Option>
          <Option value='Ethereum:' >Ethereum</Option>
          <Option value='Ftx:'>Ftx</Option>
        </Select>
        <Button style={{ justifySelf: 'end' }} onClick={() => { setAccounts([...accounts, accType + uri]); setAccType(''); setUri('') }}>Add</Button>
        <TextSecondary>{accType !== 'Ftx:' ? 'Address:' : 'API Key:'}</TextSecondary>
        <Input value={uri} onChange={(e) => setUri(e.target.value)} />
        {accType === 'Ftx:' &&
          <>
            <TextSecondary style={{marginTop: '1vh'}}>Secret:</TextSecondary>
            <Input style={{marginTop: '1vh'}} value={uri} onChange={(e) => setUri(e.target.value)} />
          </>
        }
      </AccountEntry>
    </Panel>
  )
}

const AccountEntry = styled.div`
  margin-bottom: 1vh;
  color: ${COLOR_TEXT_PRIMARY};
  display: grid;
  grid-template-columns: auto auto;
  width: 40vw;
  border-style: solid;
  border-width: 0px 0px 1px 0px;
  border-color: ${COLOR_TEXT_SECONDARY};
  padding: 0.5vw 1vw 0.5vw 1vw;
`

const Input = styled.input`
  width: 400px;
  font-size: 1.5vh;
  color: ${COLOR_TEXT_PRIMARY};
  background-color: ${COLOR_PANEL};
  border-width: 0px 0px 1px 0px;
  border-color: ${COLOR_TEXT_SECONDARY};
`

const Select = styled.select`
  width: 100px;
  font-size: 1.5vh;
  padding: 0.5vh 1vh 0.5vh 0vh ;
  color: white;
  background-color: transparent;
  border-width: 0px 0px 1px 0px;
  border-color: ${COLOR_TEXT_SECONDARY};
  margin-bottom: 1vh;
`

const Option = styled.option`
  color: ${COLOR_TEXT_PRIMARY};
  background-color: ${COLOR_PANEL};
`

const Button = styled.button`
  font-size: 1.5vh;
  padding: 0.5vh 1vh 0.5vh 1vh ;
  color: ${COLOR_ACCENT};
  background-color: transparent;
  border-color: transparent;
  margin-left: 1vh;
  cursor: pointer;
`
