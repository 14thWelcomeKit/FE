import { createGlobalStyle } from "styled-components";


const GlobalStyle = createGlobalStyle`
    :root {
        --orange: #FF6000;
        --navy: #002D56;
        --black: #1C1C1C;
        --white: #F9F9F9;
        --gradient: linear-gradient(to bottom, var(--black), var(--navy));
    }

    @media (max-width: 500px){
        .PageContainer {
            flex-direction: column;
            justify-content: center;
        }
    }

`

export default GlobalStyle