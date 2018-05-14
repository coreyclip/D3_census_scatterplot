import pandas as pd 

cdf = pd.read_csv('data.csv',index_col='state', encoding='utf-8') #census data
print(cdf.info())
hdf = pd.read_csv('health.csv', encoding='utf-8') #health data from the cdc
#print(df.corr()['depression'])

correlation_results = []

for i in hdf.Question.unique():
    #break down into specific questions
    q_df = hdf[hdf['Question'] == i]
    
    for a in q_df.Response.unique():
        #break down into specific responses for each question
        r_df = q_df[q_df['Response'] == a].set_index('Locationdesc')
        # rename data_values to the question and response 
        question = str(r_df['Question'].unique()[0])
        response = str(a)

        name = question + "__" + response
        
        #array of values connected to the above question and response
        cor_query = r_df["Data_value"].rename(name)
        #print(cor_query)
        # append the data_value of this particular questions and response by state to the census data
        
        try:
            print("Mining correlations for....")
            print(name)    
            correlations = pd.concat([cdf, cor_query], axis=1).corr()[name]
            print(correlations)
            correlation_results.append(correlations) 
        except:
            print(f"cannot process {name}")

#print(pd.DataFrame(correlation_results))
