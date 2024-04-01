---
title: CM+ CF Practice
date: 2024-03-23 17:11:21
tags: ["CP"]
---
Hey guys, life has been pretty busy lately and tough so I haven't updated in a while, so I decided to write a short blog about some CM+ (>=1900) problems I solved in CF lately. The difficulty will we roughly sorted by how hard I feel it is.

## [CF 1923D. Slimes (1800)](https://codeforces.com/contest/1923/problem/D)

I know this question is only 1800, but I feel like it deserves at least 1900.

The high level idea for this problem is to find how many slimes we need to accumulate from the left/right to eat this slime. Formally, for each index $i$, find the maximum $j < i$ where $a[j] + ... + a[i - 1] > a[i]$, and the maximum $k > i$ where $a[i + 1] + ... + a[k] > a[i]$, then the answer for $i$ is $\text{min}(k - i, i - j)$. It's easy to see we can use prefix sum and binary search to obtain $O(logn)$ per index.

The tricky part about this problem is dealing with duplicate values in the same row, as they technically cannot eat each other, and it cause alot of problems while implementing.

```cpp
    void solve() {
        int n;
        cin >> n;
        vi v(n + 1, 0);
        for(int i = 1; i <= n; i++) cin >> v[i];
        int curnum = v[1], k = 1;
        int val[n + 1][2];
        for(int i = 0; i <= n; i++) {
            for(int j = 0; j <= 1; j++) {
                val[i][j] = -1;
            }
        }
        for(int t = 0; t <= 1; t++) {
            vi pre(n + 1, 0);
            for(int i = 1; i <= n; i++) {
                pre[i] = pre[i - 1] + v[i];
            }
            //debug(pre);
            for(int i = 2; i <= n; i++) {
                int l = 0, r = i - k - 2;
                if(!(r < l || pre[i - 1] - pre[l] <= v[i])) {
                    while(r - l > 1) {
                        int m = (r + l) >> 1;
                        if(pre[i - 1] - pre[m] > v[i]) l = m;
                        else r = m - 1; 
                    }
                    if(pre[i - 1] - pre[r] > v[i]) val[i][t] = i - (r + 1);
                    else val[i][t] = i - (l + 1);
                }
                if(v[i - 1] > v[i]) val[i][t] = 1;
                if(v[i] != curnum) {
                    k = 1;
                    curnum = v[i];
                } else {
                    k += 1;
                }
            }
            reverse(v.begin() + 1, v.end());
        }
        for(int i = 1; i <= n; i++) {
            if(val[i][0] == -1 && val[n - i + 1][1] == -1) {
                cout << -1 << " ";
            } else if(val[i][0] == -1 || val[n - i + 1][1] == -1) {
                cout << max(val[i][0], val[n - i + 1][1]) << " ";
            } else {
                cout << min(val[i][0], val[n - i + 1][1]) << " ";
            }
        }
        cout << endl;
        return;
    }
```

Time complexity: $O(nlogn)$

## [CF 1133F2. Spanning Tree with One Fixed Degree (1900)](https://codeforces.com/contest/1923/problem/D)

This problem honestly does not deserve 1900, I solve it in like 15 minutes max.

If the number of edges on the node 1 is less then $D$, then the answer is clearly no. Else, we want to first find "crutial edges", which are edges connected to the node 1 that must be connected in order for the whole graph to be connected.

We can find these edges by first doing our process of building a spanning tree while skipping all edges that connects to 1. After that it's easy to find edges that we must form to connect the whole graph.

Let's denote the number of crutial edges as $k$, and the total edges connecting node 1 as $K$, then $k <= D <= K$ clearly must hold.

Now, how do we actually construct the tree? A easy way is to first connect the crutial edges, then add edges connecting node 1 to get $D$ edges, and lastly connect random edges to obtain a spanning tree, it should be obvious that this guarantees a spanning tree with $D$ edges connecting to node 1.

