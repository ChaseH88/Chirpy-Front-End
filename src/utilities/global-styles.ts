import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`

  * {
    box-sizing: border-box
  }

  body {
    margin: 0;
    padding: 0;
    font-family: 'Roboto', sans-serif;
    height: 100vh;
  }

  #root {
    height: 100%;

    & > .App {
      height: 100%;
    }
  }
`;
