import { NavLink } from "react-router-dom";
import styled from "styled-components";

export const COLOR_BACKGROUND = '#131415';
export const COLOR_PANEL = '#1C1D1F';
export const COLOR_GREY = '#333436'
export const COLOR_TEXT_SECONDARY = '#A4A5A5';
export const COLOR_TEXT_PRIMARY = '#FFFFFF';
export const COLOR_ACCENT = '#6D8FE9';
export const COLOR_DANGER = '#E68537';
export const COLOR_SUCCESS = '#7CBC61';
export const COLOR_FAILURE = '#CA404B';

export const Panel = styled.div`
  background-color: ${COLOR_PANEL};
  padding: 32px;
  border-radius: 4px;
`

export const Page = styled.div`
  background-color: ${COLOR_BACKGROUND};
  padding: 32px;
  width: 100%;
  height: 100%;
`

export const TitleBig = styled.h1`
  font-size: 42px;
  font-family: 'Roboto', sans-serif;
  color: ${COLOR_TEXT_PRIMARY};
  margin-top: 0;
`

export const TextPrimary = styled.p`
  font-size: 18px;
  font-family: 'Roboto', sans-serif;
  color: ${COLOR_TEXT_PRIMARY};
  margin: 0;
`;

export const TextSecondary = styled.p`
  font-size: 18px;
  font-family: 'Roboto', sans-serif;
  color: ${COLOR_TEXT_SECONDARY};
  text-decoration-color: ${COLOR_TEXT_SECONDARY};
  margin: 0;
`;

export const Spacer = styled.div`
  height: 32px;
`