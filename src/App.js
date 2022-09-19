import './App.css';
import {BrowserRouter as Router, Redirect, Route, Switch} from 'react-router-dom';
import ProductAdd from "./ProductAdd";
import ProductEdit from "./ProductEdit";
import Products from "./Products";

function App() {
    return (
        <Router>
            <Switch>
                <Route exact path="/">
                    <Redirect to="/products"/>
                </Route>
                <Route exact path="/products">
                    <Products/>
                </Route>
                <Route path="/products/create">
                    <ProductAdd/>
                </Route>
                <Route path="/products/edit/:id">
                    <ProductEdit/>
                </Route>
            </Switch>
        </Router>
    );
}

export default App;
