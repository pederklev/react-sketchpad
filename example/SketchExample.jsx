import React, { Component } from 'react';
import { SketchPad, TOOL_PENCIL, TOOL_LINE, TOOL_RECTANGLE, TOOL_ELLIPSE } from './../src';

export default class SketchExample extends Component
{

  constructor(props) {
    super(props);

    this.state = {
      size: 2,
      items: []
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
          />
        </div>
      </div>
    );
  }
}
