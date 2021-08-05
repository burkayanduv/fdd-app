import { Select } from 'antd';
import { useContext } from 'react';
import PropTypes from 'prop-types';
import { Context } from '../context/Context';

export default function SelectChillerForm({
  selectedChillerName,
  handleFormSelectChiller,
}) {
  const { user } = useContext(Context);
  const { Option } = Select;

  return (
    <Select
      bordered={false}
      defaultValue={selectedChillerName}
      onChange={handleFormSelectChiller}
      style={{ width: '100%', color: '#e8b339' }}
    >
      {user.chillers.map((chiller) => {
        const option = (
          <Option key={chiller} value={chiller}>
            {chiller}
          </Option>
        );
        return option;
      })}
    </Select>
  );
}

SelectChillerForm.propTypes = {
  selectedChillerName: PropTypes.string.isRequired,
  handleFormSelectChiller: PropTypes.func.isRequired,
};
