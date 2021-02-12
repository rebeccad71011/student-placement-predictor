# Placement Predictor

Simple overview of use/purpose.

## Description

A machine learning based web application that allows students to predict the status of their placement based on their respective profiles.
The training and placement officer (TPO) can view the prediction results in an interactive dashboard, and also filter and search for students based on various properties.
An admin can easily manipulate and verify the data available in the application, if need be.

### Installing

(Python Server setup)

Open up a terminal in VScode (make sure you're in the 'ml-python' directory)

* Installing virtualenv
```
pip install virtualenv
```
* Creating a virtual environment
```
virtualenv venv
```
* Activating virtual environment in Windows
```
venv/Scripts/activate
```
* Installing dependencies in virtual environment
```
pip install -r .\requirements.txt
```
* Running the Flask server
```
python app.py
```



(React server setup)

Open another terminal in the same or different VS code window and navigate to 'client' directory

* Move into the client repo
```
cd client
```

* Install necessary dependencies
```
npm install
```

* Running the React server
```
npm start
```

(NodeJS server setup)

Open another terminal in the same or different VS code window and navigate to 'server' directory

* Move into the 'server' repo
```
cd client
```

* Install necessary dependencies
```
npm install
```

* Running the NodeJS server
```
npm start
```
