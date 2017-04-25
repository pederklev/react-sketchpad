import React, { Component } from 'react';
import { SketchPad } from './../src';

export default class SketchExample extends Component {
  constructor(props) {
    super(props);

    this.state = {
      size: 0.5,
      imgNr: 0,
      imgSrc: '',
      items: [],
      writeInt: 0,
    };
  }

  componentDidMount(){
    this._getImg()
  }

  _getImg = () => {
    const totImg = 65;

    let nextImgNr = Math.floor(Math.random() * totImg + 1);
    let nextImgSrc = `./refs/img${nextImgNr}.png`;

    this.setState({ imageNr: nextImgNr, imgSrc: nextImgSrc });
  };

  writeImgButton = () => {
    this.setState(state => state.writeInt++);
    console.log(this.state.writeInt);
  }

  render() {
    const { size, items } = this.state;
    return (
      <div>
        <div style={{ float: 'left', marginRight: 20 }}>
          <SketchPad size={size} items={items} image={this.state.imgSrc} writeImg={this.state.writeInt} />
          <button style={{width: 250, height: 100, alignSelf: 'center'}} onClick={() => this._getImg()}>next image</button>
          <button style={{width: 130, height: 50, alignSelf: 'center'}} onClick={() => this.writeImgButton()}>make me an image</button>
        </div>
      </div>
    );
  }
}
