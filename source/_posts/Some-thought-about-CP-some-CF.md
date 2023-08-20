---
title: Some thought about CP + some CF
date: 2023-08-07 00:24:06
tags: ["Life", "CP"]
---
I'm seriously considering whether I should try pursuing CP in college. I did CP in highschool before, and really didn't achieve much. The main thing I should think about is what I can get from doing CP in college.
I talked to Kuroma yesterday and I decided to give myself one year for CP:
If I can't get in ICPC or can't get to atleast master in CF I'll quit and focus on DL. I think this is a solid plan do really determine if I should spend my time on this, hope I can do it!
I've also contacted a previous member of UW Madison's ICPC team--RobeZH. I was really inspired and shock when I saw in his blog that he only started CP in his undergrad, and within only 4 years he became IGM and did successfully in ICPC. I hope to know more about CP in Madison and I wish to become as good as him.
Another thing is that I went and contacted a former friend of mine which I thought I would never forgive him. There was a annual team-based algorithm contest and we went as a team before. For last years contest, he replaced me with another person that barely knows how to code, and didn't notify me whatsoever. I was in a really dark time and this really made me collapse. I thought we were good friends and he wouldn't do something like this. I blocked him everywhere and I absolutely hated him since.
After a whole year and being in a better position, I was talking with one of our mutual friend who did well in the college entrance exam. He mentioned that he was really sorry and wanted to apologize to me. I was in dilemma because I thought it would be super awkward. I told the friend to tell him that I wish him the best luck at Singapore (He is going to NTU). I told my counselor about this and she encouraged me to ask him about why he didn't invite me.
I was like ok fuck it the worst thing thats gonna happen is I hate him more, I have nothing to lose! So I went and questioned him.
The reason he gave me was he was in a hurry and genuinely did not think that much. This was such a bad reason that it actually made me laugh. Although after alot of thinking, I realized that there is basically no point to hate him really, and him giving a bad reason without even trying to come up with a better one really made me chuckle, so I just kinda forgave him. I don't think we could be as good as a friend like before, but hey, at least I don't hate him anymore.

Well, enough for recent updates and lets check out some CF problems :D

## [CF 1336A. Linova and Kingdom](https://codeforces.com/problemset/problem/1336/A)

This problem is a problem I mindsolved at the salon but didn't implement until today.

> You are given a tree with $n$ ($n \leq  2\cdot10^5$) nodes and 1 as the tree's root.
> There are two kind of nodes--Industry node and tourism node.
> The happiness is defined as the number of tourism nodes on the path from a industry node to the root. (The root can also be a tourism node or industry node)
> Given a value $k$ ($1 \leq  k \leq n$), You must assign $k$ nodes as industry nodes. What is the maximum possible sum of happiness achievable?

There are a few observations we can easily notice:

We should always choose the ones with the deeper depth on a path, as it would give us more possible happiness compared to chosing one with a smaller depth.

We can let every node be a tourist node, and try assigning industry nodes and calculate the changes each industry node made.

Now, lets try to figure out the happiness a node with depth $d$ and a subtree size of $t$ provides.
Obviously, the number of tourism nodes on the path to the root is just equal to $d$. But we also need to take account for the happiness taken away from changing it from a tourist node to a industry node.
The total ammount of happiness taken away is equal to the size of the subtree $t$. So for a industry node with depth $d$ and a subtree size of $t$, The total happiness it contributes is $t - d$.

Now we can just greedily choose nodes that contribute the highest happiness and AC this question!

Code

```cpp
const int MAXN = (int)2e5 + 5;
vector<int> graph[MAXN];
vector<int> depth(MAXN);
vector<int> sz(MAXN);
void dfs(int node, int prev) {
    depth[node] = depth[prev] + 1;
    if(graph[node].size() == 1) sz[node] = 0;
    for(auto i : graph[node]) {
        if(i != prev) {
            dfs(i, node);
            sz[node] += (sz[i] + 1);
        }
    }
}
void solve() {
    int n, k;
    cin >> n >> k;
    for(int i = 0; i < n - 1; i++) {
        int u, v;
        cin >> u >> v;
        graph[u].pb(v);
        graph[v].pb(u);
    }
    depth[1] = -1;
    dfs(1, 1);
    vector<pii> vec;
    int ans = 0;
    for(int i = 1; i <= n; i++) {
        vec.pb({depth[i] - sz[i],i});
    }
    sort(all(vec), [](pii a, pii b){return a.first > b.first;});
    for(int i = 0; i < k; i++) {
        ans += vec[i].first;
    }
    cout << ans << endl;
    return;
}
```

Time Complexity: $O(nlogn)$

Next off are questions all from CF Round 890 (Div 2), I couldn't participate in time unfortunately :/
The statements are all super clear so I'll omit the part explaining the statements.

## [CF 1856A. Tales of a Sort](https://codeforces.com/problemset/problem/1856/A)

A trivial problem so I'll just provide my code and skip this question...

Code

```cpp
void solve() {
    int n;
    cin >> n;
    int arr[n];
    for(int i = 0; i < n; i++) cin >> arr[i];
    int ans = 0;
    for(int i = 0; i < n - 1; i++) {
        if(arr[i] > arr[i + 1]) {
            ans = max(ans, arr[i]);
        }
    }
    cout << ans << endl;
    return;
}
```

Time Complexity: $O(n)$

