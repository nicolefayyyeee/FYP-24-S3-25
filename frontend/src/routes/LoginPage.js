import styled from "styled-components";
import { AccountBox } from "../containers/accountBox"; 
import Navbar from '../containers/navbar/Navbar'

const AppContainer = styled.div`
  width: 100%;
  padding: 10rem;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

function LoginPage() {
  return (
    <>
      <Navbar /> 
      <AppContainer>
        <AccountBox/>
      </AppContainer>
    </>
  );
}

export default LoginPage;
