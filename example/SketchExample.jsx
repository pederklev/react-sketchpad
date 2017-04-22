import React, { Component } from 'react';
import { SketchPad, TOOL_PENCIL, TOOL_LINE, TOOL_RECTANGLE, TOOL_ELLIPSE } from './../src';



export default class SketchExample extends Component
{
  socket = null;

  constructor(props) {
    super(props);

    this.state = {
      tool:TOOL_PENCIL,
      size: 2,
      color: '#000000',
      fill: false,
      fillColor: '#444444',
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
            width={500}
            height={500}
            animate={true}
            size={size}
            color={color}
            fillColor={fill ? fillColor : ''}
            items={items}
            tool={tool}
          />
        </div>

      </div>
    );
  }
}
