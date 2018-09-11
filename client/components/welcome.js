import React, { Component } from 'react';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import ActionAndroid from 'material-ui/svg-icons/action/android';
import RaisedButton from 'material-ui/RaisedButton';
import FontIcon from 'material-ui/FontIcon';
import FlatButton from 'material-ui/FlatButton';
// import Button from 'material-ui/Buttons';

//Components
import './index.css';

// const styles = {
//   card: {
//     maxWidth: 500,
//   },
//   media: {
//     height: 150,
//   },
// };

// const {classes } = props;

class WelcomeBox extends Component {
  render() {
    return(
      <div>
        <Card>
          <CardTitle title="GraphQL Designer" subtitle="Simply create and implement a full stack React GraphQL app" />
          <CardHeader
            avatar="https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/GraphQL_Logo.svg/2000px-GraphQL_Logo.svg.png"
          />
          {/* <CardMedia>
            <img src="https://amandeepmittal.gallerycdn.vsassets.io/extensions/amandeepmittal/expressjs/2.0.0/1509881293872/Microsoft.VisualStudio.Services.Icons.Default" />
          </CardMedia> */}
          <CardHeader
            avatar="https://amandeepmittal.gallerycdn.vsassets.io/extensions/amandeepmittal/expressjs/2.0.0/1509881293872/Microsoft.VisualStudio.Services.Icons.Default"
          />
          <CardText>
            Select Database Type
          </CardText>
          <CardActions>
            <RaisedButton label="MongoDB" />}/>
            <RaisedButton label="SQL" />
          </CardActions>
        </Card>
      </div>
    )
  }
}

export default WelcomeBox;