```cpp
const int MAXN = 2e5 + 5;
int dsu[MAXN];
int rk[MAXN];
int find(int x){
    return dsu[x] == x ? x : dsu[x] = find(dsu[x]);
}
void modify(int x,int y){
    int pa = find(x);
    int pb = find(y);
    if(pa != pb) {
        if(rk[pa] < rk[pb]) swap(pa, pb); // pa > pb
        dsu[pb] = pa;
        rk[pa] += rk[pb];
    }
}
void init(int n) {
    for(int i = 0; i < n; i++) {
        dsu[i] = i;
        rk[i] = 1;
    }
}
void solve() {
    int n, m, d;
    cin >> n >> m >> d;
    init(n + 1);
    int total = 0;
    vector<pii> v;
    for(int i = 0; i < m; i++) {
        int a, b;
        cin >> a >> b;
        if(a == 1 || b == 1) total += 1;
        v.pb({a, b});
    }
    for(auto [a, b] : v) {
        if(a == 1 || b == 1) {
            continue;
        } else {
            modify(a, b);
        }
    }
    vector<bool> usedhead(n + 1, false);
    int need = 0;
    vector<pii> v2;
    vector<pii> v3;
    for(auto [a, b] : v) {
        if(a == 1) {
            if(usedhead[find(b)] == false) {
                need += 1;
                usedhead[find(b)] = true;
                v2.pb({a, b});
            } else {
                v3.pb({a, b});
            }
        } else if(b == 1) {
            if(usedhead[find(a)] == false) {
                need += 1;
                usedhead[find(a)] = true;
                v2.pb({a, b});
            } else {
                v3.pb({a, b});
            }
        }
    }
    if(need > d || total < d) {
        cout << "NO" << endl;
        return;
    }
    cout << "YES" << endl;
    init(n + 1);
    for(auto [a, b] : v2) {
        cout << a << " " << b << endl;
        modify(a, b);
    }
    for(int i = 0; i < d - need; i++) {
        cout << v3[i].first << " " << v3[i].second << endl;
        modify(v3[i].first, v3[i].second);
    }
    for(auto [a, b] : v) {
        if(a == 1 || b == 1) {
            continue;
        }
        if(find(a) != find(b)) {
            cout << a << " " << b << endl;
            modify(a, b);
        }
    }
    return;
}
```

Time complexity: $O(n)$

## [CF 1141G. Privatization of Roads in Treeland (1900)](https://codeforces.com/contest/1141/problem/G)

Another problem I don't feel like it's 1900.

Let's say we use $k'$ colors, then by the pigeonhole principle, nodes that have more than $k'$ edges connected would clearly become a "not good" node.

It's not difficult to se that we can always color the tree with $k'$ colors, and only nodes that have more than $k'$ edges would be a "not good" node. Consider this strategy of coloring: if a node has more than $k'$ edges, then we color all of them as the same color, and if the node doesn't have more than $k'$ edges, we can clearly color them with all distinct colors.

We can find the number of nodes that have more than $k'$ edges connected by doing a simple prefix sum.

```cpp
const int MAXN = 2e5 + 5;
vector<pii> graph[MAXN];
vi deg(MAXN, 0);
vi color(MAXN, 0);
int root = -1;
int colnum = MAXN;
void dfs(int cur, int pre) {
    if(graph[cur].size() == 1) root = cur;
    deg[graph[cur].size()] += 1;
    for(auto [v, idx] : graph[cur]) {
        if(v == pre) continue;
        dfs(v, cur);
    }
}
void dfs2(int cur, int pre, int precol) {
    if(graph[cur].size() <= colnum) {
        int c = 1;
        for(auto [v, idx] : graph[cur]) {
            if(v == pre) continue;
            if(c == precol) c++;
            color[idx] = c;
            c++;
            dfs2(v, cur, color[idx]);
        }
    } else {
        for(auto [v, idx] : graph[cur]) {
            if(v == pre) continue;
            color[idx] = precol;
            dfs2(v, cur, color[idx]);
        }
    }
}
void solve() {
    int n, k;
    cin >> n >> k;
    for(int i = 0; i <= n + 1; i++) {
        graph[i].clear();
        deg[i] = 0;
        color[i] = 0;
    }
    colnum = MAXN;
    for(int i = 0; i < n - 1; i++) {
        int a, b;
        cin >> a >> b;
        graph[a].pb({b, i});
        graph[b].pb({a, i});
    }
    dfs(1, -1);
    for(int i = n; i >= 1; i--) {
        deg[i] += deg[i + 1];
        colnum = i;
        if(deg[i] > k) {
            break;
        }
    }
    dfs2(root, -1, -1);
    cout << colnum << endl;
    for(int i = 0; i <= n - 2; i++) {
        cout << color[i] << " ";
    }
    cout << endl;
    return;
}
```

Time complexity: $O(n)$

## [CF 1922D. Berserk Monsters (1900)](https://codeforces.com/contest/1922/problem/D)

A not so difficult simulation problem.

