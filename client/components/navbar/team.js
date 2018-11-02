import React from 'react';

// styling
import './team.css';

class Team extends React.Component {
  render() {
    return (
      <div className="team-container">
        <div className="team">
          <div className="team-heading">
            <h3>Meet the Team</h3>
          </div>
        <div className='row'>
        <div className="team-member">
          <h4>Tsion Adefres</h4>
          <p className="text-muted">Software Engineer</p>
          <div className="team-links">
            <a href="https://github.com/Tsionad" target="_blank">
                  <img src="../../../public/images/GitHub.png" />
                </a>
            <a href="https://www.linkedin.com/in/tadefres/" target="_blank">
                  <img src="../../../public/images/In-R.png" />
                </a>
          </div>
        </div>
          <div className="team-member">
          <h4>Greg Shamalta</h4>
          <p className="text-muted">Software Engineer</p>
          <div className="team-links">
            <a href="https://github.com/grs83" target="_blank">
                  <img src="../../../public/images/GitHub.png" />
                </a>

            <a
                  href="https://www.linkedin.com/in/gregory-shamalta/"
                  target="_blank"
                >
                  <img src="../../../public/images/In-R.png" />
                </a>
          </div>
        </div>
          <div className="team-member">
          <h4>James Sieu</h4>
          <p className="text-muted">Software Engineer</p>
          <div className="team-links">

            <a href="https://github.com/jamessieu" target="_blank">
                  <img src="../../../public/images/GitHub.png" />
                </a>
            <a
                  href="https://www.linkedin.com/in/james-sieu/"
                  target="_blank"
                >
                  <img src="../../../public/images/In-R.png" />
                </a>
          </div>
        </div>
          <div className="team-member">
          <h4>Patrick Slagle</h4>
          <p className="text-muted">Software Engineer</p>
          <div className="team-links">
            <a href="https://github.com/patrickslagle" target="_blank">
                  <img src="../../../public/images/GitHub.png" />
                </a>
            <a href="https://www.linkedin.com/in/patrickslagle/" target="_blank">
                  <img src="../../../public/images/In-R.png" />
                </a>
          </div>
        </div>
        </div>
        </div>
      </div>
    );
  }
}

export default Team;
