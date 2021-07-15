# Code_Challenge_Answer
                                               Code Challenge

=> Use expressjs with mongodb or mysql for this. You need design database tables yourself based on the question.

     - We have two entities “candidate” and “test_score”
     - candidate has properties name, email address
     - Every candidate has to give 3 tests like “first_round”, “second_round” , “third_round” and scoring for every test is done out of 10. 

=> Now using expressjs, only need to create api to do the following

     - Insert a candidate into database
     - Assign score for a candidate based on the test
     - Api to get highest scoring candidate and average scores per round for all candidates



                                                 Code Answer

Design Database with mongoDB and Assign the following Candidate and their Score.

To run the source Code :

step 1: Download source Code from the repository.
step 2: $ npm install (To install all the neccessary packages)
step 3: $ node app.js  OR  $ nodemon app.js

It will started the server and browse on http://localhost:3000/

The api url with payload or request information are :-

API to get highest scoring candidate is http://localhost:3000/highestScoringCandidate

API to get average scores per round for all candidates is http://localhost:3000/averageScorePerRound
