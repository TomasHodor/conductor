import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router'
import { connect } from 'react-redux';
import {Button} from "react-bootstrap";

const menuPaths = {
  Workflow: [{
    header: true,
    label: 'Executions',
    href: '/events',
    icon: 'fa-star'
  },{
    label: 'All',
    href: '/workflow',
    icon: 'fa-circle'
  },{
    label: 'Running',
    href: '/workflow?status=RUNNING',
    icon: 'far fa-play-circle'
  },{
    label: 'Failed',
    href: '/workflow?status=FAILED&h=48',
    icon: 'fas fa-exclamation-circle'
  },{
    label: 'Timed Out',
    href: '/workflow?status=TIMED_OUT&h=48',
    icon: 'far fa-clock'
  },{
    label: 'Terminated',
    href: '/workflow?status=TERMINATED&h=48',
    icon: 'fa-ban'
  },{
    label: 'Completed',
    href: '/workflow?status=COMPLETED&h=48',
    icon: 'fa-bullseye'
  },{
    label: 'Scheduled',
    href: '/workflow/scheduled',
    icon: 'far fa-calendar-alt'
  },{
    header: true,
    label: 'Metadata',
    href: '/events',
    icon: 'fa-star'
  },{
    label: 'Workflow Defs',
    href: '/workflow/metadata',
    icon: 'fas fa-code-branch'
  },{
    label: 'Tasks',
    href: '/workflow/metadata/tasks',
    icon: 'fa-tasks'
  },{
    header: true,
    label: 'Workflow Events',
    href: '/events',
    icon: 'fa-star'
  },{
    label: 'Event Handlers',
    href: '/events',
    icon: 'fa-star'
  },{
    header: true,
    label: 'Task Queues',
    href: '/events',
    icon: 'fa-star'
  },{
    label: 'Poll Data',
    href: '/workflow/queue/data',
    icon: 'fas fa-exchange-alt'
  }]
};

const LeftMenu = React.createClass({

  getInitialState() {
    return {
      sys: {},
      minimize: false
    };
  },
  handleResize(e) {
    this.setState({windowWidth: window.innerWidth, minimize: window.innerWidth < 600});
  },

  componentDidMount() {
   window.addEventListener('resize', this.handleResize);
  },

 componentWillUnmount() {
   window.removeEventListener('resize', this.handleResize);
 },
  componentWillReceiveProps(nextProps) {
    this.state.loading = nextProps.fetching;
    this.state.version = nextProps.version;
    this.state.minimize = nextProps.minimize;
  },

  render() {
    let minimize = this.state.minimize;
    let appName = 'Workflow';
    const width = minimize?'50px':'176px';

    if (this.props.appName) {
      appName = this.props.appName;
    }
    let display = minimize?'none':'';
    let menuItems = [];
    let keyVal = 0;
    menuPaths[appName].map((cv, i, arr) => {
      let iconClass = 'fa ' + cv['icon'];
      if(cv['header'] == true) {
        menuItems.push((
          <div id={`opt${i}`} className="" key={`key-${(keyVal += 1)}`}>
            <div className='menuHeader'><i className='fa fa-angle-down'></i>&nbsp;{cv['label']}</div>
          </div>
        ));
      }
        else {
        menuItems.push((
          <Link to={cv['href']} key={`key-${(keyVal += 1)}`}>
              <div id={`opt${i}`} className='menuItem'>
              <i className={iconClass} style={{width: '20px'}}></i>
              <span style={{ marginLeft: '10px', display: display}}>
                {cv['label']}
              </span>
              </div>
          </Link>
        ));
      }
    });

    function startIntro() {
        let intro = introJs();
        intro.setOptions({
            showStepNumbers: false,
            steps: [
                {
                    intro: "All executed workflows with details sorted by status",
                    element: document.querySelector('#opt0'),
                    position: 'right'
                },
                {
                    intro: "List of scheduled workflows with details and controls",
                    element: document.querySelector('#opt7'),
                    position: 'right'
                },
                {
                    intro: "List of all available executable workflows.",
                    element: document.querySelector('#opt9'),
                    position: 'right'

                }
            ]
        });
        intro.start();
    }

    return (
      <div className="left-menu" style={{width:width}}>
        <div className="logo textual pull-left">
          <a href="/" title="Frinx Conductor">
              <h4><i className={this.state.loading ? "fa fa-bars fa-spin fa-1x" : ""}/>{this.state.loading || minimize ? '' :
                  <img src="/images/FRINX_logo_smaller.png" width="120" alt="Frinx" margin="15px"/>}</h4>
          </a>
        </div>

        <div className="menuList">
            <div id="innerHelp" onClick={ () => {startIntro()} } >
                <i className="fas fa-info-circle"/>
            </div>
          {menuItems}
        </div>
      </div>
    );
  }

});

export default connect(state => state.workflow)(LeftMenu);
