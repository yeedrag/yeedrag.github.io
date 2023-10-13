---
title: Reroot DP
date: 2023-10-11 23:03:24
tags: ["CP"]
---

Last CF contest, I solved A~C really quickly, but got stuck for over an hour on a rerooting dp problem. In this blog, I want to learn how to do reroot dp!

## When to reroot dp?

(Disclaimer: I will refer $u$ as the parent node, and $v, c$ as the child node)
Reroot DP occurs when the problem wants a answer that would require making each node as the root of the tree.
You should be able to calculate one of the answers in maybe $O(n)$ time, and is able to transition subtree/outside subtree informations in less than the time to construct them individually with the help of some information gathered during the calculation of the first answer (subtree information, depth...etc).

Lets check out a basic problem to understand reroot dp more:

## [LeetCode 834. Sum of Distances in Tree](https://leetcode.com/problems/sum-of-distances-in-tree/description/)

The problem is basically: For every node $i$, return the sum of depth if $i$ is the root of the tree.
The first step for reroot dp problems is to first determine the answer of a root, lets try to find the answer for node $0$.
This is quite trivial, we denote $sum[u]$ as the depth sum of subtree $u$, we can maintain $depth[v] = depth[u] + 1$ with $depth[0] = 0$, and $sum[u] = depth[u] + \sum sum[v]$ with a simple dfs like this:

```cpp
function<void(int, int)> dfs1 = [&](int u, int p) {
    for(auto v : graph[u]) {
        if(v != p) {
            depth[v] = depth[u] + 1;
            dfs1(v, u);
            dp[u] += dp[v];
        }
    }
    dp[u] += depth[u];
};
```

But when thinking of how to build the answer for the first problem, you also want to start thinking about what information that you need in the rerooting process that can be maintained in the first dfs.
In this problem, we can start thinking of the transition process, then we can know what we want to track in first dfs.

![depthchange](depthroot.png)

