---
title: Interesting CodeChef Problem
date: 2024-02-11 12:05:34
tags: ["CP"]
---
A while ago, someone in a server asked for help with this problem:

## [Equality Etiquette](https://www.codechef.com/problems/EQUAL2?tab=statement)

I solved it while I was on the airplane coming back to the US, and I thought it was a really interesting problem!

I'll give my detailed explaination for this problem here:

The first thing I noticed immediately, is that the operations are not as complicated as it seems.
We only care about making the difference of the two numbers 0, and we can notice that adding a number to the bigger number does the same as subtracting a number to the smaller number, which is adding the number to the difference. The same goes for subtracting to the bigger number and adding to the smaller number, which subtracts the number from the difference.

So the problem now becomes: Whats the minimum number of n, such that when we apply positive and negative signs on certain numbers from 1 to n, the total sum will become the difference?
Before finding this exactly though, I first questioned that does there exist a number that couldn't be constructed by the operation, so I tried a couple numbers and I noticed that we can always construct the number with the operations!

Namely, if the difference is odd, we can use the first 2 \* diff - 1 numbers, and all numbers apart from diff will pair up and eliminate each other. An example is diff = 3:

```cpp
diff = 3
1, 2, 3, 4, 5 -> (1 + 5) - (2 + 4) + 3 = 3
```

And if the difference is even, we can use the first 2 \* diff numbers, so that the left out pair will pair up with the number 2 * diff. An example is diff = 4:

```cpp
diff = 4
1, 2, 3, 4, 5, 6, 7, 8 -> (1 + 7) - (2 + 6) + (3 + 5) - (8) + 4 = 4
```

So now we know an answer always exists. But now we need to figure out how can we get the optimal, smallest n? To figure this out, I tried out a few values of n to see what numbers can we obtain from the operation:

```cpp
n = 4
1 + 2 + 3 + 4 = 10
(-1) + 2 + 3 + 4 = 8
1 + (-2) + 3 + 4 = 6
1 + 2 + (-3) = 4 = 4
...etc

n = 5
1 + 2 + 3 + 4 + 5 = 15
(-1) + 2 + 3 + 4 + 5 = 13
1 + (-2) + 3 + 4 + 5 = 11
1 + 2 + (-3) + 4 + 5 = 9
...etc
```

Have you noticed a pattern? It turns out that we can actually make all S(n) - 2k > 0 numbers (All numbers smaller than S(n) greater than 0 that have the same parity as it), where S(n) is the sum from 1 to n. You can prove this easily with induction but I think just observing should be quite obvious.
Now, the problem is reduced to finding a minimum number n, such that S(n) is greater than the difference and they have the same parity.
We can find the S(n) > difference with a simple binary search, then just find the closest n with the same parity as diff, it will only be at most 2 away from the first number we obtained.
Code:

```cpp
int sum(int num) {return (num * (num + 1)) / 2;}
void solve() {
    int a, b;
    cin >> a >> b;
    int diff = abs(a - b);
    if(diff == 0) {
        cout << 0 << endl;
        return;
    }
    int l = 1, r = 1e6;
    while(r - l > 1) {
        int m = (r + l) / 2;
        if(sum(m) < diff) l = m;
        else r = m;
    }
    int num = (sum(l) >= diff) ? l : r;
    while((sum(num) % 2) != (diff % 2)) {
        num += 1;
    }
    cout << num << endl;
    return;
}
```
