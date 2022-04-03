import { queryData } from "../core";
import { useAsync } from "../hooks/useAsync";
import { TextPrimary, TextSecondary } from "./common";
import { Portfolio } from "./Portfolio";

export interface PortfolioPageProps {
  accounts: string[]
}

export const PortfolioPage = ({ accounts }: PortfolioPageProps) => {
  const { value: data, loading, error } = useAsync(() => queryData(accounts));

  return (
    <>
      {data && <Portfolio data={data} />}
      {loading && <TextSecondary>Loading...</TextSecondary>}
      {error && <TextPrimary><pre>{error.stack}</pre></TextPrimary>}
    </>
  )
}