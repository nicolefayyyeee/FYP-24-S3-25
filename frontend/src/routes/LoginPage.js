import styled from "styled-components";
import { AccountBox } from "../containers/accountBox"; 
import Navbar from '../containers/navbar/Navbar'
import Footer from '../containers/footer/Footer'

const AppContainer = styled.div`
  width: 100%;
  height: calc(100vh - 60px);
  background-color: #94a8d1;
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
      <Footer />
    </>
  );
}

export default LoginPage;
