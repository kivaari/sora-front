from python:3.12.9

workdir /app

copy requirements.txt /app/

run pip install --no-cache-dir -r requirements.txt

copy . /app

expose 8000
