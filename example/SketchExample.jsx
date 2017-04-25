import React, { Component } from 'react';
import { SketchPad } from './../src';

export default class SketchExample extends Component {
  constructor(props) {
    super(props);

    this.state = {
      size: 0.5,
    };
  }

  render() {
    const { size, items } = this.state;
    return (
      <div>
        <SketchPad size={size} items={items} />
      </div>
    );
  }
}
