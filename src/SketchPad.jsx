import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import { Pencil } from './tools';
import PropTypes from 'proptypes';

export default class SketchPad extends Component {
  tool = null;
  interval = null;
  resultImg = null;

  static propTypes = {
    width: PropTypes.number,
    height: PropTypes.number,
    items: PropTypes.array.isRequired,
    animate: PropTypes.bool,
    canvasClassName: PropTypes.string,
    canvasClassName2: PropTypes.string,
    color: PropTypes.string,
    fillColor: PropTypes.string,
    size: PropTypes.number,
    onItemStart: PropTypes.func, // function(stroke:Stroke) { ... }
    onEveryItemChange: PropTypes.func, // function(idStroke:string, x:number, y:number) { ... }
    onDebouncedItemChange: PropTypes.func, // function(idStroke, points:Point[]) { ... }
    onCompleteItem: PropTypes.func, // function(stroke:Stroke) { ... }
    debounceTime: PropTypes.number,
  };

  static defaultProps = {
    width: 600,
    height: 500,
    color: '#000',
    size: 5,
    fillColor: '',
    canvasClassName: 'canvas',
    canvasClassName2: 'canvas2',
    debounceTime: 1000,
    animate: true,
  };

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.canvas = findDOMNode(this.canvasRef);
    this.canvas2 = findDOMNode(this.canvasRef2);

    this.ctx = this.canvas.getContext('2d');
    this.ctx2 = this.canvas2.getContext('2d');

    this.tool = Pencil(this.ctx);
    this.tool2 = Pencil(this.ctx2);

    this.drawImage(this.props.image);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.image != nextProps.image) {
      const ctx = this.ctx;
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

      const ctx2 = this.ctx2;
      ctx2.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

      this.drawImage(nextProps.image);
    }

    if ( this.props.writeImg != nextProps.writeImg){
      console.log('Time to write an image, yo!');
      // resultImg = this.ctx2.canvas.toDataUrl("image/png");
      this.resultImg = this.canvas2.toDataURL();
    }
  }

  drawImage = source => {
    const img = new Image();
    img.src = source;
    const ctx = this.ctx;

    img.onload = () => {
      this._drawImageScaled(img, ctx);
    };
  };

  _drawImageScaled = (img, ctx) => {
    const canvas = ctx.canvas;
    const hRatio = canvas.width / img.width;
    const vRatio = canvas.height / img.height;
    const ratio = Math.min(hRatio, vRatio);
    const centerShift_x = (canvas.width - img.width * ratio) / 2;
    const centerShift_y = (canvas.height - img.height * ratio) / 2;
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
  onMouseDown = e => {
    this.tool.onMouseDown(
      ...this.getCursorPosition(e),
      this.props.color,
      this.props.size,
      this.props.fillColor,
    );

    this.tool2.onMouseDown(
      ...this.getCursorPosition2(e, this.ctx2.canvas.width),
      '#d3e4ff',
      this.props.size,
      this.props.fillColor,
    );
  };

  onMouseDown2 = e => {
    this.tool2.onMouseDown(
      ...this.getCursorPosition2(e, 0),
      this.props.color,
      this.props.size,
      this.props.fillColor,
    );
  };

  onMouseMove = e => {
    this.tool.onMouseMove(...this.getCursorPosition(e));
    this.tool2.onMouseMove(
      ...this.getCursorPosition2(e, this.ctx2.canvas.width),
    );
  };

  onMouseMove2 = e => {
    this.tool2.onMouseMove(...this.getCursorPosition2(e, 0));
  };

  onMouseUp = e => {
    this.tool.onMouseUp(...this.getCursorPosition(e));
    this.tool2.onMouseUp(...this.getCursorPosition2(e, this.ctx2.canvas.width));
  };

  onMouseUp2 = e => {
    this.tool2.onMouseUp(...this.getCursorPosition2(e, 0));
  };

  getCursorPosition(e) {
    const { top, left } = this.canvas.getBoundingClientRect();
    return [e.clientX - left, e.clientY - top];
  }

  getCursorPosition2(e, offset) {
    const { top, left } = this.canvas2.getBoundingClientRect();
    return [e.clientX - left + offset, e.clientY - top];
  }

  render() {
    const { width, height, canvasClassName, canvasClassName2 } = this.props;

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
        <canvas
          ref={canvas => {
            this.canvasRef2 = canvas;
          }}
          className={canvasClassName2}
          onMouseDown={this.onMouseDown2}
          onMouseMove={this.onMouseMove2}
          onMouseOut={this.onMouseUp2}
          onMouseUp={this.onMouseUp2}
          width={width}
          height={height}
        />
        {this.resultImg ? <img src={this.resultImg}/> : 'Wait for it'}
      </div>
    );
  }
}
