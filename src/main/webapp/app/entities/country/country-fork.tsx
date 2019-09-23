import React from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { IRootState } from 'app/shared/reducers';
import { getSearchEntities, getEntities } from './country.reducer';
import '../../../../../../node_modules/antd/dist/antd.css';
import { Input, Button, Table, Form } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './country.css';

export interface ICountryProps extends StateProps, DispatchProps, RouteComponentProps<{ url: string }> {}

export interface ICountryState {
  search: string;
}

export class CountryFork extends React.Component<ICountryProps, ICountryState> {
  state: ICountryState = {
    search: ''
  };
  componentDidMount() {
    this.props.getEntities();
  }
  handleSearch = event => this.setState({ search: event.target.value });

  handleSubmit = e => {
    e.preventDefault();
    this.search();
  };

  clear = () => {
    this.setState({ search: '' }, () => {
      this.props.getEntities();
    });
  };

  search = () => {
    if (this.state.search) {
      this.props.getSearchEntities(this.state.search);
    }
  };

  render() {
    const { countryList, match } = this.props;
    const columns = [
      {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
        render: (text, record) => (
          <Link className="topo-data" to={`${match.url}/${record.id}`}>
            {text}
          </Link>
        ),
        sorter: (a, b) => a.id - b.id
      },
      {
        title: 'Country',
        dataIndex: 'countryName',
        key: 'countryName'
      },
      {
        title: 'ReginId',
        dataIndex: 'reginId',
        key: 'reginId'
      },
      {
        title: '',
        key: 'button',
        render: (text, record) => (
          <Button.Group className="float-right">
            <Button type="default">
              <Link to={`${match.url}/${record.id}`}>
                <FontAwesomeIcon icon="eye" />
                View
              </Link>
            </Button>
            <Button type="primary">
              <Link to={`${match.url}/${record.id}/edit`}>
                <FontAwesomeIcon icon="pencil-alt" />
                Edit
              </Link>
            </Button>
            <Button type="danger">
              <Link to={`${match.url}/${record.id}/delete`}>
                <FontAwesomeIcon icon="trash" />
                Delete
              </Link>
            </Button>
          </Button.Group>
        )
      }
    ];
    return (
      <div>
        <h2>
          Country
          <Button type="danger" className="float-right">
            <Link to={`${match.url}/new`}>
              <FontAwesomeIcon icon="plus" />
              &nbsp; Create new Country
            </Link>
          </Button>
        </h2>
        <Form onSubmit={this.handleSubmit}>
          <Input placeholder="CountryName" onChange={this.handleSearch} value={this.state.search} className="col-11" />
          <Button htmlType="submit">
            <FontAwesomeIcon icon="search" />
          </Button>
          <Button onClick={this.clear}>
            <FontAwesomeIcon icon="trash" />
          </Button>
        </Form>
        <div className="country-table">
          <Table dataSource={countryList} columns={columns} rowKey="id" />
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ country }: IRootState) => ({
  countryList: JSON.parse(JSON.stringify(country.entities))
});

const mapDispatchToProps = {
  getSearchEntities,
  getEntities
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CountryFork);
