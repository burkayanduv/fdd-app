import pandas as pd
import os
from joblib import load

from utils import load_data_scalers
from ffm_predict import ffm_diff


def refload_fdd(data, basedir):
    df = pd.DataFrame(data)
    columns_list = [
        "comp_DischSupe",
        "comp_DischTemp",
        "comp_MassFlow",
        "cond_SatRfgtTemp",
        "evap_ApprchTemp",
        "evap_EntWtrTemp",
        "evap_SatRfgtTemp",
        "evap_OutdoorAirTemp",
        "cond_DischSubc",
        "evap_LvgWtrTemp",
        "evap_WtrFlowEsti",
    ]
    df = df[columns_list]

    df = ffm_diff(df, basedir)

    # load data scalers
    (input_data_scaler, target_data_scaler) = load_data_scalers(
        name="r", basedir=basedir
    )

    # scale data
    scaled_df = input_data_scaler.transform(df)

    # load XGB model
    if os.path.exists("model_state"):
        filename = "model_state/XGB_model.sav"
        loaded_model = load(os.path.join(basedir, filename))
    else:
        print("XGB model not found.")

    # make predictions
    scaled_predictions = loaded_model.predict(scaled_df)

    # inverse transformation for standardization
    inversed_predictions = target_data_scaler.inverse_transform(
        scaled_predictions
    )

    return inversed_predictions
