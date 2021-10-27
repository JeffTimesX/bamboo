import React from 'react';
import { Container } from 'react-bootstrap';
import { Switch, Route } from 'react-router-dom'
import { NavBar } from './components';
import { Home, Profile, TickerDetail, user as userData} from './views';

export default function App() {


  return (
    <div className="d-flex flex-column mh-100 bg-secondary pb-5" >
      <NavBar />
      <Container >
        <div className="mt-3 pe-1 ps-1">
          <Switch>
            <Route path="/" exact component= {Home} />
            <Route path="/portfolio" component= {NavBar} />
            <Route path="/watches" component= {NavBar} />
            <Route path="/profile">
              <Profile user={userData} />
            </Route>
            <Route path="/ticker-detail" component= {TickerDetail} />
          </Switch>
        </div>
      </Container>
    </div>
  )
}