The numbers labeled in red is the depth when $0$ is the root, and green is when $2$ is the root. Notice the nodes inside the yellow circle (nodes that aren't in the subtree of $2$) all increased 1 depth, while the nodes inside the purple circle (nodes that are in the subtree of $2$) all decreased 1 depth.

![depthchange2](depthroot2.png)

Another example is from $2$ to $3$, where green is the depth when $2$ is the root, and blue is $3$. You can also see the same transition. we can thus determine the dp transition between nodes:

Denote $dp[i]$ as the answer with $i$ as the root, then

$dp[v] = dp[u] + (n - subtree[v]) - subtree[v] = dp[u] + n - (2 * subtree[v])$

With $dp[0] = sum[0]$. We can do this transition with another dfs.

Notice that we can also precalculate subtree[v] during the first dfs.

Code:

```cpp
vector<int> sumOfDistancesInTree(int n, vector<vector<int>>& edges) {
    vector<int> graph[n];
    for(int i = 0; i < edges.size(); i++) {
        graph[edges[i][0]].pb(edges[i][1]);
        graph[edges[i][1]].pb(edges[i][0]);
    }
    vector<int> depth(n, 0);
    vector<int> dp(n, 0);
    vector<int> subtree(n, 0);
    function<void(int, int)> dfs1 = [&](int u, int p) {
        for(auto v : graph[u]) {
            if(v != p) {
                depth[v] = depth[u] + 1;
                dfs1(v, u);
                dp[u] += dp[v];
                subtree[u] += subtree[v];
            }
        }
        dp[u] += depth[u];
        subtree[u] += 1;
    };
    dfs1(0, -1);
    for(int i = 1; i < n; i++) dp[i] = 0;
    //debug(dp, depth, subtree);
    function<void(int, int)> dfs2 = [&](int u, int p) {
        for(auto v : graph[u]) {
            if(v != p) {
                dp[v] = dp[u] + (n - subtree[v]) - subtree[v];
                //    = dp[u] + n - (2 * subtree[v]);
                dfs2(v, u);
            }
        }
    };
    dfs2(0, -1);
    return dp;
}
```

Time Complexity: $O(n)$

## [Atcoder Edu DP Contest V - Subtree](https://atcoder.jp/contests/dp/tasks/dp_v)

This problem is much less trivial than the first one I would say, but lets think about how to get the answer for an initial root.
We can let $dp_1[i]$ denote the number of ways to color the subtree satisfying the condition plus no color on everything. The reason we want to include no coloring is to make the $dp_1$ transition much easier, as we can notice that
$dp_1[u] = 1 + \prod dp_1[v]$ with $dp[leaf] = 2$ (color it or not).
We can obtain the answer for root is $dp_1[root] - 1$ (removing the one where nothing is colored).

Now, lets think of the transition in our second dfs:

Denote $dp_2[i]$ as the number of ways to color the tree after removing $i$s subtree. This may seem pretty sudden, but it makes sense if you fully understood reroot dp (which I didn't so I struggled on this question for a long time)

In a reroot dp problem, you can treat the whole tree as two components: the subtree of a node $i$, and other parts of the tree. Since when you make $i$ the root instead, all the parts that didn't belong to the subtree will then be inside the subtree (with the original parent node as its child), so if we can maintain the value for this newly added part, we can calculate the answer similar to how we got the first root (as we would have the values for all $i$s child).

$dp_2[v]$ here basically means the $dp_1$ we had, but for node $u$ when $v$ is the root instead.

In the picture, the red circle is $dp_2[2]$, and the green circle is $dp_1[2]$.

![subtreecomp1](subtreecomp1.png)

![subtreecomp2](subtreecomp2.png)

In this problem, the answer for node $u$ is obviously just $(\sum dp_1[v] \cdot dp_2[u]) = (dp_1[u] - 1) \cdot dp_2[u]$
(try to relating it to how we got the answer for root $1$, really helps understanding the concept!)

Now, $dp_2[root] = 1$, how about others?

![subtree3](subtreecomp2.png)

$dp_2[2]$ is cricled in red, and $dp_2[3]$ is circled in green. We can see that $dp[3]$ added the nodes that were in the subtree before, but not in the current subtree, which is all the siblings off 3. We can write out the transision as:

$\displaystyle dp_2[v] = dp_2[u] \cdot (\sum_{c, c \neq v} dp_1[c]) + 1 = dp_2[u] \cdot (\frac{dp_1[u] - 1}{dp_1[v]}) + 1$
(I again, want you to try relating this transition to what we did with $dp_1$)
Which unfortunately, the first one would TLE, and we cannot do the second one because of modular division (and $m$ isn't guaranteed to be prime so it's hard to find inverse).

Fontunately, we can calculate $\sum_{c, c \neq v} dp_1[c]$ by making prefix/suffix products, this way we can avoid the troublesome division, yay! (and we can also calculate it during the first dfs, which is pretty nice!)

code:

```cpp
int mabs(int a, int mod) { 
    return (a % mod + mod) % mod;
}
int mmul(int a, int b, int mod) {
    return mabs((a % mod) * (b % mod), mod);
}
int madd(int a, int b, int mod) { // a + b
    return mabs(a % mod + b % mod, mod);
}
int mmin(int a, int b, int mod) { // a - b
    return mabs(a % mod - b % mod, mod);
}
int fastpow(int a, int n, int mod) { // calculate a^n % mod
    if(n == 0) return 1;
    int half = fastpow(a, n >> 1, mod);
    if(n & 1) return mmul(mmul(half, half, mod), a, mod);
    else return mmul(half, half, mod);
}
int mdiv(int a, int b, int mod) { // (a / b) % mod
    return mmul(a, fastpow(b,mod - 2, mod), mod);
}
void solve() {
    int n, m;
    cin >> n >> m;
    vector<int> graph[n + 1];
    for(int i = 0; i < n - 1; i++) {
        int x, y;
        cin >> x >> y;
        graph[x].pb(y);
        graph[y].pb(x);
    }
    vector<int> dp1(n + 1, 1);
    vector<int> prefix[n + 1];
    vector<int> suffix[n + 1];
    function<void(int, int)> dfs1 = [&](int u, int p) {
        if(graph[u].size() == 1 && graph[u][0] == p) { // leaf
            dp1[u] = 2;
            return;
        }
        prefix[u].pb(1);
        suffix[u].pb(1);
        for(auto v : graph[u]) {
            if(v != p) {
                dfs1(v, u);
                dp1[u] = mmul(dp1[u], dp1[v], m); 
                prefix[u].pb(dp1[u]);
            }
        }
        int tmp = 1;
        for(int i = graph[u].size() - 1; i >= 0; i--) {
            int v = graph[u][i];
            if(v != p) {
                tmp = mmul(tmp, dp1[v], m);
                suffix[u].pb(tmp);
            }
        }
        prefix[u].pb(1);
        suffix[u].pb(1);
        reverse(all(suffix[u]));
        dp1[u] += 1;
    };
    dfs1(1, -1);
    vector<int> dp2(n + 1, 0);
    dp2[1] = 1;
    function<void(int, int)> dfs2 = [&](int u, int p) {
        bool flg = 0;
        for(int i = 1; i <= graph[u].size(); i ++) {
            int v = graph[u][i - 1];
            if(v != p) {
                dp2[v] = madd(mmul(dp2[u], mmul(prefix[u][i - 1 - flg], suffix[u][i + 1 - flg], m), m), 1, m);
                // dp2[v] = (dp2[u] * \sum dp1[c] (c is u's child && c != v)) + 1
                dfs2(v, u);
            } else flg = 1;
        }
    };    
    dfs2(1, -1);
    for(int i = 1; i <= n; i++) cout << mmul((dp1[i] - 1), dp2[i], m) << endl;
    return;
}
```

Time Complexity: $O(n)$

Note: you can also write the first leetcode problem similar to this one too, let $dp_2[u]$ be the sum outside of the subtree $u$, and $dp$ as the sum of subtree $u$, both with $u$ as root. It's uglier because you need to update $dp$ too here because it changes, but I think writing it like this can make the steps of reroot dp clearer.

```cpp
// the same as before
dfs1(0, -1);
vector<int> dp2(n, 0);
function<void(int, int)> dfs2 = [&](int u, int p) {
    for(auto v : graph[u]) {
        if(v != p) {
            dp[v] -= depth[v] * subtree[v]; 
            dp2[v] = dp2[u] + (dp[u] - dp[v] + (n - (2 * subtree[v])));
            dfs2(v, u);
        }
    }
};
dfs2(0, -1);
vector<int> ans;
for(int i = 0; i < n; i++) ans.push_back(dp[i] + dp2[i]);
return ans;
```
