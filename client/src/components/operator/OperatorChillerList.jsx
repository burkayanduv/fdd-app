/* eslint-disable react/destructuring-assignment */
import { Select, Table, Tag } from 'antd';
import PropTypes from 'prop-types';

export default function OperatorChillerList({ chillerData }) {
  const columns = [
    {
      title: 'Name',
      dataIndex: 'chillerName',
      key: 'name',
      render: (text) => <>{text}</>,
    },
    {
      title: 'Conn',
      dataIndex: 'connectionStatus',
      key: 'connection',
      render: (connectionStatus) => (
        <>
          {[connectionStatus].map((c) => {
            const color = c === 'ok' ? 'green' : 'volcano';
            const tag = c === 'ok' ? 'ok' : 'error';
            return (
              <Tag color={color} key={tag}>
                {tag.toUpperCase()}
              </Tag>
            );
          })}
        </>
      ),
    },
    {
      title: 'Health',
      dataIndex: 'healthStatus',
      key: 'health',
      render: (healthStatus) => (
        <>
          {[healthStatus].map((h) => {
            const color = h === 'normal' ? 'green' : 'volcano';
            const tag = h === 'normal' ? 'normal' : 'fault';
            return (
              <Tag color={color} key={tag}>
                {tag.toUpperCase()}
              </Tag>
            );
          })}
        </>
      ),
    },
    {
      title: 'Users',
      dataIndex: 'users',
      key: 'users',
      render: (users) => (
        <Select bordered={false} defaultValue='user-list'>
          {users.map((user) => {
            const userName = user;
            return <Select.Option key={user}>{userName}</Select.Option>;
          })}
        </Select>
      ),
    },
    {
      title: 'Admins',
      dataIndex: 'admins',
      key: 'admins',
      render: (admins) => (
        <Select bordered={false} defaultValue='admin-list'>
          {admins.map((admin) => {
            const adminName = admin;
            return <Select.Option key={admin}>{adminName}</Select.Option>;
          })}
        </Select>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={chillerData}
      rowKey='_id'
      size='small'
      pagination={{ pageSize: 20 }}
    />
  );
}

OperatorChillerList.propTypes = {
  chillerData: PropTypes.arrayOf(
    PropTypes.shape({
      location: PropTypes.shape({
        coordinates: PropTypes.arrayOf(PropTypes.number),
      }),
      users: PropTypes.arrayOf(PropTypes.string),
      admins: PropTypes.arrayOf(PropTypes.string),
      _id: PropTypes.string,
      chillerName: PropTypes.string,
      connectionStatus: PropTypes.string,
      healthStatus: PropTypes.string,
      diagnosisTime: PropTypes.string,
      createdAt: PropTypes.string,
      updatedAt: PropTypes.string,
      __v: PropTypes.number,
    })
  ).isRequired,
};
