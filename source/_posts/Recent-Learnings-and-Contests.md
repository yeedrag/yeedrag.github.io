---
title: Recent Learnings and Contests
date: 2023-10-29 10:20:35
tags: ["CP"]
---

Ehhh, all of these should've been separate blogs. But I was too lazy, and I don't want to do my art assignment so here we are.

## [10/24 Round 904 (Div 2) Virtual](https://codeforces.com/contest/1884)

Virtual Rank: 997 (According to Codeforces Anytime)
AC Count: 3 / 5

This was one of the contests held in 10/22. pA and pB aren't really hard so I'm not gonna go over them here.

pC was a interesting one, because it is really similar to [E2. Array and Segments (Hard version)](https://codeforces.com/contest/1108/problem/E2), and I tried to just do the segment tree solution I used in it, but got TLE for some reason. After a few attempts and optimizations, I did pass this problem.
pD is a hard problem in my opinion. I originally thought of mobuis function, but it wasn't the case. I didn't solve this in contest, and I suffered from this problem for like two more days. I'm really not that good at number theory :(.

## [10/24 Round 905 (Div 2) Virtual](https://codeforces.com/contest/1888)

Virtual Rank: 131 (According to Codeforces Anytime)
AC Count: 6 / 7

I absolutely cooked this round. I got 2174 performance, which is the highest I've ever gotten.
In my opinion, E > B > A > C >= D2 > D1, which is a really weird distribution.

pA asks if we can make a string into a palindrome when we remove $k$ elements. I definitely over thought this question when in the editorial, it was sufficient to check if the number of odd occurences is not greater than $k + 1$.

```cpp
void solve() {
    int n, k;
    cin >> n >> k;
    string s;
    cin >> s;
    map<char, int> m;
    for(auto &i : s) m[i] += 1;
    int single_cnt = 0, double_cnt = 0;
    for(auto [_, cnt] : m) {
        double_cnt += cnt / 2;
        cnt %= 2;
        single_cnt += cnt;
    }
    if((n - k) % 2 == 1) {
        k -= (single_cnt - 1);
        if(k < 0 || k % 2 == 1) {
            cout << "NO" << endl;
        } else {
            cout << "YES" << endl;
        }
    } else {
        k -= (single_cnt);
        if(k < 0 || k % 2 == 1) {
            cout << "NO" << endl;
        } else {
            cout << "YES" << endl;
        }
    }
    return;
}
```

pB was a really tricky one. The problem gives you an array of integers, and you have an operation $a_i = a_i + 1$. It asks the minimum number of operations that makes the product of the array divisible by $k$ $(1 \leq k \leq  5$).

The first idea is we can make the array $[a_0, a_1, a_2 ... a_{n - 1}]$ into $[a_0 \% k, a_1 \% k ,..., a_{n - 1} \% k]$,
because of the fact that $(a \cdot b) \% k = ((a \% k)  \cdot (b \% k)) \% k$.
Obviously, if there is a $0$ in the array, the answer is $0$.
Else, we want to try to find the number that is closest to $k$ (so we can do the operation until it is k).
But this does not work in all cases, for example, $[1, 1], k = 4$, the answer should be $2$ (add 1 on both elements).
I was stuck we for a while, but notice the constraint for $k$! It turns out, the case I mentioned would only occur for $4$! for $2, 3, 5$, we can just check it as usual, while we need to also check the way to make 2 2's when $k = 4$.

```cpp
void solve() {
    int n, k;
    cin >> n >> k;
    vi vec(n), cntr(k);
    int ans = INF;
    int sum = 1;
    for(int i = 0; i < n; i++) {
        cin >> vec[i];
        vec[i] %= k;
        cntr[vec[i]] += 1; 
    }
    if(cntr[0]) {
        cout << 0 << endl;
        return;
    }
    if(k == 4) {
        if(cntr[2] >= 2) cout << 0 << endl;
        else if(cntr[3]) cout << 1 << endl;
        else if(cntr[2] == 1 && cntr[1] >= 1) cout << 1 << endl;
        else if(cntr[1] >= 2) cout << 2 << endl;
        else {
            int ans = INF;
            for(int i = 1; i <= 3; i++) {
                if(cntr[i]) {
                    ans = min(ans, 4 - i);
                }
            }
            cout << ans << endl;
        }
    } else {
        int ans = INF;
        for(int i = 1; i <= k - 1; i++) {
            if(cntr[i]) {
                ans = min(ans, k - i);
            }
        }
        cout << ans << endl;        
    }
    return;
}
```

pC was extremely easy for me. I solved it in under 7 minutes!
The problem is: Given an array, calculate the number of subarrays such that it occurs in the array as a subsequence exactly once.

Lets say if we have a subarray $a[l, r]$, if this subarray occurs in the array as a subsequence more than once, this implies that there exists (at least) one $r' > r$ s.t $a[r'] = a[r]$, or (at least) one $l' < r$ s.t $a[l'] = a[l]$, or even both.
So, we can find candidates for left/right end point by checking if there isn't the same element on its left/right.

Example:

$1$ $7$ $7$ $2$ $3$ $4$ $3$ $2$ $1$ -> the array
$1$ $1$ $0$ $1$ $1$ $1$ $0$ $0$ $0$ -> potential left endpoint candidates
$0$ $0$ $1$ $0$ $0$ $1$ $1$ $1$ $1$ -> potential right endpoint candidates

Then the answer is just the sum of for each end point, the number of right candidates on its right.
We can calculate this quickly by using an prefix sum.

```cpp
void solve() {
    int n;
    cin >> n;
    vi vec(n + 1, 0);
    for(int i = 1; i <= n; i++) cin >> vec[i];
    set<int> s;
    vector<int> rightcan(n + 2, 0); // i can be used as a right index
    for(int i = n; i >= 1; i--) {
        if(s.find(vec[i]) == s.end()) rightcan[i] += 1;
        rightcan[i] += rightcan[i + 1];
        s.insert(vec[i]);
    }
    s.clear();
    int ans = 0;
    for(int i = 1; i <= n; i++) {
        if(s.find(vec[i]) == s.end()) ans += rightcan[i];
        s.insert(vec[i]);
    }
    cout << ans << endl;
    return;
}
```


(2024/1/7: I noticed I actually haven't finished this post XD, will do it some day...)

