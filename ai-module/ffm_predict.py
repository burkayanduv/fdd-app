import pandas as pd
import os
import json
from joblib import load

from utils import load_data_scalers


def ffm_diff(df, basedir):
    # get df columns
    df_columns = list(df.columns)

    # make predictions
    df_ffm_index = df.index.to_list()
    df_ffm_pred = ffm_predict(df, basedir)
    df_ffm_pred.set_index(pd.Index(df_ffm_index), inplace=True)

    # substract ffm prediction from sensor values
    df_diff = df.sub(df_ffm_pred, fill_value=0, axis="index")
    df_diff = df_diff.reindex(df.index.to_list())

    # selection of virtual sensor residual columns
    if os.path.exists(os.path.join(basedir, "feature_data")):
        with open(
            os.path.join(basedir, "feature_data/kept_columns.txt")
        ) as f1:
            df_kept_columns = json.load(f1)
    else:
        print("No fault free model found.")

    key_set = set()
    for key in df_columns:
        if key not in df_kept_columns:
            key_set.add(key)

    df = df.drop(key_set, axis=1)
    df_diff = df_diff.drop(df_kept_columns, axis=1)
    df_diff = pd.concat([df_diff, df], axis=1)

    # return the result
    return df_diff


# predicts input parameters according to fault free model
def ffm_predict(df, basedir):
    # read fault free model info
    if os.path.exists(os.path.join(basedir, "feature_data")):
        with open(
            os.path.join(basedir, "feature_data/ffm_features.txt")
        ) as f1:
            ffm_features = json.load(f1)
    else:
        print("No fault free model found.")

    # initialize retured values
    predictions_df = pd.DataFrame()
    df_columns = list(df.columns)
    # loop through differet columns
    for col in df_columns:
        # assign input
        x = df[ffm_features[col][0]]

        # load data scalers
        (input_data_scaler, target_data_scaler) = load_data_scalers(
            name="ffm_" + col, basedir=basedir
        )

        # standardize data
        scaled_input_data = input_data_scaler.transform(x)

        # load the model
        filename = "model_state/ffm_model_" + col + ".sav"
        regr = load(os.path.join(basedir, filename))

        # make predictions
        scaled_predictions = regr.predict(scaled_input_data)

        # inverse transformation for standardization
        inversed_predictions = target_data_scaler.inverse_transform(
            scaled_predictions
        )

        # store the results
        predictions_df[col] = inversed_predictions.reshape(
            -1,
        )

    # return the results
    return predictions_df
