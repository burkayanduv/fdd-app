/* eslint-disable react/destructuring-assignment */
import { Select, Table } from 'antd';
import PropTypes from 'prop-types';

export default function OperatorUserList({ userData }) {
  const columns = [
    {
      title: 'Name',
      dataIndex: 'username',
      key: 'name',
      render: (text) => <>{text}</>,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      render: (text) => <>{text}</>,
    },
    {
      title: 'Chillers',
      dataIndex: 'chillers',
      key: 'chillers',
      render: (chillers) => (
        <Select bordered={false} defaultValue='chiller-list'>
          {chillers.map((chiller) => {
            const chillerName = chiller;
            return <Select.Option key={chiller}>{chillerName}</Select.Option>;
          })}
        </Select>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={userData}
      rowKey='_id'
      size='small'
      pagination={{ pageSize: 20 }}
    />
  );
}

OperatorUserList.propTypes = {
  userData: PropTypes.arrayOf(
    PropTypes.shape({
      username: PropTypes.string,
      email: PropTypes.string,
      password: PropTypes.string,
      chillers: PropTypes.arrayOf(PropTypes.string),
      _id: PropTypes.string,
      createdAt: PropTypes.string,
      updatedAt: PropTypes.string,
      __v: PropTypes.number,
    })
  ).isRequired,
};