The trick here is to find a efficient way to simulate this process. Notice that only when a monster gets killed, the two monster beside it would have a chance to get killed in the next round, so there's actually not alot of monsters we need to consider for each round.

Note: My implementation is extremely convoluted and lackluster, refer to the editorial for a better implementation.

```cpp
set<int> s, used;
vector<int> atk;
vector<int> def;
queue<int> q1, q2, q3;
void solve() {
    s.clear();
    atk.clear();
    def.clear();
    while(q1.size()) q1.pop();
    while(q2.size()) q2.pop();
    while(q3.size()) q3.pop();
    int n;
    cin >> n;
    for(int i = 0; i < n; i++) {
        int tmp;
        cin >> tmp;
        atk.pb(tmp);
        s.insert(i);
        q1.push(i);
    }
    for(int i = 0; i < n; i++) {
        int tmp;
        cin >> tmp;
        def.pb(tmp);
    }
    while(n--) {
        used.clear();
        while(q1.size()) {
            int fr = q1.front();
            q1.pop();
            queue<int> q;
            auto it = s.find(fr);
            int sum = 0;
            if(it != s.begin()) {
                q.push(*(prev(it, 1)));
                sum += atk[*(prev(it, 1))];
            }
            if(next(it, 1) != s.end()) {
                q.push(*(next(it, 1)));
                sum += atk[*(next(it, 1))];
            }
            if(sum > def[*it]) {
                q3.push(*it);
                while(q.size()) {
                    q2.push(q.front());
                    q.pop();
                }
            }
        }
        cout << q3.size() << " ";
        //debug(q3);
        while(q3.size()) {
            s.erase(q3.front());
            q3.pop();
        }
        while(q2.size()) {
            if(s.find(q2.front()) == s.end() || used.find(q2.front()) != used.end()) {
                q2.pop();
                continue;
            }
            used.insert(q2.front());
            q1.push(q2.front());
            q2.pop();
        }
    }
    cout << endl;
    return;
}
```

Time complexity: $O(nlogn)$

## [CF 1168B. Good Triple (1900)](https://codeforces.com/contest/1168/problem/B)

To solve this, one needs to observe that the length of a substring without the required condition is actually at most 8.

After knowing this fact, we can bruteforce finding all bad substrings and calculate the answer with it.

For some reason my implementation kept failing until I completely rewrote it and it suddenly passed.

```cpp
string s;
bool isgood(int l, int r) {
    for(int l2 = l; l2 <= r; l2 ++) {
        for(int i = 1; i <= 5 && l2 + 2 * i <= r; i++) {
            if(s[l2] == s[l2 + i] && s[l2 + i] == s[l2 + (2 * i)]) {
                return false;
            }
        }
    }
    return true;
} 
void solve() {
    cin >> s;
    int ans = 0;
    for(int l = 0; l < (int)(s.size()) - 2; l++) {
        int mx = 0;
        for(int r = l + 1; r < (int)s.size() && r < l + 10; r++) {
            if(isgood(l, r)) {
                mx = r;
            }
        }
        ans += s.size() - (mx + 1);
    }
    cout << ans << endl;
    return;
}
```

Time complexity: $O(nlogn)$

## [CF 1729F. Kirei and the Linear Function (1900)](https://codeforces.com/contest/1729/problem/F)

Interesting problem, but has some points that made it a clear giveaway.

First, notice in the queries that they want $v(l_i, r_i)$, so we must need some way to calculate $v(l_i, r_i)$ in $O(1)$ or $O(logn)$ time.

The second giveaway is the specific mod number 9. If you remember from middle school, the way to check if a number can be divided by 9 is to check if the sum of it's digits can also be divided by 9.

Using these two hints, we can easily find out the answer has to do with prefix sums!

We can preprocess a prefix sum and preprocess the smallest (and second smallest) $L$ for each number from 0 to 9.

