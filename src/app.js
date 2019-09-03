import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import AppRouter, {history} from './routers/AppRouter';// here we access the history
import configureStore from './store/configureStore';
import { startSetExpenses } from './actions/expenses';
import { login,logout } from './actions/auth';
import getVisibleExpenses from './selectors/expenses';
import 'normalize.css/normalize.css';
import './styles/styles.scss';
import 'react-dates/lib/css/_datepicker.css';
import {firebase} from './firebase/firebase';




const store = configureStore();

const jsx = (
    <Provider store = {store}>
     <AppRouter />
    </Provider>  
);

let hasRendered = false;
const renderApp = () =>{
    if(!hasRendered) {
        ReactDOM.render(jsx, document.getElementById('app'));
        hasRendered = true;
    }
}

ReactDOM.render(<p>Loading...</p>, document.getElementById('app'));




//here we cant use .history props cause this is not bonded by router
// so instead we need to install a new module called npm history
// details are shown in approuter file
firebase.auth().onAuthStateChanged((user)=>{
    if(user) {
        store.dispatch(login(user.uid));
        // console.log('uid',user.uid);
        store.dispatch(startSetExpenses()).then(()=>{
            renderApp();
            if(history.location.pathname === '/'){
                history.push('/dashboard')
            }
        })
    }else{
        store.dispatch(logout());
        renderApp();
        history.push('/');
    }
});
// this callback function in on AuthStateChange is runs every time the auth states changes
// like from authenticated to unauthenticated or unauth to auth...