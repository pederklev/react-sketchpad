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
    width: 1200,
    height: 600,
    color: '#000',
    size: 5,
    fillColor: '',
    canvasClassName: 'canvas',
  };

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.canvas1 = findDOMNode(this.leftCanvas);
    this.ctx1 = this.canvas1.getContext('2d');

    this.canvas2 = findDOMNode(this.rightCanvas);
    this.ctx2 = this.canvas2.getContext('2d');

    this.initSettings(this.ctx1);
    this.drawImage(this.props.image, this.ctx1);
  }

  drawImage = (imgSrc, ctx) => {
    const img = new Image();
    img.src = imgSrc;

    img.onload = () => {
      const hRatio = ctx.canvas.width / img.width;
      const vRatio = ctx.canvas.height / img.height;
      const ratio = Math.min(hRatio, vRatio);
      const centerShift_x = (ctx.canvas.width - img.width * ratio) / 2;
      const centerShift_y = (ctx.canvas.height - img.height * ratio) / 2;
      // ctx.clearRect(0,0,canvas.width, canvas.height);
      ctx.drawImage(
        img,
        0,
        0,
        img.width,
        img.height,
        centerShift_x,
        centerShift_y,
        img.width * ratio,
        img.height * ratio,
      );
    };
  };

  initSettings = (ctx) => {
    ctx.lineWidth = 4;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.strokeStyle = 'rgb(60,60,60)';
  };

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
    this.ctx1.beginPath();

    if (length > 4) {
      this.ctx1.moveTo(...this.points[length - 4]);
      this.ctx1.quadraticCurveTo(...this.points[length - 3], ...this.points[length - 2]);
      this.ctx1.stroke();
    }

  };

  onMouseUp = e => {
    if (!this.drawing) return;

    let lastPoint = this.points.length - 1;

    let position = this.getCursorPosition(e);
    this.points.push(position);

    let length = this.points.length;

    if (length > 4) {
      this.ctx1.moveTo(...this.points[length - 3]);
      this.ctx1.quadraticCurveTo(...this.points[length - 2], ...this.points[length - 1]);
      this.ctx1.stroke();
    }

    this.drawing = false;
    this.points = [];
  };

  getCursorPosition(e) {
    const { top, left } = this.canvas1.getBoundingClientRect();
    return [e.clientX - left, e.clientY - top];
  }

  render() {
    const { width, height, canvasClassName } = this.props;

    return (
      <div>

        <canvas
          ref={canvas => {
            this.leftCanvas = canvas;
          }}
          className={canvasClassName}
          onMouseDown={this.onMouseDown}
          onMouseMove={this.onMouseMove}
          onMouseOut={this.onMouseUp}
          onMouseUp={this.onMouseUp}
          width={(window.innerWidth/2 - 30)}
          height={window.innerHeight}
        />

        <canvas
          ref={canvas => {
            this.rightCanvas = canvas;
          }}
          className={canvasClassName}
          onMouseDown={this.onMouseDown}
          onMouseMove={this.onMouseMove}
          onMouseOut={this.onMouseUp}
          onMouseUp={this.onMouseUp}
          width={(window.innerWidth/2 - 30)}
          height={window.innerHeight}
        />

      </div>
    );
  }
}