```cpp
void solve() {
    string s;
    cin >> s;
    int w, m;
    cin >> w >> m;
    vi pre(s.size() + 1);
    pre[0] = 0;
    for(int i = 1; i <= s.size(); i++) {
        pre[i] = pre[i - 1] + (s[i - 1] - '0');
    }
    int smallest[9];
    int ssmallest[9];
    for(int i = 0; i <= 8; i++) {
        smallest[i] = -1;
        ssmallest[i] = -1;
    }
    for(int i = 1; i + w - 1 <= s.size(); i++) {
        int num = (pre[i + w - 1] - pre[i - 1]) % 9;
        if(smallest[num] == -1) {
            smallest[num] = i;
        } else if(ssmallest[num] == -1) {
            ssmallest[num] = i;
        }
    }
    while(m--) {
        int l, r, k;
        cin >> l >> r >> k;
        int num = (pre[r] - pre[l - 1]) % 9;
        pii minans = {1e9, 1e9};
        for(int i = 0; i <= 8; i++) {
            for(int j = 0; j <= 8; j++) {
                if(((i * num + j) % 9) == k) {
                    if(i != j) {
                        if(smallest[i] != -1 && smallest[j] != -1) {
                            minans = min(minans, {smallest[i], smallest[j]});
                        }
                    } else {
                        if(smallest[i] != -1 && ssmallest[j] != -1) {
                            minans = min(minans, {smallest[i], ssmallest[j]});
                        }
                    }
                }
            }
        }
        if(minans.first == 1e9) {
            cout << -1 << " " << -1 << endl;
        } else {
            cout << minans.first << " " << minans.second << endl;
        }
    }
    return;
}
```

Time complexity: $O(n)$ preprocess, $O(1)$ per query

## [CF 1791G2. Teleporters (Hard Version) (1900)](https://codeforces.com/contest/1791/problem/G2)

Let's define the cost of a teleporter as $min(a_i + i, a_i + n + 1 - i)$, which is just the minimum cost of walking to it from the front or to the back. It's clear that after the initial teleporter, we will choose the teleporters based from lowest cost to highest cost.

The problem now is how to determine the first teleporter we want to use? We can iterate using each teleporter as the first one, and using binary search + prefix sum to determine how many teleporters we can use after the first one. The problem that encounters with this is when you binary search, you might include the one where you already used as the initial teleporter, so you would need to keep track and deduct the value when your binary search includes that teleporter.

```cpp
vi v(2e5 + 5, 0);
vector<pii> order;
vi prefix;
void solve() {
    int n, c;
    cin >> n >> c;
    order.clear();
    prefix.clear();
    for(int i = 1; i <= n; i++) {
        cin >> v[i];
        order.pb({min(v[i] + i, v[i] + (n - i + 1)), i});
    }
    sort(all(order));
    prefix.pb(0);
    for(int i = 0; i < n; i++) {
        prefix.pb(prefix.back() + order[i].first);
    }
    int ans = 0;
    for(int i = 0; i < n; i++) {
        int cst = c - (v[order[i].second] + order[i].second);
        int l = 0, r = n;
        while(r - l > 1) {
            int m = (r + l) / 2;
            int cmp = prefix[m];
            if(m >= (i + 1)) cmp -= order[i].first;
            if(cst >= cmp) {
                l = m;
            } else {
                r = m;
            }
        }
        int ret = prefix[r];
        int use;
        if(r >= (i + 1)) ret -= order[i].first;
        if(cst >= ret) use = r;
        else use = l;
        if(use < (i + 1) && cst >= 0) use += 1;
        ans = max(ans, use);
    }
    cout << ans << endl;
    return;
}
```

Time complexity: $O(nlogn)$

## [CF 1929D. Sasha and a Walk in the City (1900)](https://codeforces.com/contest/1929/problem/D)

A really tricky dp problem that stomped me for a good while, but the solution is one of the shortest in this list.

Let $dp[u]$ denote the number of **non-empty** subtrees rooted at node $u$ such that there is no pair of vertices where a node is the ancestor of the other.

We can get the transition $dp[u] = \prod (dp[v_i] + 1)$, where $v_i$ is the children of $u$.

