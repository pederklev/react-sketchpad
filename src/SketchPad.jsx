import React, {Component} from 'react';
import { findDOMNode } from 'react-dom'
import { Pencil } from './tools'
import PropTypes from 'proptypes';


export default class SketchPad extends Component {

  tool = null;
  interval = null;

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
    width: 500,
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
  }

  componentWillReceiveProps({items}) {
    items
      .filter(item => this.props.items.indexOf(item) === -1)
      .forEach(item => {
        this.tool.draw(item, this.props.animate);
        this.tool2.draw(item, this.props.animate);
      });
  }

  onMouseDown = (e) => {
    this.tool.onMouseDown(...this.getCursorPosition(e), this.props.color, this.props.size, this.props.fillColor);

    this.tool2.onMouseDown(...this.getCursorPosition2(e), this.props.color, this.props.size, this.props.fillColor);

  }

  onMouseMove = (e) => {
    this.tool.onMouseMove(...this.getCursorPosition(e));

    this.tool2.onMouseMove(...this.getCursorPosition2(e));
    
  }

  onMouseUp = (e) => {
    this.tool.onMouseUp(...this.getCursorPosition(e));

    this.tool2.onMouseUp(...this.getCursorPosition2(e));

  }

  getCursorPosition(e) {
    const {top, left} = this.canvas.getBoundingClientRect();
    return [
      e.clientX - left,
      e.clientY - top
    ];
  }

  getCursorPosition2(e) {
    const {top, left} = this.canvas2.getBoundingClientRect();
    return [
      e.clientX - left,
      e.clientY - top
    ];
  }

  render() {
    const {width, height, canvasClassName, canvasClassName2} = this.props;

    return (
      <div>
      <canvas
        ref={(canvas) => { this.canvasRef = canvas; }}
        className={canvasClassName}
        onMouseDown={this.onMouseDown}
        onMouseMove={this.onMouseMove}
        onMouseOut={this.onMouseUp}
        onMouseUp={this.onMouseUp}
        width={width}
        height={height}
      />
      <canvas
        ref={(canvas) => { this.canvasRef2 = canvas; }}
        className={canvasClassName2}
        onMouseDown={this.onMouseDown}
        onMouseMove={this.onMouseMove}
        onMouseOut={this.onMouseUp}
        onMouseUp={this.onMouseUp}
        width={width}
        height={height}
      />
      </div>
    )
  }
}
