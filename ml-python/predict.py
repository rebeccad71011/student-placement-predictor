import warnings
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import sklearn 
from sklearn import model_selection
from sklearn.linear_model import LogisticRegression
warnings.filterwarnings('ignore')
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn import metrics
import pickle


#Loading the single csv file to a variable named 'placement'
placement=cereal_df =pd.read_csv(r'Placement_Data_Full_Class.csv')
placement_copy=placement.copy()

# Cleaning the data
placement_copy['salary'].fillna(value=0, inplace=True)
placement_copy.drop(['sl_no','ssc_b','hsc_b'], axis = 1,inplace=True) 

#clearing outliers
Q1 = placement_copy['hsc_p'].quantile(0.25)
Q3 = placement_copy['hsc_p'].quantile(0.75)
IQR = Q3 - Q1    #IQR is interquartile range. 

filter = (placement_copy['hsc_p'] >= Q1 - 1.5 * IQR) & (placement_copy['hsc_p'] <= Q3 + 1.5 *IQR)
placement_filtered=placement_copy.loc[filter]


# Make copy to avoid changing original data 
object_cols=['gender','workex','specialisation','status']

# Apply label encoder to each column with categorical data
label_encoder = LabelEncoder()
for col in object_cols:
    placement_filtered[col] = label_encoder.fit_transform(placement_filtered[col])

dummy_hsc_s=pd.get_dummies(placement_filtered['hsc_s'], prefix='dummy')
dummy_degree_t=pd.get_dummies(placement_filtered['degree_t'], prefix='dummy')
placement_coded = pd.concat([placement_filtered,dummy_hsc_s,dummy_degree_t],axis=1)
placement_coded.drop(['hsc_s','degree_t','salary'],axis=1, inplace=True)

feature_cols=['gender','ssc_p','hsc_p','hsc_p','workex','etest_p','specialisation','mba_p',
            'dummy_Arts','dummy_Commerce','dummy_Science','dummy_Comm&Mgmt','dummy_Others','dummy_Sci&Tech']

X=placement_coded.drop(['status'],axis=1)
y=placement_coded.status

# Train-Test split
X_train, X_test, y_train, y_test = train_test_split(X, y,train_size=0.8,random_state=1)


# Log regression model creation
logreg = LogisticRegression(solver='liblinear', random_state=0).fit(X_train, y_train)
# gender, ssc, hsc, degree, workex, e-test, specialisation, mba
def predict(details):

    if details[0] =="Male":
        details[0] = 1
    else:
        details[0] = 0
    # 1 ip_l.append(float(input("Enter ssc_p")))
    # 2 p_l.append(float(input("Enter hsc_p")))
    # 3 ip_l.append(float(input("Enter degree %")))
    if details[4] =="yes" or "Yes":
        details[4] = 1
    else:
        details[4] = 0
    # 5 ip_l.append(float(input("Enter e test score")))
    if details[6] != "":
        details[6] = 1
    else:
        details[6] = 0
    
    details = details + [0, 0, 0, 0, 0, 0]
    ip=[details]


    y_pred=logreg.predict(ip)
    if (y_pred[0]==1):
        print("Prediction for this request was: 'placed'")
        return "placed"
    else:
        print("Prediction for this request was: 'unplaced'")
        return "unplaced"