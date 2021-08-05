import { Button, Form, message, Select } from 'antd';
import axios from 'axios';
import PropTypes from 'prop-types';

export default function OperatorDeleteChillerForm({ operatorChillerData }) {
  const onDeleteChiller = async (values) => {
    try {
      const chosenChiller = operatorChillerData.find(
        (chiller) => chiller.chillerName === values.chillerName
      );
      const apiURL = process.env.REACT_APP_API_URL;
      const masterToken = process.env.REACT_APP_MASTER_TOKEN;
      await axios.delete(
        `${apiURL}/chiller/${chosenChiller._id}?masterToken=${masterToken}`
      );
      message.success(`Deleted ${values.chillerName} from the system...`);
      setTimeout(() => window.location.reload(), 3000);
    } catch (error) {
      message.error(`${error.name} - ${error.message}.`);
    }
  };

  const onSubmitFailed = (values) => {
    message.error(`Form submission error for values: ${values}.`);
  };

  return (
    <Form
      name='deleteChillerForm'
      onFinish={onDeleteChiller}
      onFinishFailed={onSubmitFailed}
      className='chillerSubForm'
      labelCol={{ span: 4 }}
      wrapperCol={{ span: 20 }}
    >
      <Form.Item label='Chiller Name' name='chillerName'>
        <Select>
          {operatorChillerData.map((chiller) => (
            <Select.Option
              key={chiller.chillerName}
              value={chiller.chillerName}
            >
              {chiller.chillerName}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item noStyle>
        <Button
          danger
          type='primary'
          htmlType='submit'
          style={{
            display: 'flex',
            float: 'right',
          }}
        >
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
}

OperatorDeleteChillerForm.propTypes = {
  operatorChillerData: PropTypes.arrayOf(
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
