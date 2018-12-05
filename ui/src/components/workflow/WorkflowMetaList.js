import React, { Component } from 'react';
import { Link, browserHistory } from 'react-router';
import { Button } from 'react-bootstrap';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import { connect } from 'react-redux';
import { getWorkflowDefs } from '../../actions/WorkflowActions';

const WorkflowMetaList = React.createClass({

  getInitialState() {
    return {
      name: '',
      version: '',
      workflows: [],
      workflowsFiltered: []
    }
  },

  componentWillMount(){
    this.props.dispatch(getWorkflowDefs());
  },

  componentWillReceiveProps(nextProps){
    this.state.workflows = nextProps.workflows;
    this.state.workflowsFiltered = nextProps.workflows;
  },

  filterLabels() {
    var wfs = this.state.workflows;
    var tags = [];

    for (let key in wfs) {
      let str = wfs[key].name;
      tags[key] = str.substring(0, str.indexOf("_"));
    }
    tags = _.uniq(tags);

    return (
      tags.map((item, idx) => (
        <Button onClick={() => { this.handleSearch(item)} }>{item}</Button>)
      )
    )
  },

  startIntro() {
      let intro = introJs();
      let _this = this;
      intro.setOptions({
          showStepNumbers: false,
          steps: [
              {
                  intro: "Apply filter to easily find workflows",
                  element: document.querySelector('#tagFilter'),
                  position: 'down'
              },
              {
                  intro: "Filtered by category: EXAMPLE",
                  position: 'down'
              },
              {
                  intro: "List of all workflows by selected category",
                  element: document.querySelector('#bttable'),
                  position: 'down'
              },
          ]
      });
      intro.onchange(function() {
        if(this._currentStep === 1){
            _this.handleSearch("EXAMPLE");
        }
      }).start().oncomplete(function () {
          _this.handleSearch("");
      })
  },

  handleSearch(item) {
    var wfs = this.state.workflows;
    var wfsFiltered = [];

    for (let key in wfs) {
      let str = wfs[key].name;
      if (str.startsWith(item)) {
        wfsFiltered.push(wfs[key]);
      }
    }
    this.setState({
      workflowsFiltered: wfsFiltered
    })
  },

  render() {
    var wfs = this.state.workflowsFiltered;

    function jsonMaker(cell, row){
      return JSON.stringify(cell);
    };

    function taskMaker(cell, row){
      if(cell == null){
        return '';
      }
      return JSON.stringify(cell.map(task => {return task.name;}));
    };

    function nameMaker(cell, row){
      return (<Link to={`/workflow/metadata/${row.name}/${row.version}`}>{row.name} / {row.version}</Link>);
    };

    return (
      <div className="ui-content">

        <h1>Workflows&nbsp;&nbsp;<i className="fas fa-info-circle" style={{fontSize: 20}} onClick={() => {this.startIntro()}}/></h1>

        <div id="tagFilter">
            <Button onClick={() => {this.handleSearch("")} }>ALL</Button>
            {this.filterLabels()}
        </div>

        <div id="bttable">
          <BootstrapTable ref="table" data={wfs} striped={true} hover={true} search={true} exportCSV={false} pagination={false}>
          <TableHeaderColumn dataField="name" isKey={true} dataAlign="left" dataSort={true} dataFormat={nameMaker}>Name/Version</TableHeaderColumn>
          <TableHeaderColumn dataField="inputParameters" width="500" dataSort={true} dataFormat={jsonMaker}>Input Parameters</TableHeaderColumn>
          <TableHeaderColumn dataField="tasks" hidden={false} dataFormat={taskMaker}>Tasks</TableHeaderColumn>
          </BootstrapTable>
        </div>

      </div>
    );
  }
});
export default connect(state => state.workflow)(WorkflowMetaList);
