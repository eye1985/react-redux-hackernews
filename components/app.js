import React,{Component} from 'react';
import Header from './header';
import Footer from './footer';
import ProgressBar from '../components/progress';
import NewsList from '../containers/newsList';
import {Provider} from 'react-redux';
import configureStore from '../store/store';

const store = configureStore();

const SingleNode = (props)=>{
    return (
        <div>
            <ProgressBar />
            <Header />
            <main>
                <NewsList />
            </main>
            <Footer />
        </div>
    )
};

export default class App extends Component{
    render(){
        return (
            <Provider store={store}>
                <SingleNode />
            </Provider>
        )
    };
};
