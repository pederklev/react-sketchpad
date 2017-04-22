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
    const data = this.tool.onMouseDown(...this.getCursorPosition(e), this.props.color, this.props.size, this.props.fillColor);

    data && data[0] && this.props.onItemStart && this.props.onItemStart.apply(null, data);


    if (this.props.onDebouncedItemChange) {
      this.interval = setInterval(this.onDebouncedMove, this.props.debounceTime);
    }

    const data2 = this.tool2.onMouseDown(...this.getCursorPosition2(e), this.props.color, this.props.size, this.props.fillColor);
    data2 && data2[0] && this.props.onItemStart && this.props.onItemStart.apply(null, data2);
    if (this.props.onDebouncedItemChange) {
      this.interval = setInterval(this.onDebouncedMove, this.props.debounceTime);
    }
  }

  onDebouncedMove = () => {
    if (typeof this.tool.onDebouncedMouseMove == 'function' && this.props.onDebouncedItemChange) {
      this.props.onDebouncedItemChange.apply(null, this.tool.onDebouncedMouseMove());
    }

    if (typeof this.tool2.onDebouncedMouseMove == 'function' && this.props.onDebouncedItemChange) {
      this.props.onDebouncedItemChange.apply(null, this.tool2.onDebouncedMouseMove());
    }
  }

  onMouseMove = (e) => {
    const data = this.tool.onMouseMove(...this.getCursorPosition(e));
    data && data[0] && this.props.onEveryItemChange && this.props.onEveryItemChange.apply(null, data);

    const data2 = this.tool2.onMouseMove(...this.getCursorPosition2(e));
    data2 && data2[0] && this.props.onEveryItemChange && this.props.onEveryItemChange.apply(null, data2);
  }

  onMouseUp = (e) => {
    const data = this.tool.onMouseUp(...this.getCursorPosition(e));
    data && data[0] && this.props.onCompleteItem && this.props.onCompleteItem.apply(null, data);
    if (this.props.onDebouncedItemChange) {
      clearInterval(this.interval);
      this.interval = null;
    }

    const data2 = this.tool2.onMouseUp(...this.getCursorPosition2(e));
    data2 && data2[0] && this.props.onCompleteItem && this.props.onCompleteItem.apply(null, data2);
    if (this.props.onDebouncedItemChange) {
      clearInterval(this.interval);
      this.interval = null;
    }
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
