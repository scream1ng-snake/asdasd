import { observer } from "mobx-react-lite";
import { FC } from "react";
import Wrapper from "../components/layout/Wrapper";
import { NavBar } from "antd-mobile";
import { Toasts } from "../components";
import { WaitingMasters } from "../components/mainpage/WaitingMasters";
import { Container } from "react-bootstrap";
import { WaitingClients } from "../components/mainpage/WaitingClients";

export const MainPage: FC = observer(() => {
  return <Wrapper>
    <Container className="pt-3">
      <Toasts className="mb-3" />
      <WaitingMasters />
      <WaitingClients />
    </Container>
  </Wrapper>
})