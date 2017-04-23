import React, { Component } from 'react';
import { SketchPad, TOOL_PENCIL, TOOL_LINE, TOOL_RECTANGLE, TOOL_ELLIPSE } from './../src';

const imageSrc = [
  'https://s-media-cache-ak0.pinimg.com/236x/d7/b3/cf/d7b3cfe04c2dc44400547ea6ef94ba35.jpg',
  'http://r.ddmcdn.com/s_f/o_1/APL/uploads/2014/08/penguin-emperor-little-debbie-2600w.jpg',
  'http://www.stateofdigital.com/wp-content/uploads/2016/09/Penguin.jpg',
];

export default class SketchExample extends Component
{

  constructor(props) {
    super(props);

    this.state = {
      size: .5,
      items: [],
      imageNr: 0,
    }
  }



  render() {
    const { size, items } = this.state;
    return (
      <div>
        <div style={{float:'left', marginRight:20}}>
          <SketchPad
            size={size}
            items={items}
            image={imageSrc[this.state.imageNr]}
          />
          <button onClick={()=> this.setState(state => state.imageNr++)}>inc</button>
        </div>
      </div>
    );
  }
}
