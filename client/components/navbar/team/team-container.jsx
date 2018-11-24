import React from 'react';
import TeamMember from './team-member.jsx';

// styling
import './team.css';

const Team = () => (
  <div className="team-container">
    <div className="team">
      <div className="team-heading">
        <h3>Meet the Team</h3>
      </div>
      <div className="row">
        <TeamMember
          name="Tsion Adefres"
          photo="./images/Tsion.jpg"
          GitHub="https://github.com/Tsionad"
          LinkedIn="https://www.linkedin.com/in/tadefres/"
        />
        <TeamMember
          name="Patrick Slagle"
          photo="./images/Patrick.jpg"
          GitHub="https://github.com/patrickslagle"
          LinkedIn="https://www.linkedin.com/in/patrickslagle/"
        />
        <TeamMember
          name="James Sieu"
          photo="./images/James.jpg"
          GitHub="https://github.com/jamessieu"
          LinkedIn="https://www.linkedin.com/in/james-sieu/"
        />
        <TeamMember
          name="Greg Shamalta"
          photo="./images/Greg.jpg"
          GitHub="https://github.com/grs83"
          LinkedIn="https://www.linkedin.com/in/gregory-shamalta/"
        />
      </div>
    </div>
  </div>
);


export default Team;
