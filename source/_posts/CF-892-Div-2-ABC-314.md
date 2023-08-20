---
title: CF 892 (Div. 2) + ABC 314
date: 2023-08-15 23:04:11
tags: ["CP"]
---
Well, I was todays year old when I found out you can't register a contest 5 minutes beforehand... I guess I'll vir it tomorrow then.

I did two contest on 8/12, and they were both really interesting!

## [ABC 314](https://atcoder.jp/contests/abc314)

Solve: 4/8

I haven't done atcoder contests for a while now, and I honestly didn't do as well as I expected. A to D were pretty standard atcoder problems, so I'll skip them.
E was a question about like probability expectation but weirdly, I still can't understand the question even now.
F was is really good question that I wasn't able to solve it in-contest but upsolved later. The statement is pretty clear so I'll skip it.
The idea here is the matches form a tree with the probabilities as the edge's weight.

![probability tree](https://img.atcoder.jp/abc314/98f0c3212584232f0fda47c6f40ae1bf.png)

We can then dfs to get the sum of probabilities which is the expectation for the nodes.
To build this tree, we can use DSU to maintain the status of belonged groups. (We can't use union by rank though because the parent needs to be the biggest indexed one)

Code

```cpp
const int MAXN = 2e5 + 5;
const int mod = 998244353;
int dsu[MAXN * 2];
int rk[MAXN * 2];
vector<pii> graph[MAXN * 2];
vector<int> ans(MAXN);
int n;
int mabs(int a) { 
    return (a % mod + mod) % mod;
}
int mmul(int a, int b) {
    return mabs((a % mod)*(b % mod));
}
int madd(int a, int b) { // a + b
    return mabs(a % mod + b % mod);
}
int mmin(int a, int b) { // a - b
    return mabs(a % mod - b % mod);
}
int fastpow(int a, int n) { // calculate a^n % mod
    if(n == 0) return 1;
    int half = fastpow(a, n / 2);
    if(n & 1) return mmul(mmul(half, half), a);
    else return mmul(half, half);
}
int mdiv(int a, int b) { // (a / b) % mod
    return mmul(a, fastpow(b, mod - 2));
}
int find(int x){
    return dsu[x] == x ? x : dsu[x] = find(dsu[x]);
}
void modify(int x,int y){
    int pa = find(x);
    int pb = find(y);
    if(pa != pb) {
        // if(rk[pa] < rk[pb]) swap(pa, pb); // pa > pb
        dsu[pb] = pa;
        rk[pa] += rk[pb];
    }
}
void init(int n) {
    for(int i = 1; i <= 2 * n; i++) {
        dsu[i] = i;
        if(i <= n) rk[i] = 1;
        else rk[i] = 0;
    }
}
void dfs(int node, int prev, int val) {
    if(node <= n) {
        ans[node] = val;
        return;
    }
    for(auto [c, w] : graph[node]) {
        if(c == prev) continue;
        dfs(c, node, madd(val, w));
    }
}
void solve() {
    cin >> n;
    init(n);
    int idx = n + 1;
    for(int i = 0; i < n - 1; i++) {
        int a, b;
        cin >> a >> b;
        int node_a = find(a);
        int node_b = find(b);
        graph[idx].pb({node_a, mdiv(rk[node_a], rk[node_a] + rk[node_b])});
        graph[idx].pb({node_b, mdiv(rk[node_b], rk[node_a] + rk[node_b])});
        modify(node_a, node_b);
        modify(idx, node_a);
        idx += 1;
    }
    dfs(idx - 1, -1, 0);
    for(int i = 1; i <= n; i++) {
        cout << ans[i] << " ";
    }
    cout << endl;
    return;
}
```

Time Complexity: $O(nlog(\text{mod}))$ (due to mod division which is equal to $log(\text{mod})$)

## [CF round 892 (Div. 2)](https://codeforces.com/contest/1859)

This was an pretty usual contest, and I got -25... sad. Im really not good at combating stress, so I got WA on pA unfortunately, and I didn't solve pD in contest.
pC was not a really good question imo. I got a $O(n^4)$ that got TLE and is stumped me for a bit.
But I got another idea: I precomputed all the answers (as $n$ was quite small), and actually AC'd it! amazing!
the pD from this contest was pretty nice, maybe I'll make an editorial later on I guess (Im lazy haha)
