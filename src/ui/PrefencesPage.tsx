import { useState } from "react"
import styled from "styled-components"
import { Panel, TextPrimary, TextSecondary, COLOR_PANEL, COLOR_ACCENT, COLOR_TEXT_PRIMARY, COLOR_TEXT_SECONDARY, COLOR_FAILURE } from "./common"

export interface PreferencesProps {
  accounts: string[]
  setAccounts: (accounts: string[]) => void
}

enum AccountType {
  ETHEREUM,
  FTX
}

export const PreferencesPage = ({ accounts, setAccounts }: PreferencesProps) => {
  const [path, setPath] = useState('');
  const [secret, setSecret] = useState('');
  const [accountType, setAccountType] = useState(AccountType.ETHEREUM);
  const [hasError, setHasError] = useState(false);

  const handleAddAccount = () => {
    console.log(accountType)
    switch (accountType) {
      case AccountType.ETHEREUM:
        if (!(/0x[a-fA-F0-9]{40}/.test(path))) {
          setHasError(true);
          break;
        }
        setAccounts([...accounts, `Ethereum:${path}`]);
        setAccountType(AccountType.ETHEREUM);
        setPath('');
        setHasError(false);
        break;
      case AccountType.FTX:
        if (!path || !secret) {
          setHasError(true);
          break;
        }
        setAccounts([...accounts, `Ftx:${path}?secret=${secret}`]);
        setAccountType(AccountType.ETHEREUM);
        setPath('');
        setSecret('');
        setHasError(false);
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
          {new URL(account).protocol === 'ethereum:' ? 'Ethereum' : "Ftx"}
          <Button style={{ justifySelf: 'end' }} onClick={() => setAccounts(accounts.filter((a, i) => i !== index))}>Remove</Button>
          <TextSecondary>{new URL(account).protocol === 'ethereum:' ? 'Address:' : 'API key'}</TextSecondary> {new URL(account).pathname}
          {new URL(account).protocol === "ftx:" && <><TextSecondary>Secret:</TextSecondary> {new URL(account).searchParams.get('secret')}</>}
        </AccountEntry>
      ))}

      <AccountEntry>
        <Select onChange={e => setAccountType(e.target.value === 'Ftx' ? AccountType.FTX : AccountType.ETHEREUM)}>
          <Option value='Ethereum' >Ethereum</Option>
          <Option value='Ftx'>Ftx</Option>
        </Select>
        <Button style={{ justifySelf: 'end' }} onClick={() => handleAddAccount()}>Add</Button>
        <TextSecondary>{accountType !== AccountType.FTX ? 'Address:' : 'API Key:'}</TextSecondary>
        <Input value={path} style={{ borderColor: hasError ? COLOR_FAILURE : COLOR_TEXT_SECONDARY }} onChange={(e) => setPath(e.target.value)} />
        {accountType === AccountType.FTX &&
          <>
            <TextSecondary style={{ marginTop: '1vh' }}>Secret:</TextSecondary>
            <Input style={{ marginTop: '1vh', borderColor: hasError ? COLOR_FAILURE : COLOR_TEXT_SECONDARY }} value={secret} onChange={(e) => setSecret(e.target.value)} />
          </>
        }
        {hasError && <Alert>Invalid address</Alert>}
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
