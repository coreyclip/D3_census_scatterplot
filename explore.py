import pandas as pd 

cdf = pd.read_csv('data.csv') #census data
hdf = pd.read_csv('health.csv') #health data from the cdc
#print(df.corr()['depression'])

for i in hdf.Question.unique():
    #break down into specific questions
    q_df = hdf[hdf['Question'] == i]
    
    for a in q_df.Response.unique():
        #break down into specific responses for each question
        r_df = q_df[q_df['Response'] == a]
        print(r_df[['Question', 'Response']].head(1)) 
