# Dependencies
from sqlalchemy import create_engine
import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func, inspect
import json

from flask import Flask, render_template, redirect, request, json
import pandas
app = Flask(__name__)

# Census API Key

# Create engine using the `demographics.sqlite` database file
def crime_dict():
    # pword = ''
    # connection_string = f"postgres:{pword}@localhost:5432/crime_db"
    # connected_engine=create_engine(f'postgresql://{connection_string}').connect()
    connected_engine=create_engine('sqlite:///crime_table_schema.sqlite').connect()
    chicago_crime_df=pandas.read_sql_table('chicago',connected_engine).set_index('id')
    atlanta_crime_df=pandas.read_sql_table('atlanta',connected_engine).set_index('id')

    json_result_chicago=chicago_crime_df.to_json(orient="table")
    json_result_atlanta=atlanta_crime_df.to_json(orient="table")
    chicagoDict=json.loads(json_result_chicago)['data']
    atlDict=json.loads(json_result_atlanta)['data']
    allCrimeDict=[]
    for d in atlDict:
        allCrimeDict.append(d)
    for c in chicagoDict:
        allCrimeDict.append(c)
    return allCrimeDict

@app.route("/")
def home():
    # get crime data and zip code

    # Return template and data

    return render_template("index.html", data=crime_dict(), imglink="https://news.wttw.com/sites/default/files/field/image/FBICrimeData_0925.jpg")


if __name__ == "__main__":
    app.run(debug=True)
