import React, { Component } from 'react';
import CircularProgress from 'material-ui/CircularProgress';

//Components
import './index.css';

class Index extends Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    render() {
        return (
            <div>
                <h1 style={{marginTop: '100px'}}>GraphQL Designer Coming Soon</h1>
                <CircularProgress size={50} thickness={5} style={{marginTop: '25px', marginBottom: '25px'}}/>
                <br />
                <img src='./images/wireframe.png' style={{width: '95vw'}}/>
            </div>
        )
    }
}

export default Index