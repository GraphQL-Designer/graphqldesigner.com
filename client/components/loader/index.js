import React from 'react';

//components
import './loader.css';

const GraphqlLoader = props => {
  return (
    <div class="loader">
        <div  class="hexContainer">
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
  )
};

export default GraphqlLoader;