## [CF 1856B. Good Arrays](https://codeforces.com/problemset/problem/1856/B)

There is a easy solution to this: We can set all 1's into 2, and anything not equal to 1 as one. Now if the current sum is smaller or equal to the original sum, it's possible, else it isn't.
The idea is quite simple here. We make sure everything satifys $a_i \neq b_i$, and if the sum is less then the original one, it's not hard to see that we can just put the remaining needed values on one index.

Code

```cpp
void solve() {
    int n;
    cin >> n;
    int arr[n];
    int sum = 0;
    int sum2 = 0;
    for(int i = 0; i < n; i++) {
        cin >> arr[i];
        sum += arr[i];
        if(arr[i] == 1) {
            sum2 += 2;
        } else {
            sum2 += 1;
        }
    }
    if(n == 1) {
        cout << "NO" << endl;
        return;
    }
    if(sum2 > sum) {
        cout << "NO" << endl;
    } else {
        cout << "YES" << endl;
    }
    return;
}
```

Time Complexity: $O(n)$

## [CF 1856C. To Become Max](https://codeforces.com/problemset/problem/1856/C)

(notice that $n \leq 1000$)
I initally thought this problem was super easy and quickly came up with a greedy solution, just to be proven wrong by one of the samples.
The idea is for each index, we use binary search to find the maximum value this index can become.

lets say for an index $idx$ with a original value $arr[idx]$, and we want to check if making it become $m$ is possible or not:

if $arr[idx] >= m$ it's obviously possible.
else, we add a cost of $arr[idx] - i$ and start checking and modifying indexes on the right:
for each index $i$ on the right, we only need it to become $m - (i - idx)$ for $idx$ to become $m$.
if we encounter one that already satisfys this condition, we can stop and check if the overall cost is higher than what we have.
The same goes for when we get to the end, except we also need to check if the last element is large enough.

Code

```cpp
int n, k;
bool func(int arr[], int m, int idx) {
    int cost = 0;
    for(int i = idx; i < n; i++) {
        if(i == n - 1) return k >= cost and arr[i] >= m - (i - idx);
        if(arr[i] >= m - (i - idx)) return k >= cost;
        cost += (m - arr[i] - (i - idx));
    }
    return k >= cost;
}
void solve() {
    cin >> n >> k;
    int arr[n];
    int mx = -1;
    for(int i = 0; i < n; i++) {
        cin >> arr[i];
        mx = max(mx, arr[i]);
    }
    for(int i = 0; i < (n - 1); i++) {
        int l = -1, r = INF; 
        while(r - l > 1) {
            int m = (r + l) >> 1;
            if(func(arr, m, i) == true) {
                l = m;
            } else {
                r = m;
            }
        }
        mx = max(mx, l);
    }
    cout << mx << endl;
    return;
}
```

Time Complexity: $O(n^2logn)$

## [CF 1856D. More Wrong](https://codeforces.com/problemset/problem/1856/D)

Well... this was a tricky question.
I did thought of the crucial part of solving this question, but I just couldn't assemble it.
Another thing is that im just not that good with D&Q problems.

The thing I observed quickly is this:

Denote $q(l, r)$ as a query of $[l, r]$, if $q(l, r) == q(l, r - 1)$, $a[r]$ is bigger than every value in the sub array $a[l...r - 1]$.

I failed to realize that if I know the biggest index in two adjacent sub arrays, I can use this idea to find which one is bigger!

The whole solution is as follows:

We divide the arrays into several subarrays of 2 (there will be one with only 1 index if it's odd).
For the subarrays of 2, We each ask a query to determine which is bigger. (the index if theres only 1 index)
Now we recursively do the following:
For each two adjacent subarrays $[l, m]$ and $[m+1, r]$ with this largest index at $l_{max}$ and $r_{max}$, I can ask 2 queries, $q(l_{max}, r_{max})$ and $q(l_{max}, r_{max} - 1)$, to determine which is bigger. (if $r_{max} == l_{max} + 1$ we just ask $q(l_{max}, r_{max})$)

And the final biggest index is what we want!

The formal proof for cost is in the editorial,
although we can also get an extremely rough estimate of the cost: $\displaystyle \sum_{i = 1}^{log(2000)}(\frac{1}{2^{(i-1)}})n^2 \approx 4\cdot n^2 < 5\cdot n^2$

Code (Note that my implementation is pretty bad, check out the editorial for a concise version!)

```cpp
int solve(int l, int r) {
    if(r - l == 1) {
        cout << "? " << l << " " << r << endl;
        int ret;
        cin >> ret;
        if(ret == 1) return l;
        else return r;
    } else if(r - l == 0) {
        return l;
    }
    int maxl = solve(l, (l + r) >> 1);
    int maxr = solve(((l + r) >> 1) + 1, r);
    if(maxr - maxl == 1) {
        cout << "? " << maxl  << " " << maxr << endl;
        int ret;
        cin >> ret;
        if(ret == 1) return maxl;
        else return maxr;
    }
    int ans1;
    int ans2;
    cout << "? " << maxl << " " << maxr << endl;
    cin >> ans1;
    cout << "? " << maxl << " " << maxr - 1 << endl;
    cin >> ans2;
    if(ans1 == ans2) {
        return maxr;
    } else {
        return maxl;
    }
}
```

Time Complexity: $O(n)$
