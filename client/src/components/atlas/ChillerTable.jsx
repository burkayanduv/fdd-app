import { Button, Table, Tag } from 'antd';
import PropTypes from 'prop-types';

export default function ChillerTable({ chillerData, handleClick }) {
  const columns = [
    {
      title: 'Name',
      dataIndex: 'chillerName',
      key: 'name',
      render: (text) => (
        <Button
          style={{ paddingRight: '0px', paddingLeft: '0px' }}
          type='link'
          onClick={(e) => handleClick(e, text)}
        >
          {text}
        </Button>
      ),
    },
    {
      title: 'Connection',
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
      title: 'Prediction Time',
      dataIndex: 'diagnosisTime',
      key: 'time',
      render: (text) => (
        <>
          {new Date(text).toLocaleString('en-us', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={chillerData}
      rowKey='_id'
      pagination={{ pageSize: 13 }}
    />
  );
}

ChillerTable.propTypes = {
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
  handleClick: PropTypes.func.isRequired,
};
