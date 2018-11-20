import React from 'react';

const TeamMember = props => {
  return (
    <div className="team-member">
      <img className="team-member-photo" src={props.photo} alt=""/>
      <h4>{props.name}</h4>
      <p id="team-title">Software Engineer</p>
        <div className="team-links">
          <a href={props.GitHub} target="_blank">
            <img src="./images/GitHub.png" />
          </a>
          <a href={props.LinkedIn} target="_blank">
            <img src="./images/In-R.png" />
          </a>
        </div>
    </div>
  )
}

export default TeamMember;