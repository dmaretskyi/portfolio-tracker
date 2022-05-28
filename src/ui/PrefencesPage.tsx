import { useState } from "react"
import styled from "styled-components"
import { Panel, TextPrimary, TextSecondary, COLOR_PANEL, COLOR_ACCENT, COLOR_TEXT_PRIMARY, COLOR_TEXT_SECONDARY, COLOR_FAILURE } from "./common"

export interface PreferencesProps {
  accounts: string[]
  setAccounts: (accounts: string[]) => void
}

export const PreferencesPage = ({ accounts, setAccounts }: PreferencesProps) => {
  const [uri, setUri] = useState('');
  const [secret, setSecret] = useState('');
  const [accType, setAccType] = useState('Ethereum:');
  const [problem, setProblem] = useState(false);

  const handleAddAccount = () => {
    console.log(accType)
    switch (accType) {
      case 'Ethereum:':
        if (!(/0x[a-fA-F0-9]{40}/.test(uri))) {
          setProblem(true);
          break;
          //TODO
        }
        setAccounts([...accounts, accType + uri]);
        setAccType('');
        setUri('');
        setProblem(false);
        break;
      case "Ftx:":
        if (!uri || !secret) {
          setProblem(true);
          break;
          //TODO
        }
        setAccounts([...accounts, accType + uri+ "?secret=" + secret]);
        setAccType('');
        setUri('');
        setSecret('');
        setProblem(false);
        break;

    }

  }

  return (
    <Panel>
      <TextPrimary style={{ marginBottom: '3vh' }}>
        Accounts
      </TextPrimary>

      {accounts.map((account, index) => (
        <AccountEntry style={index === 0 ? { borderWidth: '1px 0px 1px 0px' } : {}} key={index}>
          {account.split(':')[0]}
          <Button style={{ justifySelf: 'end' }} onClick={() => setAccounts(accounts.filter((a, i) => i !== index))}>Remove</Button>
          <TextSecondary>Address:</TextSecondary> {account.split(':')[1].split('?')[0]}
          {account.split(':')[0] === "Ftx" && <><TextSecondary>Secret:</TextSecondary> {account.split(':')[1].split('=')[1]}</>}
        </AccountEntry>
      ))}

      <AccountEntry>
        <Select onChange={e => setAccType(e.target.value)}>
          <Option value='Ethereum:' >Ethereum</Option>
          <Option value='Ftx:'>Ftx</Option>
        </Select>
        <Button style={{ justifySelf: 'end' }} onClick={() => handleAddAccount()}>Add</Button>
        <TextSecondary>{accType !== 'Ftx:' ? 'Address:' : 'API Key:'}</TextSecondary>
        <Input value={uri} style={{borderColor: problem ? COLOR_FAILURE : COLOR_TEXT_SECONDARY }} onChange={(e) => setUri(e.target.value)} />
        {accType === 'Ftx:' &&
          <>
            <TextSecondary style={{ marginTop: '1vh' }}>Secret:</TextSecondary>
            <Input style={{ marginTop: '1vh', borderColor: problem ? COLOR_FAILURE : COLOR_TEXT_SECONDARY }} value={secret} onChange={(e) => setSecret(e.target.value)} />
          </>
        }
        {problem && <Alert>Invalid address</Alert>}
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
  font-size: 18px;
  color: ${COLOR_TEXT_PRIMARY};
  background-color: ${COLOR_PANEL};
  border-width: 0px 0px 1px 0px;
  border-color: ${COLOR_TEXT_SECONDARY};
`

const Select = styled.select`
  width: 120px;
  font-size: 18px;
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
  font-size: 18px;
  padding: 0.5vh 1vh 0.5vh 1vh ;
  color: ${COLOR_ACCENT};
  background-color: transparent;
  border-color: transparent;
  margin-left: 1vh;
  cursor: pointer;
`

const Alert = styled.p`
  justify-self: center;
  color: ${COLOR_FAILURE};
`
