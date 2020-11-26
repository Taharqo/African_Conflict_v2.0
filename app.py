import pandas as pd
import numpy as np
import os
import requests 
from bs4 import BeautifulSoup
from flask import Flask, render_template, redirect, request, jsonify, send_from_directory
from sqlalchemy import create_engine, func
from config import endpoint, pwd, name, user, port

app = Flask(__name__)
cloud_engine = create_engine(f'postgresql://{user}:{pwd}@{endpoint}:{port}/{name}')

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/ultimate')
def ultimate():
    conn = cloud_engine.connect()
    query = 'select * from ultimate'
    results_df = pd.read_sql(query, con=conn)
    results_json = results_df.to_json(orient = 'records')
    conn.close()
    return results_json

if __name__ =='__main__':
    app.run(debug=True)
