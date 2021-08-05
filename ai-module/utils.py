import os
from joblib import load


def load_data_scalers(name, basedir):
    load_dir = os.path.join(basedir, "model_state")

    # load input data scaler
    input_scaler_name = "input_data_scaler_" + name
    input_scaler_name_bin = "{}.bin".format(input_scaler_name)
    input_load_path = os.path.join(load_dir, input_scaler_name_bin)
    input_sc_load_path = open(input_load_path, mode="rb")
    input_data_scaler = load(input_sc_load_path)
    input_sc_load_path.close()

    # load target data scaler
    target_scaler_name = "target_data_scaler_" + name
    target_scaler_name_bin = "{}.bin".format(target_scaler_name)
    target_load_path = os.path.join(load_dir, target_scaler_name_bin)
    target_sc_load_path = open(target_load_path, mode="rb")
    target_data_scaler = load(target_sc_load_path)
    target_sc_load_path.close()

    return (input_data_scaler, target_data_scaler)
