import styled from 'styled-components';
import { PortfolioData } from '../core';
import { formatUsd, shortenAccountId } from './formatting';
import { AssetTableRow } from './AssetTableRow';
import { COLOR_GREY, Panel, TextPrimary, TextSecondary, TitleBig } from './common';
import { NetWorthChart } from './NetWorthChart';

export interface PortfolioProps {
  data: PortfolioData
}

export const Portfolio = ({ data }: PortfolioProps) => (
  <>
    <Panel>
      <TitleBig>{formatUsd(data.totalValue)}</TitleBig>
      <TextSecondary>net worth</TextSecondary>
      <NetWorthChart data={data.history} />
    </Panel>
    <Spacer/>
    <Panel>
      <TextPrimary>Assets</TextPrimary>
      <Spacer/>
      <AssetTableHeader>
        <TextSecondary style={{ gridColumn: 'span 2' }}>Asset</TextSecondary>
        <TextSecondary>Price</TextSecondary>
        <TextSecondary>Allocation</TextSecondary>
        <TextSecondary style={{ marginLeft: 'auto' }}>Balance</TextSecondary>
        <TextSecondary style={{ marginLeft: 'auto' }}>Value</TextSecondary>
      </AssetTableHeader>
      {data.assets.map(asset => (
        <AssetTableRow key={asset.tokenId} asset={asset}/>
      ))}
    </Panel>
    <Spacer/>
    <Panel>
      <TextPrimary>Other accounts</TextPrimary>
      <Spacer/>
      <AccountTableHeader>
      <TextSecondary>Ticker</TextSecondary>
      <TextSecondary>Platform</TextSecondary>
      <TextSecondary>account</TextSecondary>
      <TextSecondary style={{ marginLeft: 'auto' }}>Balance</TextSecondary>
      </AccountTableHeader>
      {data.unrecognized.map(account => (
        <AccountTableRow key={`${account.platformId}-${account.ticker}`}>
          <TextPrimary>{account.ticker}</TextPrimary>
          <TextSecondary>{account.platformId}</TextSecondary>
          <TextSecondary>{shortenAccountId(account.accountId)}</TextSecondary>
          <Balance>{account.balance.toFixed(3)} {account.ticker}</Balance>
        </AccountTableRow>
      ))}
    </Panel>
  </>
)

const AssetTableHeader = styled.div`
  display: grid;
  grid-template-columns: 24px 1fr 1fr 2fr 1fr 1fr;
  grid-gap: 1rem;
  align-items: baseline;
  margin-bottom: 1rem;
  border-top: 1px solid ${COLOR_GREY};
  border-bottom: 1px solid ${COLOR_GREY};
  padding: 4px 32px;
  margin: 0px -32px 16px -32px;
`

const AccountTableRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 2fr;
  grid-gap: 1rem;
  align-items: baseline;
  margin-bottom: 1rem;
`

const AccountTableHeader = styled(AccountTableRow)`
  border-top: 1px solid ${COLOR_GREY};
  border-bottom: 1px solid ${COLOR_GREY};
  padding: 4px 32px;
  margin: 0px -32px 16px -32px;
`

const Balance = styled(TextSecondary)`
  display: block;
  margin-left: auto;
`

const Value = styled(TextPrimary)`
  display: block;
  margin-left: auto;
`

const Spacer = styled.div`
  height: 32px;
`