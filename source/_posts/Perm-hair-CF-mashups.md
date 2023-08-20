---
title: Perm hair + CF mashups
date: 2023-08-04 19:02:30
tags: ["Life", "CP"]
---
Hello! .w.
I went to the hair salon today to straighten and stick my hair to my head (idk what its called in English lmao).
The chemical process was super itchy and I had to maintain the same posture for like 20 minutes, truely inhumane...
Although after the process my hair did look pretty nice :D
In the process, I was bored, so I mind solved a mashup of 1400 to 1700 CF problems.
Suprisingly, I got them all correct after writing them at home! Im still worthy!
The problems were all pretty nice so I want to share them here (sorted by  CF difficulty):

## [CF 1714E. Add Modulo 10](https://codeforces.com/problemset/problem/1714/E)

The problem is basically as follows:
> For each test case, you are given an array of $n$ ($n \leq  2\cdot10^5$) integers,
> you can apply an operation $a_i = a_i + (a_i \space \text{mod} \space 10)$ on any elemment,
> Is it possible to make every element in the array the same by using a finite ammount of operations?

An Easy math pattern finding problem.
We can try by applying the operation on all unit digits and observe the pattern of which the unit digit changes.

> Example:
> 9 $\rarr$ 8 $\rarr$ 6 $\rarr$ 2 $\rarr$ 4 $\rarr$ 8 $\rarr$ 6 $\rarr$ 2....
> 7 $\rarr$ 4 $\rarr$ 8 $\rarr$ 6 $\rarr$ 2.....

After trying all of them, its easy to notice that there are two patterns:
If the unit digit is 0 or 5. After one operation the unit digit will become 0.
Else, after some ammount of operation, the unit digit will land on a 8 -> 6 -> 2 -> 4 infinite cycle.

Now we can obtain the solution:
If there is any element with 0 or 5, we apply the operation to every element once and check if they are all the same.
Else, we apply operations until they all have the same unit digit, and check if they have the same value modulo 20.
The reason its 20 is because one cycle is 8 -> 6 -> 2 -> 4, which adds up to 20.

Code (flg1 is to check if there is a element whose unit digit is 5 or 0, flg2 is check if its possible)

```cpp
int func(int n) {
    return n + (n % 10);
}
void solve() {
    int n;
    cin >> n;
    int arr[n];
    bool flg1 = false;
    bool flg2 = false;
    for(int i = 0; i < n; i++) {
        cin >> arr[i];
        if(arr[i] % 5 == 0) flg1 = true;
    }
    if(flg1) {
        for(auto &i : arr) {
            i = func(i);
        }
        int cmp = arr[0];
        for(int i = 0; i < n; i++) {
            if(arr[i] != cmp) flg2 = true;
        }
    } else {
        for(int i = 0; i < n; i++) {
            while(arr[i] % 10 != 2) {
                arr[i] = func(arr[i]);
            }
        }  
        int cmp = arr[0] % 20;
        for(int i = 0; i < n; i++) {
            if(cmp != (arr[i] % 20)) flg2 = true;  
        }
    }
    if(flg2) {
        cout << "NO" << endl;
    } else {
        cout << "YES" << endl;
    }
    return;
}
```

Time Complexity: $O(n)$

## [CF 1249C2. Good Numbers (hard version)](https://codeforces.com/problemset/problem/1249/C2)

The problem is basically as follows:
> A good number is one that can be made by using distinct powers of 3.
> For each test case, you are given a number $n$ ($n \leq 10^{18}$), output the smallest good number greater or equal to $n$.

Honestly not sure why this question is rated 1500...

The idea is really simple: Maintain a array $pre$, where $pre_i = 3^i + 3^{i-1} + ... + 3^0$.
You want to find the one that is greater or equal to $n$, and from large to small greedily remove powers of 3 if possible.

Code

```cpp
void solve() {
    vector<int> pre(39);
    vector<int> pre2(39);
    pre[0] = 1;
    pre2[0] = 1;
    int val = 1;
    for(int i = 1; i <= 38; i++) {
        val *= 3;
        pre[i] = pre[i - 1] + val;
        pre2[i] = val; // 3^i
    }
    int q;
    cin >> q;
    while(q--) {
        int n;
        cin >> n;
        int val = *lower_bound(all(pre), n); 
        for(int i = 38; i >= 0; i--) {
            if(val - pre2[i] >= n) val -= pre2[i];
        }
        cout << val << endl;
    }
    return;
}
```

