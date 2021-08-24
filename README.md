# Crypto_NAVI

### Start Date : July 30th, 2021
### Goal       : This project aims to provide service that searches the most benficial swap between two currencies by routing through pools and De-ex's.
### Contributors : 김태웅, 서원용, 서지혜, 이가은, 조민규



## Algorithm : modification of matrix multiplication.
### The theoretical background is the following

#### v1, 2 ####
Form a matrix of exchange ratio between currencies.
Replacing Matrix[ i ][ j ] with MaxValue(Matrix[ i ][ j ], Matrix[ i ][ k ] * Matrix[ k ][ j ]) would give a better routing for that currency exchange.
Iterating through the whole matrix, above matrix would be replaced to the maximum exchange ratio. 
If we record the routing for every exchange, we would get the optimum exchange route.
This usually ends in n^2.67 given that n is the total number of currencies used for swaps.

#### v3, 4 ####
Because exchange ratio is too easy to be broken, we need to consider AMM(Automated Market Maker) and the equation is like this:x*y=k.
In other words, it is impossible to just simply multiply two exchange ratio.
Therefore, we can just add one more currency to original path.
It takes t * n^2 given that t is iteration time and n is the total number of currencies.
(It was originally t * n^3 at v3.)
This ends early if there is nothing to update so it is usually less than 10 * n^2.

#### How To Start ####
1. Download all the files by ``` git clone https://github.com/Mingyu-Lucif/Crypto_NAVI.git```
2. ``` npm install ``` at swap_frontend
3. ``` npm start ``` at swap_frontend
