---
title: Morning Mashup Grind 1
date: 2023-10-20 12:28:27
tags: ["CP"]
---
I've decided that every morning, I will make a random mashup of 5 problems in a suitable range, and I will try solving all of them and check how much time I used. (I will introduce the problem in the order I solved)

Todays Mashup (range $1500$ ~ $2000$)

![mashup1](mashup1.png)

Total Time: 2h 7m 58s
Total WA: 10 (bruh)

## [CF 1217B. Zmei Gorynich](https://codeforces.com/problemset/problem/1217/B)

WA count: 1

This problem is pretty easy, We want to choose the largest $d_i - h_i$, and only use it.
We can also use the highest damage one to deal the final blow (which I didn't observe at first).
but there was one small observation that I got wrong, I didn't combine two observations, and wrote that if the biggest $d_i - h_i$ is negative, there must be no answer.
But for example if $x = 3$, $d_i = 4$, $h_i = 5$, the $d_i - h_i$ will be negative, but we can still kill it with the final blow.

```cpp
void solve() {
    int n, x;
    cin >> n >> x;
    vector<int> v(n);
    int mx = -1;
    for(int i = 0; i < n; i++) {
        int d, h; // d, h 
        cin >> d >> h;
        v.pb(d - h);
        mx = max(mx, d);
    }
    sort(all(v), greater<int>());
    int cnt = 1;
    x -= mx;
    if(x <= 0) {
        cout << 1 << endl;
        return;
    }
    if(v[0] <= 0) {
        cout << -1 << endl;
    } else {
        cout << (x - 1) / v[0] + 2 << endl;
    }
    return;
}
```

Time Complexity: $O(nlogn)$

## [CF 1527B2. Palindrome Game (hard version)](https://codeforces.com/problemset/problem/1527/B2)

WA Count: 9 (lmao)

This problem cost me around half of my total time, and 90% of the WA.
I got an idea really quickly, but it turns out that it was entirely wrong, and I didn't notice until much later.

My thought was it is obvious that the current person would want to rush to making a palindrome as soon as possible, and the other person would just keep reversing, and after making a palindrome they just switch roles, the other person try to make it into a palindrome again, and the current person just reverses.

This is my first submission:

```cpp
void solve() {
    int n; string s;
    cin >> n >> s;
    int alice = 0, bob = 0;
    int altpair = 0, zeropair = 0;
    for(int i = 0; i < (n / 2); i++) {
        if(s[i] != s[n - i - 1]) {
            altpair += 1;
        } else if(s[i] == '0' && s[n - i - 1] == '0') {
            zeropair += 1;
        }
    }
    //cerr << "ZERO: " << zeropair << endl;
    bob += altpair;
    alice += (zeropair + 1) / 2;
    bob += (zeropair / 2);
    if(alice > bob) {
        cout << "BOB" << endl;
    } else if(alice < bob) {
        cout << "ALICE" << endl;
    } else {
        cout << "DRAW" << endl;
    }
    return;
}
```

This goes wrong for a case like $0000$, where in my code would cause a draw, but the optimal way would be like:
$0000$ -> $1000$ -> $1100$ -> $1110$ -> $0111$ -> $1111$ where Alice is guaranteed to lose.
There is also problems like if the length is odd and the middle is 0, we can flip that and still makes it a palindrome.

This is such a case/observation heavy problem, and really shows that I need to practice more.

```cpp
void solve() {
    int n; string s;
    cin >> n >> s;
    int alice = 0, bob = 0;
    int altpair = 0, zeropair = 0;
    for(int i = 0; i < (n / 2); i++) {
        if(s[i] != s[n - i - 1]) {
            altpair += 1;
        } else if(s[i] == '0' && s[n - i - 1] == '0') {
            zeropair += 1;
        }
    }
    bool flg = 0;
    if(n % 2 == 1 && s[n / 2] == '0') flg = 1;
    if(altpair) {
        int zerocnt = flg + altpair + (zeropair * 2);
        if(zerocnt == 2 && flg == 1) {
            cout << "DRAW" << endl;
        } else {
            cout << "ALICE" << endl;
        }
    } else {
        int zerocnt = flg + (zeropair * 2);
        if(zerocnt % 2 == 1 && zerocnt != 1) {
            cout << "ALICE" << endl;
        } else {
            cout << "BOB" << endl;
        }
    }
    return;
}
```

Time complexity: Time Complexity: $O(n)$

## [CF 1462E2. Close Tuples (hard version)](https://codeforces.com/problemset/problem/1462/E2)

WA Count: 0

For some reason this problem is 1700, but this is the fastest one I did in this mashup, I solved it in like under 15 minutes. It's just a very standard sliding window with combinatorics problem.
We go through every number $i$ and just count the number of subsets with $i$ as the last number, we can maintain the possible candidates with sliding window. You also need to know how to do modular inverse but other than that it's trivial.

```cpp
// mod defined ver
vector<int> factorial(2e5 + 5);
const int mod = 1e9 + 7;
int mabs(int a) { //轉成 0 <= a < mod的形式
    return (a % mod + mod) % mod;
}
int mmul(int a, int b) {
    return mabs((a % mod) * (b % mod));
}
int madd(int a, int b) { // a + b
    return mabs(a % mod + b % mod);
}
int mmin(int a, int b) { // a - b
    return mabs(a % mod - b % mod);
}
int fastpow(int a, int n) { // calculate a^n % mod
    if(n == 0) return 1;
    int half = fastpow(a, n >> 1);
    if(n & 1) return mmul(mmul(half, half), a);
    else return mmul(half, half);
}
int mdiv(int a, int b) { // (a / b) % mod
    return mmul(a, fastpow(b, mod - 2));
}
int C(int a, int b) {
    if(b > a) return 0;
    return mdiv(factorial[a], mmul(factorial[b], factorial[a - b]));
}
void solve() {
    int n, m, k;
    cin >> n >> m >> k;
    vector<int> v(n);
    for(auto &i : v) cin >> i;
    sort(all(v));
    int l = 0, ans = 0;
    for(int i = 0; i < n; i++) {
        while(l < i && v[i] - v[l] > k) l++;
        ans = madd(ans, C((i - l), m - 1));
    }
    cout << ans << endl;
    return;
}
```

## [CF 1283C. Friends and Gifts](https://codeforces.com/contest/1283/problem/C)

WA Count: 0

Random Implement Problem, just make like three groups, need gifts, need to give gifts, and need both.
We can give/get gifts between groups (or inside both). just simulate this process and thats pretty much it.

There is definitely a better solution for this (In fact, the model solution uses graphs), but I'm lazy.

```cpp
void solve() {
    int n;
    cin >> n;
    vector<int> v(n + 1, 0);
    for(int i = 1; i <= n; i++) cin >> v[i];
    vector<pii> status(n + 1, {0, 0}); // gift, get
    for(int i = 1; i <= n; i++) {
        if(v[i] != 0) {
            status[i].first = 1;
            status[v[i]].second = 1;
        }
    }
    deque<int> needgift, needget, both;
    for(int i = 1; i <= n; i++) {
        if(status[i].first == 0 && status[i].second == 0) both.pb(i);
        if(status[i].first == 1 && status[i].second == 0) needget.pb(i);
        if(status[i].first == 0 && status[i].second == 1) needgift.pb(i);
    }
    deque<int> tmp;
    while(both.size() >= 2) {
        int a = both.front(); both.pop_front();
        int b = both.front(); both.pop_front();
        v[a] = b;
        needgift.pb(b);
        needget.pb(a);
    }
    while(both.size()) {
        while(needgift.size() && both.size()) {
            int a = needgift.front(); needgift.pop_front();
            int b = both.front(); both.pop_front();
            tmp.pb(b);
            v[a] = b;
        }
        while(tmp.size()) {
            needgift.pb(tmp.front());
            tmp.pop_front();
        }
    }
    while(needget.size()) {
        while(needgift.size() && needget.size()) {
            int a = needgift.front(); needgift.pop_front();
            int b = needget.front(); needget.pop_front();
            v[a] = b;
        }
    }
    for(int i = 1; i <= n; i++) {
        cout << v[i] << " ";
    }
    cout << endl;
    return;
}
```

Time complexity: $O(n)$

## [CF 1108E1. Array and Segments (Easy version)](https://codeforces.com/problemset/problem/1108/E1)

WA Count: 0

$n$ is really small here, so we can just bruteforce it.

We can fix each number, and apply all segments that doesn't go through this fixed point, then just maintain the maximum answer and used segments.
I personally think the idea strikes resemblance with [CF 1882B. Sets and Union](https://codeforces.com/contest/1882/problem/B).

```cpp
void solve() {
    int n, m;
    cin >> n >> m;
    vector<int> v(n);
    vector<int> chosen;
    for(int i = 0; i < n; i++) {
        cin >> v[i];
    }
    vector<pii> segment(m);
    for(int i = 0; i < m; i++) {
        int l, r;
        cin >> l >> r;
        l--; r--;
        segment[i].first = l;
        segment[i].second = r;
    }
    int ans = *max_element(all(v)) - *min_element(all(v));
    for(int i = 0; i < n; i++) {
        vector<int> v2 = v;
        vector<int> tmpchosen;
        for(int k = 0; k < m; k++) {
            int l = segment[k].first; int r = segment[k].second;
            if(l <= i && i <= r) continue;
            for(int j = l; j <= r; j++) v2[j]--;
            tmpchosen.pb(k + 1);
        }
        if(*max_element(all(v2)) - *min_element(all(v2)) > ans) {
            ans = *max_element(all(v2)) - *min_element(all(v2));
            chosen = tmpchosen;
        }
    }
    cout << ans << endl;
    cout << chosen.size() << endl;
    for(auto i : chosen) cout << i << " ";
    cout << endl;
    return;
}
```

Time Complexity: $O(n^2m)$

## Afterword

I think I can easily get under two hours, or even 1 hour 45 minutes, I was stuck on that 1 problem for too long! I think I will also document each problem's individual time.

## [(Additional) CF 1108E2. Array and Segments (Hard version)](https://codeforces.com/problemset/problem/1108/E2)

Compared to the easy version, $n$ is much bigger this time, so we cannot apply all segments with bruteforce.
Luckily, segment tree exists, so we can just do the same thing, except we use a lazy tag segment tree to apply the segments.
You happily coded the segment tree, thinking "such an easy 2100", and you get TLE on TC 13. (Based on experience)
The problem here is if we still enumerate through all the segments, even if our operations are $O(mlogn)$, the total complexity is still $O(nm + mlog(n))$, which doesn't pass with the constraints.
Fortunately, there is a beautiful observation here: Let's say we have all the segments that doesn't include the index $i$, we can easily know which segments that doesn't include $i + 1$. The way to do this is to add the segments that end at $i$, and remove the segments that start at $i + 1$. This way, each segment only gets added and removed once, and our complexity is reduced to $O(n + mlog(n))$.

```cpp
// lazy seg template from kactl code book
const int inf = 1e9;
struct Node {
    Node *l = 0, *r = 0;
    int lo, hi, madd = 0, val = -inf, val2 = inf;
    Node(int lo,int hi):lo(lo),hi(hi){} // Large interval of -inf
    Node(vi& v, int lo, int hi) : lo(lo), hi(hi) {
        if (lo + 1 < hi) {
            int mid = lo + (hi - lo)/2;
            l = new Node(v, lo, mid); r = new Node(v, mid, hi);
            val = max(l->val, r->val);
            val2 = min(l->val2, r->val2);
        }
        else val = val2 = v[lo];
    }
    int query(int L, int R) {
        if (R <= lo || hi <= L) return -inf;
        if (L <= lo && hi <= R) return val;
        push();
        return max(l->query(L, R), r->query(L, R));
    }
    int query2(int L, int R) {
        if (R <= lo || hi <= L) return inf;
        if (L <= lo && hi <= R) return val2;
        push();
        return min(l->query2(L, R), r->query2(L, R));
    }
    void add(int L, int R, int x) {
        if (R <= lo || hi <= L) return;
        if (L <= lo && hi <= R) {
            madd += x;
            val += x;
            val2 += x;
        }
        else {
            push(), l->add(L, R, x), r->add(L, R, x);
            val = max(l->val, r->val);
            val2 = min(l->val2, r->val2);
        }
    }
    void push() {
        if (!l) {
            int mid = lo + (hi - lo)/2;
            l = new Node(lo, mid); r = new Node(mid, hi);
        }
        if (madd)
            l->add(lo,hi,madd), r->add(lo,hi,madd), madd = 0;
    }
};
vector<int> addseg[(int)2e5 + 5];
vector<int> removeseg[(int)2e5 + 5];
void solve() {
    int n, m;
    cin >> n >> m;
    vector<int> v(n);
    for(int i = 0; i < n; i++) {
        cin >> v[i];
    }
    vector<pii> segment(m);
    for(int i = 0; i < m; i++) {
        cin >> segment[i].first >> segment[i].second;
        segment[i].first--; segment[i].second--; // [l, r]
        addseg[segment[i].first].pb(i);
        removeseg[segment[i].second].pb(i);
    }
    Node* tr = new Node(v, 0, v.size());
    int ans = (tr -> query(0, n)) - (tr -> query2(0, n));
    int ansidx = -1;
    for(int k = 0; k < m; k++) {
        int l = segment[k].first; int r = segment[k].second;
        if(l <= 0 && 0 <= r) continue;
        tr -> add(l, r + 1, -1);
    }
    if((tr -> query(0, n)) - (tr -> query2(0, n)) > ans) {
        ans = (tr -> query(0, n)) - (tr -> query2(0, n));
        ansidx = 0;
    }
    for(int i = 1; i < n; i++) {
        // remove segments with l = i;
        for(auto idx : addseg[i]) {
            tr -> add(segment[idx].first, segment[idx].second + 1, 1);
        }
        // add segments with r = i - 1;
        for(auto idx : removeseg[i - 1]) {
            tr -> add(segment[idx].first, segment[idx].second + 1, -1);
        }
        if((tr -> query(0, n)) - (tr -> query2(0, n)) > ans) {
            ans = (tr -> query(0, n)) - (tr -> query2(0, n));
            ansidx = i;
        }   
    }
    vi chosen;
    for(int k = 0; k < m; k++) {
        if(ansidx == -1) break;
        int l = segment[k].first; int r = segment[k].second;
        if(l <= ansidx && ansidx <= r) continue;
        else chosen.pb(k + 1);
    }
    cout << ans << endl;
    cout << chosen.size() << endl;
    for(auto i : chosen) cout << i << " ";
    cout << endl;
    return;
}
```

Time Complexity: $O(n + mlog(n))$
