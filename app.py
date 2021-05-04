# Dependencies
import requests
from sqlalchemy import create_engine
import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func, inspect
import json

from flask import Flask, render_template, redirect, request, json
import pandas as pd
app = Flask(__name__)

# Census API Key

# Create engine using the `demographics.sqlite` database file
def chicago_crime_dict():
    pword = 'Baggins89'
    connection_string = f"postgres:{pword}@localhost:5432/crime_db"
    connected_engine=create_engine(f'postgresql://{connection_string}').connect()

    chicago_crime_df=pd.read_sql_table('chicago',connected_engine).set_index('id')


    json_result=chicago_crime_df.to_json(orient="table")
    parsed=json.loads(json_result)
    return parsed['data']

@app.route("/")
def home():
    # get crime data and zip code

    # Return template and data

    return render_template("index.html", data=chicago_crime_dict(), imglink="https://news.wttw.com/sites/default/files/field/image/FBICrimeData_0925.jpg")


if __name__ == "__main__":
    app.run(debug=True)
