import React from 'react';
import Events from './components/Events.js';
import EventPage from './components/EventPage.js';
import Checkout from './components/Checkout.js';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

const App = () => {
    return (
        <Router>
            <div>
                <Switch>
                    <Route path="/" exact component={Events}/>
                    <Route path="/event" component={EventPage}/>
                    <Route path="/checkout" component={Checkout}/>
                </Switch>
            </div>
        </Router>
    )
}

export default App
