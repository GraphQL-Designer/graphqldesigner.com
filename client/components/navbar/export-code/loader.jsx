import React from 'react';
import './loader.css';

const Loader = () => (
  <div className="overlay">
    <div>
      <h2 style={{ color: 'white' }}>Creating Your Code!</h2>
      <div className="loader">
        <div className="hexContainer">
          <div className="hex">
            <div className="hex inner" />
          </div>
        </div>
        <div className="triangleContainer">
          <div className="triangle">
            <div className="triangleInner" />
          </div>
        </div>
        <div className="ballContainer">
          <div className="balls ball1" />
          <div className="balls ball2" />
          <div className="balls ball3" />
          <div className="balls ball4" />
          <div className="balls ball5" />
          <div className="balls ball6" />
        </div>
      </div>
    </div>
  </div>
);

export default Loader;
