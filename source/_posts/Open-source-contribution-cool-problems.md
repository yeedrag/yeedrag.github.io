---
title: Open source contribution && cool problems
date: 2023-08-10 00:30:11
tags: ["Life", "CP", "AI"]
---
My PR was finally merged!

![merged](merge.png)

This is my first time contributing to open source, so it's really exciting for me :D
The fix was for OpenMMlab's MMsegmentation, which is a framework for AI segmentation tasks. We used it in our research im conducting now at Academia Sinica. I'll write about it some day.
Anyways, we were met with the problem of not being able to combine dice loss with other losses correctly, and after searching, alot of other people had the same problem as well!
After some discussion, one of the maintainers asked if I want to do a PR to solve this problem.
Initially, I was very hesitant, as I had no experiences with contributing to open source. But I still tried my best and started my journey of contributing open source for the first time.
I actually learned alot during this experience! I learned about linting, coding formats, unit testing, pre-commit checks and more, something you wouldn't really encounter if you only do small projects that doesn't need to be maintained. Also, I was met with quite alot of problems! Luckly, people were really helpful and kind for solving all my newbie questions.
In conclusion, open source contributing is a new experience for me, and I think i'll keep doing it in the future, as it really feels like you're actually making the world better! :D

======

I also signed up for CF round 891(Div. 3), although registered as out of competition, I still tried my best!
My performance was extremely disappointing though. I only solved A ~ E, and got a ranking around 2k...
I was very defeated by my performance, as nearly 1.5k people solved pF, and as a expert ranked I couldn't solve it.
The problems were all pretty solid and it was a decent round though, it was purely my problem.
The reason I was stuck for so long was due to me being too reluctant with my initial ideas.
The problem was for a query, find the number of pairs in the array such that $a_i + a_j  = x$,  $a_i\cdot a_j = y$, $i \neq j$
I do not understand why I didn't identify that it's Vieta's formula in an instant...
Instead, I reorganized the equations to $(a_i - a_j)^2 = x^2 - 4y$ and couldn't find how this could be done quickly for an hour.
I should've chose to drop my idea and think again after maybe like 30 minutes, but I was too stubborn.
At least I learned a valueable lesson here and I hope to not make the same mistake from now on :D

After failing to solve basic math in contest, I decided to practice some math(related) questions:

## [CF 1804C. Pull Your Luck](https://codeforces.com/contest/1804/problem/C)

I am fully ashamed how I can't solve this 1500 question...
The problem is to basically find whether a $f$ $(1 \leq f \leq p)$ exists that $\displaystyle \frac{f^2 + f}{2} = (n - x) \space \text{mod} \space n$
I tried alot of ideas like turning it into a polynomial and binary search, try to find a formula for f...
But everything didn't work. Sad and defeated, I went and checked the editorial.
It turns out the solution was really straightforward:
There is actually a bound when the remainder for $\displaystyle \frac{f^2 + f}{2} \space \text{mod} \space n$ starts looping!
The bound is actually $2n$, where I will give a proof quickly here (Alhtough should be moderately obvious):

$\displaystyle \frac{(2n+k)^2 + (2n+k)}{2} \space \text{mod} \space n = \frac{4n^2+4nk+2n+k^2+k}{2} \space \text{mod} \space n = (n^2+2nk+2n) + \frac{k^2+k}{2} \space \text{mod} \space n$
$\displaystyle = \frac{k^2+k}{2} \space \text{mod} \space n$, so $(2n+k) = k$ in this function when $\text{mod} \space n$.

So the solution is to try the first $min(2n, p)$ numbers... how disappointing :/
To be honest, I don't know how to make sure I can solve questions like this next time, maybe just practice more...
Code

```cpp
void solve() {
    int n, x, p;
    cin >> n >> x >> p;
    int want = (n - x) % n;
    for(int i = 1; i <= min(2 * n, p); i++) {
        if(((i * i + i) / 2) % n == want) {
            cout << "YES" << endl;
            return;
        }
    }
    cout << "NO" << endl;
    return;
}
```

Time Complexity: $O(n)$

## [CF 1081A. The Very Beautiful Blanket](https://codeforces.com/contest/1801/problem/A)

I already encounter this question a long ago, but this was a really telepathic constructing problem.
The solution is just to construct 2x2s by $4i$, $4i+1$, $4i+2$, $4i+3$. It's magic that is actually works in my opinion.
Not sure how would I come up with this on my own, so uh lets just check out my code lol
Code

```cpp
void solve() {
    int arr[256][256] = {0};
    int cntr = 0;
    for(int i = 0; i < 256; i += 2) {
        for(int j = 0; j < 256; j += 2) {
            arr[i][j] = cntr;
            arr[i][j + 1] = cntr + 1;
            arr[i + 1][j] = cntr + 2;
            arr[i + 1][j + 1] = cntr + 3;
            cntr += 4;
        }
    }
    int t;
    cin >> t;
    while(t--) {
        int n, m;
        cin >> n >> m;
        cout << n * m << endl;
        for(int i = 0; i < n; i++) {
            for(int j = 0; j < m; j++) {
                cout << arr[i][j] << " ";
            }
            cout << endl;
        }
    }
    return;
}
```

Time Complexity: $O(nm)$

## [CF 1731D. Valiant's New Map](https://codeforces.com/contest/1731/problem/D)

Finally a question I fully solved myself! (1700 too lol)

The question is for each test case $(1 \leq t \leq 1000)$, you want to find the maximum $l$ such that
you can find a $l \times l$ square in a $n \cdot m \space (1 \leq n, m \leq 200)$ grid where every element is greater or equal to $l$.

