import React from 'react';
import ReactDOM from 'react-dom';

const defaultStyles = {
  root: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
  },
  sidebar: {
    zIndex: 2,
    position: 'absolute',
    top: 0,
    bottom: 0,
    transition: 'transform .3s ease-out',
    WebkitTransition: '-webkit-transform .3s ease-out',
    willChange: 'transform',
    overflowY: 'auto',
  },
  content: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'auto',
    transition: 'left .3s ease-out, right .3s ease-out',
  },
  overlay: {
    zIndex: 1,
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0,
    visibility: 'hidden',
    transition: 'opacity .3s ease-out',
    backgroundColor: 'rgba(0,0,0,.3)',
  },
  dragHandle: {
    zIndex: 1,
    position: 'fixed',
    top: 0,
    bottom: 0,
  },
};

class Sidebar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      // width of the sidebar in pixels
      sidebarWidth: 0,
    };

    this.overlayClicked = this.overlayClicked.bind(this);
  }

  componentDidMount() {
    this.saveSidebarWidth();
  }

  componentDidUpdate() {
  }

  overlayClicked() {
    if (this.props.open) {
      this.props.onSetOpen(false);
    }
  }

  saveSidebarWidth() {
    const width = ReactDOM.findDOMNode(this.refs.sidebar).offsetWidth;

    if (width !== this.state.sidebarWidth) {
      this.setState({sidebarWidth: width});
    }
  }

  render() {
    const sidebarStyle = {...defaultStyles.sidebar, ...this.props.styles.sidebar};
    const contentStyle = {...defaultStyles.content, ...this.props.styles.content};
    const overlayStyle = {...defaultStyles.overlay, ...this.props.styles.overlay};
    const rootProps = {
      className: this.props.rootClassName,
      style: {...defaultStyles.root, ...this.props.styles.root},
    };

    // sidebarStyle right/left
    if (this.props.pullRight) {
      sidebarStyle.right = 0;
      sidebarStyle.transform = 'translateX(100%)';
      sidebarStyle.WebkitTransform = 'translateX(100%)';
      if (this.props.shadow) {
        sidebarStyle.boxShadow = '-2px 2px 4px rgba(0, 0, 0, 0.15)';
      }
    } else {
      sidebarStyle.left = 0;
      sidebarStyle.transform = 'translateX(-100%)';
      sidebarStyle.WebkitTransform = 'translateX(-100%)';
      if (this.props.shadow) {
        sidebarStyle.boxShadow = '2px 2px 4px rgba(0, 0, 0, 0.15)';
      }
    }

    if (this.props.docked) {
      // show sidebar
      if (this.state.sidebarWidth !== 0) {
        sidebarStyle.transform = 'translateX(0%)';
        sidebarStyle.WebkitTransform = 'translateX(0%)';
      }

      // make space on the left/right side of the content for the sidebar
      if (this.props.pullRight) {
        contentStyle.right = '${this.state.sidebarWidth}px';
      } else {
        contentStyle.left = '${this.state.sidebarWidth}px';
      }
    } else if (this.props.open) {
      // slide open sidebar
      sidebarStyle.transform = 'translateX(0%)';
      sidebarStyle.WebkitTransform = 'translateX(0%)';

      // show overlay
      overlayStyle.opacity = 1;
      overlayStyle.visibility = 'visible';
    }

    return (
      <div {...rootProps}>
        <div className={this.props.sidebarClassName} style={sidebarStyle} ref="sidebar">
          {this.props.sidebar}
        </div>
        <div className={this.props.overlayClassName}
             style={overlayStyle}
             role="presentation"
             tabIndex="0"
             onClick={this.overlayClicked}
          />
        <div className={this.props.contentClassName} style={contentStyle}>
          {dragHandle}
          {this.props.children}
        </div>
      </div>
    );
  }
}

Sidebar.propTypes = {
  // main content to render
  children: React.PropTypes.node.isRequired,

  // styles
  styles: React.PropTypes.shape({
    root: React.PropTypes.object,
    sidebar: React.PropTypes.object,
    content: React.PropTypes.object,
    overlay: React.PropTypes.object,
  }),

  // root component optional class
  rootClassName: React.PropTypes.string,

  // sidebar optional class
  sidebarClassName: React.PropTypes.string,

  // content optional class
  contentClassName: React.PropTypes.string,

  // overlay optional class
  overlayClassName: React.PropTypes.string,

  // sidebar content to render
  sidebar: React.PropTypes.node.isRequired,

  // boolean if sidebar should be docked
  docked: React.PropTypes.bool,

  // boolean if sidebar should slide open
  open: React.PropTypes.bool,

  // boolean if transitions should be disabled
  transitions: React.PropTypes.bool,

  // Place the sidebar on the right
  pullRight: React.PropTypes.bool,

  // Enable/Disable sidebar shadow
  shadow: React.PropTypes.bool,

  // distance we have to drag the sidebar to toggle open state
  dragToggleDistance: React.PropTypes.number,

  // callback called when the overlay is clicked
  onSetOpen: React.PropTypes.func,
};

Sidebar.defaultProps = {
  docked: false,
  open: false,
  transitions: true,
  pullRight: false,
  shadow: true,
  dragToggleDistance: 30,
  onSetOpen: () => {},
  styles: {},
};

export default Sidebar;
