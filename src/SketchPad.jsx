import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import { Pencil } from './tools';
import PropTypes from 'proptypes';

export default class SketchPad extends Component {
  tool = null;
  drawing = false;
  points = [];

  static propTypes = {
    width: PropTypes.number,
    height: PropTypes.number,
    canvasClassName: PropTypes.string,
    color: PropTypes.string,
    size: PropTypes.number,
  };

  static defaultProps = {
    width: 600,
    height: 500,
    color: '#000',
    size: 5,
    fillColor: '',
    canvasClassName: 'canvas',
  };

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.canvas = findDOMNode(this.canvasRef);
    this.ctx = this.canvas.getContext('2d');
    this.tool = Pencil(this.ctx);
  }

  onMouseDown = e => {
    this.drawing = true;
  };

  onMouseMove = e => {
    let position = this.getCursorPosition(e);
    console.log(position);
    this.drawing && this.points.push(position);
    this.drawing && console.log(this.points);
  };

  onMouseUp = e => {
    this.drawing = false;
    this.points = [];
  };

  getCursorPosition(e) {
    const { top, left } = this.canvas.getBoundingClientRect();
    return [e.clientX - left, e.clientY - top];
  }

  render() {
    const { width, height, canvasClassName } = this.props;

    return (
      <div>
        <canvas
          ref={canvas => {
            this.canvasRef = canvas;
          }}
          className={canvasClassName}
          onMouseDown={this.onMouseDown}
          onMouseMove={this.onMouseMove}
          onMouseOut={this.onMouseUp}
          onMouseUp={this.onMouseUp}
          width={width}
          height={height}
        />

      </div>
    );
  }
}
