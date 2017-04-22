import React, { Component } from 'react';
import { SketchPad, TOOL_PENCIL, TOOL_LINE, TOOL_RECTANGLE, TOOL_ELLIPSE } from './../src';



export default class SketchExample extends Component
{
  socket = null;

  constructor(props) {
    super(props);

    this.state = {
      size: 2,
      items: []
    }
  }


  render() {
    const { tool, size, color, fill, fillColor, items } = this.state;
    console.log(this.state);
    return (
      <div>
        <h1>React SketchPad</h1>
        <div style={{float:'left', marginRight:20}}>
          <SketchPad
            size={size}
            items={items}
          />
        </div>

      </div>
    );
  }
}
