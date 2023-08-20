---
title: Blog...again?
date: 2023-08-04 02:10:50
tags: ["Life", "CP"]
cover: transparent
---
Hello again!

You may be wondering why I said again?
The reason is because I used to have another blog with the same domain, but I didn't update it at all. So I basically redeployed
a new blog in the event of me going to college (UW Madison), Horray!
I mean, im really not good at documenting my life and stuff like that, because im often too lazy to get up and write stuff.
I'll try this time though (I promise although I said it last time lol)
I tried to get pagination working, but I couldn't find where to change the background color, and im just don't know css unfortunately,
I'll try to get it running sometime!
I hope to share some coding related stuff or stuff that happened in my daily life, who knows?

To end this off, Im going to show you my favorite problem in CF when I first started: [1526C2. Potions (Hard Version)](https://codeforces.com/problemset/problem/1526/C2)
When I just started coding, I was stuck at this problem for so long.
I thought I couldn't solve it because it was 1600 (I was <1000 then),
But after hard thinking, I finally solved this problem and I was super proud of myself.
The problem has an easy and a hard version with the only difference being $n \leq 2000$ and $n \leq 200000$.
With $n \leq 200000$, its apparent that we need to develop an $O(nlogn)$ or better solution.
We will traverse from left to right and try to drink as many potions as possible while not letting our health go down to zero.
Lets first identify an easy case: when the potion is positive i.e. drinking it gives you hp.
It's obvious that we just drink it, as there are no downsides to greedily drink any positive potions.
Now the tricky part: When a potion is negative i.e. drinking it deducts hp.
An idea one may think of is to greedily drink potions whenever you have the hp, which can be proved wrong with this example:

> 6
> 4 -4 1 -3 1 -3

With pure greedy, you would drink 1, 2, 3, 5, in total 4 potions.
But you can actually drink 1, 3, 4, 5, 6, in total 5 potions.

A important idea used in this problem is also used similarly in doing LIS (Longest Increasing Subsequence) in $O(nlogn)$:
We want to try having as much hp as possible while having the maximum amount of potions drank in any timestep!
Our first priority is to drink as much as possible, but if we can't, we can maybe still find ways to make our hp higher
by "undrinking" high cost potions we drank before and substitute them with ones that cost lower!
Now we have a good algorithm to solve this problem:
We will traverse from left to right,
with each potion, if the potion is positive, we drink it and update hp and our potion count.
if the potion is negative, if we can drink it we drink it, else we find the highest cost potion we drank before and check whether
substituting it with our current one would increase our hp.
Now just one last problem to solve: How do we find the highest cost potion we drank before?
Luckly, there is a data structure called "priority queue" that can help us achieve this in $O(logn)$!
Now we successfully solved a 1600 greedy question with ease! Horray!
Code (I ommitted my templates):

```cpp
void solve() {
    int n;
    cin >> n;
    int ans = 0;
    int hp = 0;
    priority_queue<int, vector<int>, greater<int>> pq;
    for(int i = 0; i < n; i++) {
        int val;
        cin >> val;
        if(val >= 0) {
            ans += 1;
            hp += val;
        } else {
            if(hp + val >= 0) {
                ans += 1;
                hp += val;
                pq.push(val);
            } else if(pq.size() and val > pq.top()){
                hp += (val - pq.top());
                pq.pop();
                pq.push(val);
            }
        }
    }
    cout << ans << endl;
    return;
}
```

Time Complexity: $O(nlogn)$

Pretty nice question right?
