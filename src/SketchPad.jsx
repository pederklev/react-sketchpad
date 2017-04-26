import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';

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

    this.ctx.lineWidth = 2;
    this.ctx.lineJoin = 'round';
    this.ctx.lineCap = 'round';
    this.ctx.strokeStyle = 'rgb(60,60,60)';
  }

  // Ikke brukt ennå
  midPoint = (p1, p2) => {
    return [(p1[0] + p2[0]) / 2, (p1[1] + p2[1]) / 2];
  };

  onMouseDown = e => {
    this.drawing = true;

    let position = this.getCursorPosition(e);
    this.points.push(position);
  };

  onMouseMove = e => {
    if (!this.drawing) return;

    let position = this.getCursorPosition(e);

    if (this.points.length > 0) {
      this.points.push(this.midPoint(position, this.points[this.points.length - 1]));
    }

    this.points.push(position);

    let length = this.points.length;
    this.ctx.beginPath();

    if (length > 4) {
      this.ctx.moveTo(...this.points[length - 4]);
      this.ctx.quadraticCurveTo(...this.points[length - 3], ...this.points[length - 2]);
      this.ctx.stroke();
    }

    // if (this.points.length > 1) {
    //   let start = this.points.length - 2;
    //   let end = this.points.length - 1;

    //   this.ctx.beginPath();
    //   this.ctx.moveTo(this.points[start].x, this.points[start].y);
    //   this.ctx.lineTo(this.points[end].x, this.points[end].y);
    //   this.ctx.stroke();
    //   console.log(this.points);
    // }
  };

  onMouseUp = e => {
    this.drawing = false;
    this.points = [];
  };


  onMouseOut = e => {
    if(!this.drawing) return;

    let lastPoint = this.points.length-1;

    let position = this.getCursorPosition(e);
    this.points.push(position);

    let length = this.points.length;

    if (length > 4) {
      this.ctx.moveTo(...this.points[length - 3]);
      this.ctx.quadraticCurveTo(...this.points[length - 2], ...this.points[length - 1]);
      this.ctx.stroke();
    }

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
          onMouseOut={this.onMouseOut}
          onMouseUp={this.onMouseUp}
          width={width}
          height={height}
        />

      </div>
    );
  }
}