Time Complexity: $O(1)$

## [CF 1081B. Farewell Party](https://codeforces.com/problemset/problem/1081/B)

The problem is basically as follows:
> Given an array, each $i$ belongs to some group. $a_i$ denotes how many people are in different groups then $i$, check if theres a valid grouping that can satisfy the array's constraints.

First, lets think about what $a_i$ actually means:
> $a_i$ denotes how many people are in different groups then $i$.

Can be changed to:

> $n - a_i$ denotes how many people are in the same group as $i$.

Although it doesn't seem much, we can actually use this knowledge to our advantage:
This means that for a possible combination, there must be $n - a_i$ people whose value in the array is $a_i$!
Further more, there might be multiple groups with the same amount of people in it.
So we can change our previous conclusion to there must be a multiple of $n - a_i$ people whose value in the array is $a_i$!
After knowing this, we just need to assign groups to each person and AC this question :D

```cpp
void solve() {
    int n;
    cin >> n;
    int sol[n];
    vector<int> cnt[n + 1]; // saves indexes of ppl with same count of ppl in same group
    bool flg = true;
    int val;
    mset(sol, 0);
    for(int i = 0; i < n; i++) {
        cin >> val;
        cnt[(n - val)].pb(i);
    }
    int hat = 1; // current group index
    int hatcnt = 0; // count in the current group
    for(int i = 1; i <= n; i++) { // i = number of ppl with same hat
        if(cnt[i].size() % i == 0) {
            for(int j = 0; j < cnt[i].size(); j++) {
                sol[cnt[i][j]] = hat;
                hatcnt += 1;
                if(hatcnt == i) {
                    hatcnt = 0;
                    hat += 1;
                }
            }
        } else {
            flg = false;
        }
    }
    if(!flg) {
        cout << "Impossible" << endl;
    } else {
        cout << "Possible" << endl;
        for(auto i : sol) cout << i << " ";
        cout << endl;
    }
 
    return;
}
```

Time Complexity: $O(n)$

## [CF 1543D1. RPD and Rap Sheet (Easy Version)](https://codeforces.com/contest/1543/problem/D1)

The problem is basically as follows:
> There is a password $x$ between $0$ to $n - 1$ ($n \leq 2\cdot10^{5}$). You can guess the password $q$ ($q \leq n$) times.
> After each failed guess $y$, the password will become $z$ where $x⊕z = y$ ($⊕$ denotes binary XOR)

The problem statement actually gave me a big hint:
> Password between $0$ to $n - 1$ and guess the password $q$ ($q \leq n$) times.
> $\rarr$ Try all passwords from 0 to n - 1!

Now, the problem is that the password changes after each failed attempt. How would we solve this?
Lets observe the encoding function of the password:
> $x⊕z = y$ $\rarr$ $x⊕x⊕z = x⊕y$ $\rarr$ $x⊕y = z$ (Because $x⊕x = 0$)

Denote the password for step $i$ as $x_i$, for a failed query $q_i$, the password becomes $x_{i}⊕q_i$ = $x⊕q_i⊕q_{i-1}...⊕q_1$ !
Thus if we also encode our query $q_i$ with $⊕q_{i-1}...⊕q_1$, the encoded value for $x_i$ is the same as the original $x$ to query $q_i$!

Code

```cpp
void solve() {
    int t;
    cin >> t;
    while(t--){
        int xorval = 0;
        int n, k, r;
        cin >> n >> k;
        for(int i = 0; i < n; i++) {
            int guess = xorval ^ i;
            cout << guess << endl;
            xorval ^= guess;
            cin >> r;
            if(r == 1 or r == -1) break;
        }
    }
    return;
}
```

Time Complexity: $O(n)$

[3:09AM]
Im like also super dizzy and kinda drunk now lol, first time bar experience lets gooo!
I drank a long island ice tea, gin tonic, a few shots of whiskey and some mixed stuff.
Honesty im suprised that I have a decent alcohol tolerance, but still, drink safely!
