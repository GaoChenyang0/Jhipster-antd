import React from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { IRootState } from 'app/shared/reducers';
import { getEntities as getEmployees } from 'app/entities/employee/employee.reducer';
import { getEntities as getTasks } from 'app/entities/task/task.reducer';
import { getEntity, updateEntity, createEntity, reset } from './job.reducer';
import { Row, Col } from 'reactstrap';
import { Translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Form, Input, Select, Button } from 'antd';
// tslint:disable-next-line:no-submodule-imports
import { FormComponentProps } from 'antd/lib/form';
import { mapIdList } from 'app/shared/util/entity-utils';

const { Option } = Select;

export interface IJobUpdateProps extends FormComponentProps, StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export interface IJobUpdateState {
  isNew: boolean;
  idstask: any[];
  employeeId: string;
}

export class JobUpdate extends React.Component<IJobUpdateProps, IJobUpdateState> {
  constructor(props) {
    super(props);
    this.state = {
      idstask: [],
      employeeId: '0',
      isNew: !this.props.match.params || !this.props.match.params.id
    };
  }
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { jobEntity } = this.props;
        const entity = {
          ...jobEntity,
          ...values,
          tasks: mapIdList(values.tasks)
        };
        if (this.state.isNew) {
          this.props.createEntity(entity);
        } else {
          this.props.updateEntity(entity);
        }
      }
    });
  };
  handleClose = () => {
    this.props.history.push('/entity/job');
  };
  componentDidMount() {
    if (this.state.isNew) {
      this.props.reset();
    } else {
      this.props.getEntity(this.props.match.params.id);
    }
    this.props.getEmployees();
    this.props.getTasks();
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextProps.updateSuccess !== this.props.updateSuccess && nextProps.updateSuccess) {
      this.handleClose();
    }
  }

  render() {
    const { jobEntity, employees, tasks, loading, updating } = this.props;
    const { isNew } = this.state;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 }
    };
    return (
      <div>
        <Row className="justify-content-center">
          <Col md="8">
            <h2 id="quanxianApp.job.home.createOrEditLabel">
              <Translate contentKey="quanxianApp.job.home.createOrEditLabel">Create or edit a Job</Translate>
            </h2>
          </Col>
        </Row>
        <Row className="justify-content-center">
          <Col md="8">
            {loading ? (
              <p>Loading...</p>
            ) : (
              <Form {...formItemLayout} onSubmit={this.handleSubmit}>
                {!isNew ? (
                  <Form.Item label="ID">
                    {getFieldDecorator('id', { initialValue: this.props.jobEntity.id })(<Input type="text" disabled />)}
                  </Form.Item>
                ) : null}
                <Form.Item label="Job Title">
                  {getFieldDecorator('jobTitle', { initialValue: this.props.jobEntity.jobTitle })(<Input type="text" />)}
                </Form.Item>
                <Form.Item label="Min Salary">
                  {getFieldDecorator('minSalary', { initialValue: this.props.jobEntity.minSalary })(<Input type="string" />)}
                </Form.Item>
                <Form.Item label="Max Salary">
                  {getFieldDecorator('maxSalary', { initialValue: this.props.jobEntity.maxSalary })(<Input type="string" />)}
                </Form.Item>
                <Form.Item label="Employee">
                  {getFieldDecorator('employee.id', { initialValue: jobEntity.employee && jobEntity.employee.id })(
                    <Select placeholder="Please select a employee">
                      <Option value="" key="0" />
                      {employees
                        ? employees.map(otherEntity => (
                            <Option value={otherEntity.id} key={otherEntity.id}>
                              {otherEntity.id}
                            </Option>
                          ))
                        : null}
                    </Select>
                  )}
                </Form.Item>
                <Form.Item label="Task">
                  {getFieldDecorator('tasks', { initialValue: jobEntity.tasks && jobEntity.tasks.map(e => e.id) })(
                    <Select mode="multiple" placeholder="Please select your tasks">
                      <Option value="" key="0" />
                      {tasks
                        ? tasks.map(otherEntity => (
                            <Option value={otherEntity.id} key={otherEntity.id}>
                              {otherEntity.title}
                            </Option>
                          ))
                        : null}
                    </Select>
                  )}
                </Form.Item>
                <Form.Item wrapperCol={{ span: 12, offset: 6 }}>
                  <Button type="danger">
                    <Link to="/entity/job">
                      <FontAwesomeIcon icon="arrow-left" />
                      &nbsp; Back
                    </Link>
                  </Button>
                  &nbsp;
                  <Button type="primary" htmlType="submit">
                    <FontAwesomeIcon icon="save" />
                    &nbsp; Submit
                  </Button>
                </Form.Item>
              </Form>
            )}
          </Col>
        </Row>
      </div>
    );
  }
}

const mapStateToProps = (storeState: IRootState) => ({
  employees: storeState.employee.entities,
  tasks: storeState.task.entities,
  jobEntity: storeState.job.entity,
  loading: storeState.job.loading,
  updating: storeState.job.updating,
  updateSuccess: storeState.job.updateSuccess
});

const mapDispatchToProps = {
  getEmployees,
  getTasks,
  getEntity,
  updateEntity,
  createEntity,
  reset
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

const WrappedDemo = Form.create({ name: 'validate_other' })(JobUpdate);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WrappedDemo);
