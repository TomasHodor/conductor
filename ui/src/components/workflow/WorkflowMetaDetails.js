import React, { Component } from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import { connect } from 'react-redux';
import { getWorkflowMetaDetails } from '../../actions/WorkflowActions';
import WorkflowMetaDia from './WorkflowMetaDia';
import WorkflowMetaInput from './WorkflowMetaInput';
import { getInputs, getDetails } from '../../actions/JSONActions';

class WorkflowMetaDetails extends Component {

  constructor(props) {
    super(props);
    this.state = {
      name : props.params.name,
      version : props.params.version,
      workflowMeta: {tasks: []},
      workflowForm: {
          labels: [],
          descs: [],
          values: [],
          key: 1,
      }
    };
  }

  componentWillReceiveProps(nextProps) {
    this.state.name = nextProps.params.name;
    this.state.version = nextProps.params.version;
    this.state.workflowMeta = nextProps.meta;
    this.getWorkflowInputDetails();
  }

  componentWillMount(){
    this.props.dispatch(getWorkflowMetaDetails(this.state.name, this.state.version));
  }

  getWorkflowInputDetails() {
      this.setState({
          workflowForm: {
              labels: getInputs(this.state.workflowMeta),
          }
      }, () => {
          this.setState({
              workflowForm: {
                  labels: this.state.workflowForm.labels,
                  ...getDetails(this.state.workflowMeta, this.state.workflowForm.labels)
              }
          })
      });
  }

  startIntro() {
      let intro = introJs();
      let _this = this;
      intro.setOptions({
          showStepNumbers: false,
          steps: [
              {
                  intro: "Here are selected workflow details",
                  element: document.getElementById("test1"),
                  position: 'down'
              },
          ]
      });
      intro.start().oncomplete(function () {
          _this.setState({ key: 3})
      })
  }

  render() {
    let wf = this.state.workflowMeta;
    if(wf == null) {
      wf = {tasks: []};
    }

    return (
      <div className="ui-content">
        <Tabs activeKey={this.state.key}>
          <Tab eventKey={1} title="Diagram">
            <div><WorkflowMetaDia meta={wf} tasks={[]}/></div>
          </Tab>
          <Tab eventKey={2} title="JSON">
            <div><pre>
              {JSON.stringify(this.state.workflowMeta, null, 2)};
          </pre></div>
          </Tab>
          <Tab eventKey={3} title="Input">
            <WorkflowMetaInput workflowForm={this.state.workflowForm} name={this.state.name}/>
          </Tab>
        </Tabs>
      </div>
    );
  }
};
export default connect(state => state.workflow)(WorkflowMetaDetails);
