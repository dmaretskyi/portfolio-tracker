import { useState } from 'react';
import styled from 'styled-components';
import { AssetData } from "../core";
import { formatPercent, formatUsd, shortenAccountId } from './formatting';
import { TextPrimary, TextSecondary } from './common';
import { MeterBar } from './MeterBar';


export interface AssetTableRowProps {
  asset: AssetData
}  

export const AssetTableRow = ({ asset }: AssetTableRowProps) => {
  const [expanded, setExpanded] = useState(false);
  return (
    <>
      <Container onClick={() => setExpanded(expanded => !expanded)}>
        <TokenIcon src={asset.logoURI} />
        <TextPrimary>{asset.name}</TextPrimary>
        <TextSecondary>{formatUsd(asset.price)}</TextSecondary>
        <AllocationPercentage>{formatPercent(asset.allocation)}</AllocationPercentage>
        <MeterBar value={asset.allocation}/>
        <Balance>{asset.balance.toFixed(3)} {asset.ticker}</Balance>
        <Value>{formatUsd(asset.value)}</Value>
      </Container>
      {expanded && (
        <div>
          {asset.accounts.map(account => (
            <AccountTableRow key={`${account.platformId}-${account.accountId}`}>
              <TextSecondary style={{ gridColumn: 3 }}>{account.platformId}</TextSecondary>
              <TextSecondary style={{ marginLeft: 'auto' }}>{shortenAccountId(account.accountId)}</TextSecondary>
              <Balance>{account.balance.toFixed(3)} {asset.ticker}</Balance>
            </AccountTableRow>
          ))}
        </div>
      )}
    </>
  )
}


const Container = styled.div`
  display: grid;
  grid-template-columns: 24px 1fr 1fr 0.5fr 1.5fr 1fr 1fr;
  grid-gap: 1rem;
  align-items: baseline;
  margin-bottom: 1rem;
  cursor: pointer;
`

const AccountTableRow = styled.div`
  display: grid;
  grid-template-columns: 24px 1fr 1fr 2fr 1fr 1fr;
  grid-gap: 1rem;
  align-items: baseline;
  margin-bottom: 1rem;
`

const TokenIcon = styled.img`
  width: 24px;
  height: 24px;
  position: relative;
  top: 5px;
`

const AllocationPercentage = styled(TextSecondary)`
  display: block;
  margin-left: auto;
`

const Balance = styled(TextSecondary)`
  display: block;
  margin-left: auto;
`

const Value = styled(TextPrimary)`
  display: block;
  margin-left: auto;
`
