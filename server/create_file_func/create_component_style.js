function buildComponentStyle() {
    let query = `
* {
    margin: 0; 
    padding: 0; 
    font-family: "Roboto", sans-serif
}

a {
    color: #EB38A5;
}

.pageWrapper {
    height: 100vh;
    width: 100vw;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: #2a2e33; 
    color: white; 
}
    
.loader {
    position: relative;
    height: 100px;
    width: 100px;
}

.introContainer {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.hexContainer{
    position: relative;
    top: 27.5px;
    -webkit-animation: spin 2.5s ease-in-out infinite;
    animation: spin 2.5s ease-in-out infinite;
}

.hex {
    width: 80px;
    height: 45px;
    background:#EB38A5;
    margin: auto auto;
    position: relative;
}

.hex:before, .hex:after {
    content: "";
    position: absolute;
    width: 0;
    height: 0;
}

.hex:before {
    top: -24px;
    left: 0;
    border-left: 40px solid transparent;
    border-right: 40px solid transparent;
    border-bottom: 25px solid#EB38A5;
}

.hex:after {
    bottom: -24px;
    left: 0;
    border-left: 40px solid transparent;
    border-right: 40px solid transparent;
    border-top: 25px solid #EB38A5;
}

.inner {
    background-color:#2a2e33;
    -webkit-transform: scale(.86, .86);
    -moz-transform: scale(.86, .86);
    transform: scale(.86, .86);
    z-index:1;
}

.inner:before {
    border-bottom: 25px solid #2a2e33;
}

.inner:after {
    border-top: 25px solid #2a2e33;
} 

.triangleContainer {
    position: absolute;
    top: 0px;
}
.triangle {
    display: inline-block;
    height: 15px;
    position: absolute;
    top: -4px;
    left: 15px;
    z-index: 3;
    border-bottom: solid 59px #EB38A5;
    border-right: solid 35px transparent;
    border-left: solid 35px transparent;
}

.triangleInner {
    display: inline-block;
    height: 15px;
    position: absolute;
    top: 11px;
    left: -24px;
    z-index: 4;
    border-bottom: solid 42px #2a2e33;
    border-right: solid 24px transparent;
    border-left: solid 24px transparent;
}
    
.ballContainer {
    position: absolute;
    top: 7px;
    left: 7px;
    z-index: 5;
    height: 86px;
    width: 86px;
    border-radius: 50%;
    -webkit-animation: spin 2.5s ease-in-out 1s infinite;
    /* animation: spin 2.5s ease-in-out 1s infinite; */
    animation: shrink 2.5s ease-in-out infinite;
}

.balls {
    height: 86px;
    width: 86px;
    border-radius: 50%;
    position: absolute;
    z-index: 6;
}

.balls:after {
    content: "";
    height: 20px;
    width: 20px;
    border-radius: 50%;
    background-color: #EB38A5;
    position: relative;
    display: block;
}

.ball1:after {
    left: -2px;
    top: 14px;
}

.ball2:after {
    left: 33px;
    top: -8px;
}

.ball3:after {
    left: 70px;
    top: 14px;
}

.ball4:after {
    left: 70px;
    top: 53px;
}

.ball5:after {
    left: 33px;
    top: 75px;
}

.ball6:after {
    left: -2px;
    top: 53px;
}

@-webkit-keyframes spin {
    0% {
    -webkit-transform: rotate(0deg);
            transform: rotate(0deg);
    }
    100% {
    -webkit-transform: rotate(360deg);
            transform: rotate(360deg);
    }
}

@keyframes spin {
    0% {
    -webkit-transform: rotate(0deg);
            transform: rotate(0deg);
    }
    100% {
    -webkit-transform: rotate(360deg);
            transform: rotate(360deg);
    }
}

@-webkit-keyframes shrink {
    0% {
    -webkit-transform: scale(1);
            transform: scale(1);
    }
    50% {
    -webkit-transform: scale(0.2);
            transform: scale(0.2);
    }
    100% {
    -webkit-transform: scale(1);
            transform: scale(1);
    }
}

@keyframes shrink {
    0% {
    -webkit-transform: scale(1);
            transform: scale(1);
    }
    50% {
    -webkit-transform: scale(0.2);
            transform: scale(0.);
    }
    100% {
    -webkit-transform: scale(1);
            transform: scale(1);
    }
}

.colorsContainer {
    position: relative;
    width: 300px;
    height: 50px;
    background-color: rgb(54, 58, 66);
}

.backBox {
    position: absolute;
    top: 5px;
    left: 5px;
    width: 290px;
    height: 40px;
    background-color: transparent;
}

.frontBox {
    position: absolute;
    top: 5px;
    left: 5px;
    width: 290px;
    height: 40px;
    background-image: linear-gradient(-45deg, transparent, transparent, transparent, transparent, transparent, transparent, transparent, transparent,transparent, transparent, transparent, transparent,transparent, transparent, transparent, transparent, transparent, transparent, transparent, transparent, transparent, transparent, transparent, transparent, transparent, dodgerblue, transparent, crimson, transparent, transparent, transparent);
}
`;
    return query;
}
  
module.exports = buildComponentStyle;