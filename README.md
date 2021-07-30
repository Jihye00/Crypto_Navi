# Crypto_NAVI

### Start Date : July 30th, 2021
### Goal       : This project aims to provide service that searches the most benficial swap between two currencies by routing through pools and De-ex's.
### Collaborators : 김태웅, 서원용, 서지혜, 이가은, 조민규



## Algorithm : modification of matrix multiplication.
### The theoretical background is the following
Form a matrix of exchange ratio between currencies.
Replacing Matrix[i][j] with MaxValue(Matrix[i][j], Matrix[i][k] * Matrix[k][j]) would give a better routing for that currency exchange./
Iterating through the whole matrix, above algorithm would be changed into the maximum exchange ratio. 
If we record the routing for every exchange, we would get the optimum exchange route.
This usually ends in n^2.67 given that n is the total number of currencies used for swaps.
