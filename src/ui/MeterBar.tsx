import styled from "styled-components"
import { COLOR_ACCENT, COLOR_GREY } from "./common"

export interface MeterBarProps {
  value: number;
}  

export const MeterBar: React.FC<MeterBarProps> = ({ value }) => (
  <Background>
    <Bar style={{ width: `${(Math.max(value, 0.05) * 100).toFixed()}%`}}/>
  </Background>
)

const Background = styled.div`
  background-color: ${COLOR_GREY};
  border-radius: 4px;
  height: 10px;
  width: 120px;
`

const Bar = styled.div`
  background-color: ${COLOR_ACCENT};
  border-radius: 4px;
  height: 10px;
`