This dp state is essentially picking the combination of subtrees (we add 1 for when we don't choose an empty set for that subtree). When all of them were empty, it means that only the node $u$ is dangerous.

Now to calculate the answer, we need to divide into two parts:

if there is no pair of vertices where a node is the ancestor of the other, then the answer would be $dp[1] + 1$.

But we can also tolerate exactly 1 pair of vertices where one is the ancestor of the other. Lets say if $u$ is the ancestor of another vertex, then the number of ways for this to happen is $\sum dp[v_i]$, where $v_i$ is the children of $u$.

We then consider the case for every node, and the answer becomes $(dp[1] + 1) + dp[2] + ... + dp[n] = 1 + \sum dp[i]$.

```cpp
const int MAXN = 3e5 + 5;
vi graph[MAXN];
vi dp(MAXN, 0);
const int MOD = 998244353;
void dfs(int cur, int prev) {
    for(auto v : graph[cur]) {
        if(v == prev) continue;
        dfs(v, cur);
        dp[cur] *= (dp[v] + 1);
        dp[cur] %= MOD;
    }
}
void solve() {
    int n;
    cin >> n;
    for(int i = 1; i <= n; i++) {
        graph[i].clear();
        dp[i] = 1;
    }
    for(int i = 0; i < n - 1; i++) {
        int u, v;
        cin >> u >> v;
        graph[u].pb(v);
        graph[v].pb(u);
    }
    dfs(1, -1);
    int ans = 1;
    for(int i = 1; i <= n; i++){
        ans += dp[i];
        ans %= MOD;
    }
    cout << ans << endl;
    return;
}
```

Time complexity: $O(n)$

## [CF 1856E1. PermuTree (easy version) (1800)](https://codeforces.com/contest/1856/problem/E1)

I genuinely do not understand how this problem is 1800...maybe im just really bad at dp.

Let's day for a node $k$ with subtrees size ${S_1,...,S_i}$, and in each subtree we can assign the values as either bigger than the node k or smaller, then our goal is to group them into two groups, such as the product of the size of the two groups are maximum.

The first claim is we can always get the optimal upperbound with some kind of assignment, I actually do not know how to prove this and I just winged it when I wrote it but if you are interested you can check out the editorial :).

Now, the problem becomes cutting the set ${S_1,...,S_i}$ into two sets, such that the product is maximized. This is actually an NP hard problem, but $\sum{S_i}$ is actually pretty small, so we can tranform it into a subset sum problem.

Let $S = \sum{S_i}$, then we can get $max((S - j) \cdot j)$ as the answer if $j$ is a possible subset sum.

It should be pretty easy to write an $O(n^2)$ solution for subset sum, so just do it for each node and yay!

Theres one small problem... doing subset sum is $O(n^2)$, and actually wouldn't $\sum{S_i}$ become $O(n^3)$? even if it doesn't, we need to do it for each node, then wouldn't it become $O(n^3)$?

The answer is actually no (This is why I originally got stuck because I also though it at least has to be $O(n^3)$)! Refer to #7 of this [blog](https://codeforces.com/blog/entry/100910), really interesting property to think about tree dps!

```cpp
const int MAXN = 5005;
vector<int> graph[MAXN];
vector<int> sz(MAXN, 0);
int ans = 0;
void dfs(int cur, int pre) {
    vi vec;
    sz[cur] += 1;
    if(graph[cur].size() == 1 && cur != 1) {
        return;
    }
    for(auto v : graph[cur]) {
        if(v == pre) continue;
        dfs(v, cur);
        sz[cur] += sz[v];
        vec.pb(sz[v]);
    }
    int sum = sz[cur] - 1;
    vector<int> dp(sum + 1, 0);
    dp[0] = true;
    int mx = 0;
    for(auto i : vec) {
        for(int j = sum; j - i >= 0; j--) {
            dp[j] |= dp[j - i];
        }
    }
    for(int i = 0; i <= sum; i++) {
        if(dp[i]) mx = max(mx, i * (sum - i));
    }
    ans += mx;
}
void solve() {
    int n;
    cin >> n;
    for(int i = 2; i <= n; i++) {
        int u;
        cin >> u;
        graph[u].pb(i);
        graph[i].pb(u);
    }
    //for(int i = 1; i <= n; i++) debug(graph[i]);
    // get subtree size 
    dfs(1, -1);
    cout << ans << endl;
    return;
}
```

Time complexity: $O(n^2)$

## [CF 1856E2. PermuTree (hard version) (2700)](https://codeforces.com/contest/1856/problem/E2)

Note: I was not able to solve this problem even following the editorial, the time limit is very strict but I feel like still including this problem and mentioning the techniques use for this problem.

The are two main optimizations for this problem: $O(n\sqrt{n})$ subset sum trick and using bitsets to optimize the dp by $\frac{1}{64}$. Very tricky stuff :)

## [CF 1914G1. Light Bulbs (Easy Version) (2100)](https://codeforces.com/contest/1914/problem/G1)

The editorial uses XOR hashing, but I feel like my alternative solution using graph theory is way more intuitive.

We can transform the whole problem as a graph theory problem. Let the bulbs be nodes, and we will add a directed edge $i$ to $j$ if the bulb $j$ is between the two bulb $i$, which basically means if $i$ is lighted, we can light up color $j$ by the second operation.

