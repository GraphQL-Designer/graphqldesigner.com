import React from 'react';

const TeamMember = ({ name, photo, GitHub, LinkedIn }) => (
  <div className="team-member">
    <img className="team-member-photo" src={photo} alt="" />
    <h4>{name}</h4>
    <p id="team-title">Software Engineer</p>
    <div className="team-links">
      <a href={GitHub}>
        <img alt="" src="./images/GitHub.png" />
      </a>
      <a href={LinkedIn}>
        <img alt="" src="./images/In-R.png" />
      </a>
    </div>
  </div>
);

export default TeamMember;
