import React from 'react';
import './loader.css';

const Loader = props => {
  return (
    <div className="overlay">
      <div> 
        <h2 style={{ color: 'white' }}>Creating Your Code!</h2>

        <div className="loader">
          <div  className="hexContainer">
              <div className="hex">
                  <div className="hex inner"></div>
              </div>
          </div>
          <div className="triangleContainer">
              <div className="triangle">
                  <div className="triangleInner"></div>
              </div>
          </div>
          <div className="ballContainer">
              <div className="balls ball1"></div>
              <div className="balls ball2"></div>
              <div className="balls ball3"></div>
              <div className="balls ball4"></div>
              <div className="balls ball5"></div>
              <div className="balls ball6"></div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Loader;