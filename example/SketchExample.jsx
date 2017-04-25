import React, { Component } from 'react';
import { SketchPad } from './../src';

export default class SketchExample extends Component {
  constructor(props) {
    super(props);

    this.state = {
      size: 0.5,
      imgNr: 0,
      imgSrc: 'http://blog.clubcarlson.com/wp-content/uploads/2014/04/shutterstock_129314522-1024x876.jpg',
      items: [],
    };
  }

  _getImg = () => {
    const lastImg = 65;

    let nextImgNr = Math.floor(Math.random() * lastImg + 1);
    let nextImgSrc = `./refs/img${nextImgNr}.png`;

    this.setState({ imageNr: nextImgNr, imgSrc: nextImgSrc });
  };

  render() {
    const { size, items } = this.state;
    return (
      <div>
        <div style={{ float: 'left', marginRight: 20 }}>
          <SketchPad size={size} items={items} image={this.state.imgSrc} />
          <button style={{width: 50, height: 50, alignSelf: 'center'}} onClick={() => this._getImg()}>inc</button>
        </div>
      </div>
    );
  }
}