Well, a easy idea is to binary search $l$, enumerate through every square and do 2D range min queries!
This is just a basic binary search + 2D range min query right? 2D sparse table lets gooooo!
Funnily enough, 2D ST is actually a solution that was given in the tutorial (albeit a bit overkill),
and 2D segtree actually wouldn't pass due to $O(logn+logm)$ each query.

Lets try to solve it in an elegant manner instead of overkilling with weird data structures!
Of course when talking about 2D queries, you would recall that you could do 2D prefix arrays.
But thats for 2D range sum queries, how to we transform the question into checking range sums?
Notice that if we let $arr[i] = (arr[i] >= l)$, we would get a array with only zeros and ones,
then if we do prefix sum, a query that equals to $l \times l$ means that every element inside is greater or equal to $l$!

Code

```cpp
int n, m;
bool func(vector<vector<int>> vec, int val){
    vector<vector<int>> pre(n + 1, vector<int>(m + 1, 0));
    for(int i = 1; i <= n; i++) {
        for(int j = 1; j <= m; j++) {
            pre[i][j] = pre[i - 1][j] + pre[i][j - 1] - pre[i - 1][j - 1] + (vec[i - 1][j - 1] >= val);
        }
    }  
    for(int i = val; i <= n; i++) {
        for(int j = val; j <= m; j++) {
            int sum = pre[i][j] - pre[i][j - val] - pre[i - val][j] + pre[i - val][j - val];
            if(sum == val * val) return true;
        }
    }  
    return false;
};
void solve() {
    cin >> n >> m;
    vector<vector<int>> vec(n, vector<int>(m, 0));
    int l = 0, r = min(n, m);
    for(int i = 0; i < n; i++) {
        for(int j = 0; j < m; j++) {
            cin >> vec[i][j];
        }
    }
    while(r - l > 1) {
        int mid = (r + l) >> 1;
        if(func(vec, mid)) {
            l = mid;
        } else {
            r = mid - 1;
        }
    }
    if(func(vec, r)) {
        cout << r << endl;
    } else {
        cout << l << endl;
    }
    return;
}
```

Time Complexity: $O(nm \cdot log(\text{min}(n, m)))$

Pretty elegant solution right?

## [CF 1114C. Trailing Loves (or L'oeufs?)](https://codeforces.com/contest/1114/problem/C)

This problem is super hard for me... pure math is just death for me XD

The problem is to find the number of trailing zero digits when representing $n! \space (1 \leq n \leq 10^{18})$ in base $b \space (2 \leq b \leq 10^{12})$.
It is also equivalent to finding the max $r$ such that $n!$ is divisible by $b^r$. (Makes alot of sense if you think about it).
Well, the observations above are still pretty reasonable, but $n!$ is a super big number! how do we do this?
Apparently, there is an exact formula dealing with this problem: [Legendre's Formula](https://artofproblemsolving.com/wiki/index.php/Legendre%27s_Formula#Olympiad)
The formula states that the largest $r$ such that $n!$ is divisible by $p^n$ is $\displaystyle \sum_{i-1}^{\infty} \lfloor \frac{n}{p^i} \rfloor$.
I was confused by this formula at first, but it made sense after some thinking:
$n! = 1 \cdot 2 \cdot ... n$, how many numbers between $1$ to $n$ are divisible by $p$? $\lfloor \frac{n}{p} \rfloor$ numbers.
Now we counted the numbers divisible by $p$, but we only counted the numbers divisible by $p^2$ once when they should contribute twice. So what we do is do this for every power of $p$ and sum up the values to get what we want.
The formula requires the base $b$ to be prime though, while we have any number in $[2, 10^{12}]$.
What we can do is to prime factorize $b$ as $p_1^{x_1} \cdot p_2^{x_2} \cdot ... p_k^{x_k}$ and apply the formula with every prime factor $p_i$ to obtain $e_{p_i}(n!)$.
Finally, we can get the answer for $b$ by $\displaystyle \text{min}(\frac{y_i}{x_i})$.

Code

```cpp
void solve() {
    int n, b;
    cin >> n >> b;
    vector<int> p;
    vector<int> times;
    for(int i = 2; i * i <= b; i++) {
        // factorize b;
        if(b == 1) break;
        while(b % i == 0) {
            if(!p.size() or (p.size() and p[p.size() - 1] != i)) {
                p.pb(i);
                times.pb(0);
            }
            b /= i;
            times[times.size() - 1] += 1;
        }
    }
    if(b != 1) {
        p.pb(b);
        times.pb(1);
    }
    int ans = 5000000000000000000ll;
    for(int i = 0; i < p.size(); i++) {
        int cnt = 0;
        int p_i = 1;
        for(int j = 1; p_i <= n / p[i]; j++) {
            p_i *= p[i];
            cnt += (n / p_i);
        }
        ans = min(ans, (cnt / times[i]));
    }
    cout << ans << endl;
    return;
}
```

The code also had alot of specific parts that needed some attention when writing, I realized that 0x3f3f3f3f only equals to around $2 \cdot 10^9$, which is not enough for this question.
Another thing was deciding the bound for $\displaystyle \sum_{i-1}^{\infty} \lfloor \frac{n}{p^i} \rfloor$. I wrote $p_i \leq n$, but this actually causes overflow, you need to change to $\displaystyle p_i \leq \frac{n}{p[i]}$ to prevent overflow from happening.

This was a really interesting question that troubled me alot, really shows that I need to up my math game.