It's not difficult to see the answer for the first problem is the number of components in the graph (It's easy to see that with this way of construction, we can always find a node in the subgraph that can reach all other nodes), and the answer for the second problem is the product for each subgraph, the number of nodes that can reach every other node in that subgraph.

The first answer is very easy to obtain, but the second one is slightly tricky. A naive way is to dfs from each node, and if they can reach all other nodes then we include it in. Unfortunately this fails as the complexity could go up to $O(n^3)$.

Here is where the trick Strongly Connected Component (SCC) comes in! The main use for SCC is we can "shrink" a directed graph into a Directed Acyclic Graph (DAG), and it's easy to see after shrinking, only the first starting node (the node with in degree 0) can reach all other nodes! So we just need to find how many nodes does this starting node consist.

Our whole algorithm is as follows:

Build graph -> Do SCC -> Count the in degree of the nodes for the new DAG -> calculate how many nodes does each new node consist -> Calculate answer.

I use kosaraju algorithm for SCC, because im too lazy to learn tarjan TMT.

```cpp
const int MAXN = 1005;
int n;
vi g[MAXN];
vi g2[MAXN];
vi scc(MAXN, 0);
vi sccsz(MAXN, 0);
bool visited[MAXN];
vector<bool> used(MAXN, 0);
vi v;
int sccCnt = 0;
vector<int> indeg(MAXN, 0);
vector<int> s;
void init() {
    for(int i = 1; i <= n; i++) {
        g[i].clear();
        g2[i].clear();
        scc[i] = 0;
        used[i] = 0;
        visited[i] = false;
        indeg[i] = 0;
        sccsz[i] = 0;
    }
    sccCnt = 0;
    s.clear();
    v.clear();
}
void dfs1(int u) {
    visited[u] = true;
    for (int v : g[u])
        if (!visited[v]) dfs1(v);
      s.push_back(u);
}
void dfs2(int u) {
      scc[u] = sccCnt;
      for (int v : g2[u]) {
        if (!scc[v]) dfs2(v);
      }
}
void solve() {
    cin >> n;
    init();
    for(int i = 0; i < 2 * n; i++) {
        int num;
        cin >> num;
        v.pb(num);
    }
    // build graph
    for(int i = 0; i < 2 * n; i++) {
        if(used[v[i]]) continue;
        used[v[i]] = true;
        for(int j = i + 1; j < 2 * n && v[j] != v[i]; j++) {
            g[v[i]].push_back(v[j]);
            g2[v[j]].push_back(v[i]);
        }
    }
    // do SCC
    for(int i = 1; i <= n; i++) {
        if(!visited[i]) dfs1(i);
    }
    for(int i = n - 1; i >= 0; i--) {
        if(scc[s[i]] == 0) {
            sccCnt += 1;
            dfs2(s[i]);
        }
    }
    // count indeg
    for(int i = 1; i <= n; i++) {
        for(auto j : g[i]) {
            if(scc[i] != scc[j]) indeg[scc[j]] += 1;
        }
    }
    int ans1 = 0, ans2 = 1;
    for(int i = 1; i <= n; i++) {
        sccsz[scc[i]] += 1;
    }
    for(int i = 1; i <= sccCnt; i++) {
        if(indeg[i] == 0) {
            ans1 += 1;
            ans2 *= (sccsz[i] * 2);
            ans2 %= 998244353;
        }
    }
    cout << ans1 << " " << ans2 << endl;
    return;
}
```

Time complexity: $O(n^2)$

## [CF 1914G2. Light Bulbs (Hard Version) (2300)](https://codeforces.com/contest/1914/problem/G2)

Our solution for easy version was bounded by the graph building process which was $O(n^2)$, but there is actually a way to optimize the graph to only $2n$ edges!

I did not really understand how this optimization works, but I'll still include it here and maybe try understanding it some day.

```cpp
    // build graph
    deque<int> dq;
    for(int i = 0; i < 2 * n; i++) {
        if(dq.size()) {
            g[dq.back()].push_back(v[i]);
            g2[v[i]].push_back(dq.back());
        }
        if(used[v[i]] == 0) {
            used[v[i]] += 1;
            dq.push_back(v[i]);
        } else {
            used[v[i]] += 1;
            while(dq.size() && used[dq.back()] == 2) dq.pop_back();
        }
    }
```

Time complexity: $O(n)$

Afterwards: Chicago really has some good food! Although serious note, I really need to get myself back on the track after this spring break, I know I can do it, fighting! And in terms of CF, I think I'll start doing more 2000~2200 problems, and after that I'll start doing contests again.
