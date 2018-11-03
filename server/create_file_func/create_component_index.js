function buildComponentIndex() {
    let query = `import React, { Component } from 'react';

// Styling
import './index.css';

// Components


class Index extends Component {
    constructor(props) {
    super(props);
    this.state = {};
    }

    render() {
        return (
            <div class="pageWrapper">
                <div class="introContainer">
                    <div class="loader">
                        <div class="hexContainer">
                            <div class="hex">
                                <div class="hex inner"></div>
                            </div>
                        </div>
                        <div class="triangleContainer">
                            <div class="triangle">
                                <div class="triangleInner"></div>
                            </div>
                        </div>
                        <div class="ballContainer">
                            <div class="balls ball1"></div>
                            <div class="balls ball2"></div>
                            <div class="balls ball3"></div>
                            <div class="balls ball4"></div>
                            <div class="balls ball5"></div>
                            <div class="balls ball6"></div>
                        </div>
                    </div>
                    <h1>Thanks For Using GraphQL Designer!</h1>
                    <p>Please star us on GitHub to show the love! Also include any bugs for us to work on during this growing period. Link below!</p>
                    <a href="https://github.com/GraphQL-Designer/graphqldesigner.com" target="blank">GraphQL Designer Github</a>
                </div>
            </div>
        );
    }
}

export default Index;
`;
    return query;
}
  
module.exports = buildComponentIndex;