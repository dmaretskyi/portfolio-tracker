import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import styled, { createGlobalStyle } from 'styled-components';
import { useLocalStorage } from './hooks/useLocalStorage';
import { COLOR_BACKGROUND, COLOR_TEXT_SECONDARY, Page, Spacer, TextSecondary } from './ui/common';
import { PortfolioPage } from './ui/PortfolioPage';
import { PreferencesPage } from './ui/PrefencesPage';

const GlobalStyle = createGlobalStyle`
  body {
    background-color: ${COLOR_BACKGROUND};
  }
`

function App() {
  const [accounts, setAccounts] = useLocalStorage<string[]>('portfolio-tracker/accounts', [])

  return (
    <BrowserRouter>
      <GlobalStyle/>
      <Page>
        <Navbar>
          <div/>
          <MyLink to="/">
            <TextSecondary>Portfolio</TextSecondary>
          </MyLink>
          <MyLink to="/preferences">
            <TextSecondary>Preferences</TextSecondary>
          </MyLink>
        </Navbar>
        <Spacer/>
        <Routes>
          <Route index element={<PortfolioPage accounts={accounts}/>}/>
          <Route path="/preferences" element={<PreferencesPage accounts={accounts} setAccounts={setAccounts} />}/>
        </Routes>
      </Page>
    </BrowserRouter>
  )
}

const Navbar = styled.div`
  display: grid;
  grid-template-columns: 1fr auto auto;
  grid-column-gap: 16px;
`

const MyLink = styled(Link)`
  text-decoration-color: ${COLOR_TEXT_SECONDARY};
`

export default App
