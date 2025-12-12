---
title: Learning Dynamic Programming...From Staircases?
date: 2025-07-19 00:15:44
tags: ["Programming", "CP"]
---

Prerequisites: Time complexity, basic coding knowledge

Dynamic Programming is considered one of the more challenging topics in competitive programming and coding interviews. Unlike other topics, dynamic programming can appear anywhere and is often paired with other algorithms. I get more questions about DP than any other topic, so I decided to write a blog teaching DP from scratch.

This blog is for readers who aren’t comfortable with DP and those preparing for coding interviews, so it won’t include any advanced techniques.

(Note: I’ll use C++ examples but avoid C++‑specific syntax so this tutorial stays clear for readers using other languages.)

## What is Dynamic Programming?

The word "Dynamic Programming" might sound fancy, but it actually just boils down to 2 simple ideas:

1. We can usually *build* the answer of a problem from subproblems. This is usually called the [optimal substructure](https://en.wikipedia.org/wiki/Optimal_substructure) of a problem. Consider the example of calculating fibbonachi:
    $$
    F_n =
    \begin{cases}
    0, & n = 0, \\[6pt]
    1, & n = 1, \\[6pt]
    F_{n-1} + F_{n-2}, & n \ge 2.
    \end{cases}
    $$
    Notice that from this definition, we can compute $F_n$ using the subproblems $F_{n-1}$ and $F_{n-2}$. This idea becomes clearer when we start solving questions.
2. An algorithm often has *overlapping* subproblems, and we don’t want to recalculate everytime:
    Let’s again use the example of fibbonachi. We could easily turn the recursion into code:  

    ```cpp
        int fib(int n) {
            if (n == 0) return 0;
            if (n == 1) return 1;
            return fib(n - 1) + fib(n - 2);
        }
    ```

    However, this code is terribly inefficient. Notice that fib($n - 1$) calls fib($n - 2$), and both also calls fib($n - 3$). The current implementation always recalculates a value, even though we have calculated it before.
    This is the case of having an overlapping subproblem, and we could optimize this code by storing results from subproblems:

    ```cpp
        int dp[N]; // dp[i] stores the result of fib(i), initialized to 0
        int fib(int n) {
            if (n == 0) return 0;
            if (n == 1) return 1;
            // If we haven’t computed fib(n) before, compute it now
            if (dp[n] == 0) dp[n] = fib(n - 1) + fib(n - 2);
            return dp[n];
        }
    ```

    In summary, DP breaks a problem into overlapping subproblems, solves each exactly once, and combines those solutions to build the final answer.

## State, base cases, Bellman (DP) equation

Alright, time for some jargon!

There are three important aspects of a DP algorithm: the **state**, the **initial state**, and the **DP equation**.

1. The state is the information that you want to store for each subproblem. Before you write any code, ask yourself “what does each dp[...] actually represent?” This is the first thing you should think about when designing a DP algorithm. In almost every DP problem, the **state is exactly the answer you want for a smaller input**. In other words, $dp[i]$ (or $dp[i][j]$, etc.) should capture the answer of the original problem restricted to that sub-input.

    There will be cases where the answer might be the min/max of all of them or the sum of them, but trying out using the answer as the state is always a decent start.

    For Fibonacci, $dp[i]$ denotes the value of fib($i$). The solution is $dp[n]$.

    Note: The DP state size doesn’t have to be the same as the question itself! A 1D problem might use a 2D state, or vice versa. It depends on the time constraint of the problem, and what information do you need for the question.

2. The base cases are the subproblems you know outright, which are also the initial building blocks we have to start off our dp process.

    For Fibbonachi, we have $dp[0] = 0$ and $dp[1] = 1$ according to the definition.

    If you can’t find an easily computable base case, you might need to revise your state.

3. Finally, the DP equation (or Bellman equation) shows how we transition from one state to the next. In other words, "given the subproblems I’ve defined, how do I combine their answers to get the answer for this one?"

    It’s not easy to come up with the DP equation, and it takes a lot of practice!

    For Fibbonachi, we have $dp[i] = dp[i - 1] + dp[i - 2]$.

    Remember to check whether your equation works with the base cases! If not, you may need different base cases or a revised state.

It’s fine if you don’t understand fully on how to come up with these. There will be many examples later that aim to teach you how to think this through systematically :D

## Top-down (memoized recursion) vs Bottom-up (tabular)

DP can be implemented in two ways: top-down and bottom-up.

Top-down defines a recursive function from the DP equation, expressing the solution in terms of smaller subproblems. Before each call, we check if we’ve already solved that subproblem to avoid repeating work and store the result. Our Fibonacci example above uses the top-down approach.

However, most competitive programmers (including me) use bottom-up, where instead of recursing from the top, we build states from the bottom up in order, ensuring that when we compute $dp[i]$, all previous values are already available.

```cpp
    int fib(int n) {
        int dp[n + 1];
        dp[0] = 0;
        dp[1] = 1;
        for (int i = 2; i <= n; i++) {
            dp[i] = dp[i - 1] + dp[i - 2];
        }
        return dp[n];
    }
```

Apart from rare cases like graph DP, most prefer bottom-up since it has less stack overhead. That said, it largely comes down to personal preference and doesn’t usually affect performance significantly. I will demonstrate bottom-up DP, but you should be able to translate it to a top-down approach!

{% collapsecard "Additional Content: Push vs Pull DP" "Additional content: Push vs Pull DP"%}
There are two ways to transition between states: push DP or pull DP.

Push DP updates future states based on the current state, while pull DP updates the current state based on previous states.

Pull DP is often more intuitive and is what we’ll use in this tutorial. However, there are situations where you might prefer using push DP.
{% endcollapsecard %}

## Building Intuition Via Staircases

Alright, now let’s start working with problems! I have created several variations of the [Climbing Stairs](https://leetcode.com/problems/climbing-stairs/description/) problem, and we’ll solve all of them to get a feel for DP!

### [Climbing Stairs 1](https://leetcode.com/problems/climbing-stairs/)

This question is the same as the leetcode version.

{% collapsecard "Problem Statement" "Problem Statement"%}
You are climbing a staircase. It takes $n$ steps to reach the top.
Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?
Constraints:
$1 \leq n \leq 45$
{% endcollapsecard %}

To approach this problem, think of the three DP aspects we discussed earlier.

{% collapsecard "What Is The State?" "What Is The State?"%}
Here, we could let the state be the answer itself:
$$ dp[i] = \#\text{Number of ways to reach the $i$-th stair} $$
and the answer would be $dp[n]$.
{% endcollapsecard %}

Now that we have the state, what are the base cases? What can we know directly?

{% collapsecard "What Are The Base Cases?" "What Are The Base Cases?"%}
We can hand calculate some simple base values: $dp[0] = 1$, $dp[1] = 1$, $dp[2] = 2$.

Note: You could also set $dp[3]$ or even $dp[4]$ as the base case if you want—it just ensures the DP equation has the right building blocks. Sometimes it helps to write the DP equation first and then pick the base cases you need.
{% endcollapsecard %}

Great! Finally, what do we need to calculate $dp[i]$?

{% collapsecard "What Is The DP Equation?" "What Is The DP Equation?"%}
Since we can climb either 1 or 2 steps, we can reach step $i$ from either step $i-1$ or step $i-2$. We can just sum up the ways to get to either steps.

We can write it into an equation as

$$dp[i] = dp[i - 1] + dp[i - 2]$$

For all $i \ge 3$.
{% endcollapsecard %}

Now we have everything we need to write our code! Can you implement it?

{% collapsecard "Solution" "Solution"%}

```cpp
    int dp[1001];
    int climbStairs(int n) {
        dp[0] = 1; // Isn’t really used
        dp[1] = 1;
        dp[2] = 2;
        for (int i = 3; i <= n; i++) {
            dp[i] = dp[i - 1] + dp[i - 2];
        }
        return dp[n];
    }
```

Complexity: $O(N)$
{% endcollapsecard %}

Great! We’ve solved our first DP problem. From now on, I won’t explicitly prompt each step unless a problem is tricky, but always keep the state, base cases, and DP equation in mind!

### Climbing Stairs, but k-steps?

{% collapsecard "Problem Statement" "Problem Statement"%}
You are climbing a staircase. It takes $n$ steps to reach the top.
Each time you can take from 1 to $k$ steps. In how many distinct ways can you climb to the top?
Constraints:
$1 \leq n \leq 5e4,\space 1 \leq k \leq n$
{% endcollapsecard %}
{% collapsecard "What Is The State?" "What Is The State?"%}
The state should be the same as before:
$$ dp[i] = \#\text{Number of ways to reach the $i$-th stair}, $$
and the answer we want would be $dp[n]$.
{% endcollapsecard %}
{% collapsecard "What Are The Base Cases?" "What Are The Base Cases?"%}
Hmm okay, It’s not obvious which base cases we need. Do we have to set the first k values? That would be expensive!

How about let’s just keep it simple, and have $dp[0] = 1$?
{% endcollapsecard %}
{% collapsecard "What Is The DP Equation?" "What Is The DP Equation?"%}
For $i \ge k$, the equation is

$$dp[i] = \sum_{j = i - k}^{i - 1} dp[j].$$

However, how do we deal with the cases when $i < k$?

Let’s use the example when $k = 4$:

```cpp
dp[1] = dp[0] // Can jump from 0

dp[2] = dp[1] + dp[0] // Can jump from 0 or 1

dp[3] = dp[2] + dp[1] + dp[0] // Can jump from 0,1,2

dp[4] = dp[3] + dp[2] + dp[1] + dp[0] // Can jump from 0,1,2,3

dp[5] = dp[4] + dp[3] + dp[2] + dp[1] // Can jump from 1,2,3,4
```

It seems that for the first $k$ values we just need to make sure that we stop at $dp[0]$, so we have the unified formula
$$dp[i] = \sum_{j = \max(0, i - k)}^{i - 1} dp[j].$$
{% endcollapsecard %}

{% collapsecard "Solution" "Solution"%}

```cpp
    int dp[1001];
    int climbStairsKsteps(int n, int k) {
        dp[0] = 1;
        for (int i = 1; i <= n; i++) {
            for (int j = max(0, i - k); j <= i - 1; j++) {
                dp[i] += dp[j];
            }
        }
        return dp[n];
    }
```

Complexity: $O(NK)$
{% endcollapsecard %}

{% collapsecard "Bonus: Can You Solve This In O(N)?" "Bonus: Can You Solve This In O(N)?"%}
It is possible to solve this question in $O(N)$ time. Can you figure it out?
{% collapsecard "Hint 1" "Hint 1"%}
Assuming $i \ge k$,
$$dp[i - 1] = \sum_{j = i - k - 1}^{i - 2} dp[j] = dp[i - k - 1] + \sum_{j = i - k}^{i - 2} dp[j]$$
$$dp[i] = \sum_{j = i - k}^{i - 1} dp[j] = dp[i - 1] + \sum_{j = i - k}^{i - 2} dp[j]$$

Notice most terms overlap between the transitions for $dp[i - 1]$ and $dp[i]$. Can we avoid recomputing them each time? What happens when $i < k$? How about $i = 1$?
{% endcollapsecard %}
{% collapsecard "Solution" "Solution"%}
With our observation, we get

$$dp[i] = dp[i - 1] + (dp[i - 1] - dp[i - k - 1]) = 2dp[i - 1] - dp[i - k - 1].$$

And when $i < k, i \neq 1$ (why does $dp[1]$ not work with the formula?), the formula simplifies to

$$dp[i] = dp[i - 1] + (dp[i - 1]) = 2dp[i - 1].$$

Also, $dp[0] = dp[1] = 1$.

Writing it as code, we have

```cpp
int dp[1001];
int climbStairsKsteps(int n, int k) {
    dp[0] = 1;
    dp[1] = 1;
    for (int i = 2; i <= n; i++) {
        if (i <= k) {
            dp[i] = 2 * dp[i - 1];
        } else {
            dp[i] = 2 * dp[i - 1] - dp[i - k - 1];
        }
    }
    return dp[n];
}
```

Complexity: $O(N)$

You can also use a prefix sum or sliding window to track the running sum.
{% endcollapsecard %}
{% endcollapsecard %}

### Climbing Stairs, but only odd steps?

The solution should be relatively similar to the previous question.
{% collapsecard "Problem Statement" "Problem Statement"%}
You are climbing a staircase. It takes $n$ steps to reach the top.
Each time you can only take odd steps. In how many distinct ways can you climb to the top?
Constraints:
$1 \leq n \leq 5e4$
{% endcollapsecard %}
{% collapsecard "Solution" "Solution"%}
Let $dp[i]$ be the number of ways we can reach the $i$-th step, with base cases $dp[0] = 1$, $dp[1] = 1$.

Now let's think of how we can get to the $i$-th step: Since we can only climb an odd number of steps, we could either climb 1 step (come from $i - 1$), 3 step (from $i - 3$), 5 step (from $i - 5$) ..... etc. Hence, $dp[i]$ is just the sum of all previous dp states that we could've jumped from.

Our DP equation would be
$$ dp[i] = \sum_{1 \leq j < i, j \text{ is odd}} dp[i - j] $$

The code would be

```cpp
int dp[1001];
int climbStairsOdd(int n) {
    dp[0] = 1;
    dp[1] = 1;
    for (int i = 2; i <= n; i++) {
        for (int j = 1; i - j >= 0; j += 2) {
            dp[i] += dp[i - j];
        }
    }
    return dp[n];
}
```

Time Complexity: $O(N^2)$

{% endcollapsecard %}

{% collapsecard "Bonus: Can You Solve This In O(N)?" "Bonus: Can You Solve This In O(N)?"%}
Like the previous question, this is also solvable with O(N). Try applying the same trick to find the simpler recurrence!

{% collapsecard "Solution" "Solution"%}
Observe that

```cpp
dp[i] = dp[i - 1] + dp[i - 3] + dp[i - 5] + ...
      = dp[i - 1] + (dp[i - 3] + dp[i - 5] + ...)
      = dp[i - 1] + dp[i - 2]
```

So it reduces to the classic Fibonacci sequence, solvable in $O(N)$! *(With matrix exponentiation you can get $O(logn)$, but is out of our scope today.)*
{% endcollapsecard %}
{% endcollapsecard %}

### Climbing Stairs, but can I reach it?

This question asks something different. What state would you use?

{% collapsecard "Problem Statement" "Problem Statement"%}
You are climbing a staircase. It takes $n$ steps to reach the top.
However, you can only move $a$ or $b$ steps each time. Can you reach the top?
Return "YES" if you can reach the top, or "NO" otherwise.
Constraints:
$1 \leq a, b, n \leq 5e4$
{% endcollapsecard %}

{% collapsecard "Solution" "Solution"%}
Since the question is now a true/false question, let $dp[i]$ be true if we can reach step $i$, false otherwise. The answer would be true if $dp[n]$ is true.

Our base case can be $dp[0] = true$.
*Setting $dp[a] = true$ or $dp[b] = true$ could be dangerous if the dp array has length $n$ since it might be smaller than $a, b$!*

Then, our DP equation would be

$$ dp[i] = (dp[i - a] \space || \space dp[i - b])$$

(Be careful when $a > i$ or $b > i$!)

The final code would be

```cpp
bool dp[1005];
string climbStairsReach(int n, int a, int b) {
    init(dp, false);
    dp[0] = true;
    // In fact, these two will get populated natrually
    dp[a] = true;
    dp[b] = true; 
    for (int i = 1; i <= n; i++) {
        bool ok = false;
        if (i >= a && dp[i - a]) ok = true;
        if (i >= b && dp[i - b]) ok = true;
        dp[i] = ok;
    }
    return dp[n] ? "YES" : "NO";
}
```

Time Complexity: $O(N)$

{% endcollapsecard %}

{% collapsecard "Bonus: Solving With Number Theory" "Bonus: Solving With Number Theory"%}
The question equal tofinding if there exists integers $x$ and $y$ such that

$$ ax + by = n $$

Which according to [Bézout’s lemma](https://en.wikipedia.org/wiki/Bézout%27s_identity) has a solution if and only if $\text{gcd}(a, b)$ divides $n$.

However, we would need to use the extended euclidean algorithm to check if there are actually positive solutions, since Bezout doesn’t guarantee the existance of positive solutions.

```cpp
tuple<int,int,int> extgcd(int a, int b) {
  if (b==0) return {a,1,0};
  auto [g,x1,y1] = extgcd(b, a%b);
  return {g, y1, x1 - (a/b)*y1};
}
string climbStairsReach(int n, int a, int b) {
    auto [d, x0, y0] = extgcd(a,b);
    if (n % d) return "NO";
    long long mul = n/d;
    long long x = x0 * mul,  y = y0 * mul;
    long long bd = b/d,  ad = a/d;
    // t must satisfy:
    //   x + bd*t >= 0   →  t >= ceil( -x/bd )
    //   y - ad*t >= 0   →  t <= floor( y/ad )
    long long tmin = (long long)ceil(-double(x)/bd);
    long long tmax = (long long)floor(double(y)/ad);
    return (tmin <= tmax) ? "YES" : "NO";
}
```

*(Note: Special care needs to be made for division for large $n$ due to floating point precision.)*

Time Complexity: $O(\log \min(a, b))$
{% endcollapsecard %}

{% collapsecard "Bonus: CF 1526B. I Hate 1111" "Bonus: CF 1526B. I Hate 1111"%}
[Original Problem Link](https://codeforces.com/problemset/problem/1526/B)
You are given an integer x. Can you make x by summing up some number of 11,111,1111,11111,...? (You can use any number among them any number of times).
(You will be given $t$ numbers in total, and you have to answer all in the time limit.)
Constraints: $1 \leq t \leq 1e5$, $1 \leq x \leq 1e9$.

{% collapsecard "Hint 1" "Hint 1"%}
Any form of the numbers can we written as a combination of $111$ and $11$.
{% endcollapsecard %}
{% collapsecard "Hint 2" "Hint 2"%}
[Chicken McNugget Theorem](https://artofproblemsolving.com/wiki/index.php/Chicken_McNugget_Theorem?srsltid=AfmBOor66r9rLbK4hUVmOKFKtgT-B-5VR42M7ucusf1AhmrAx2pqOFOS) or let $11a + 111b$ and enumerate through possible b’s.

{% endcollapsecard %}
{% collapsecard "Solution" "Solution"%}
[Editorial of the round](https://codeforces.com/blog/entry/91195)
{% endcollapsecard %}
{% endcollapsecard %}

### [Min Cost Climbing Stairs](https://leetcode.com/problems/min-cost-climbing-stairs/description/)

{% collapsecard "Problem Statement" "Problem Statement"%}
You are given an integer array cost where $cost[i]$ is the cost of $i$-th step on a staircase. Once you pay the cost, you can either climb one or two steps.

You can either start from the step with index 0, or the step with index 1.

Return the minimum cost to reach the top of the floor.

Constraints: $2 \leq len(cost) \leq 1000$, $0 \leq cost[i] \leq 999$
{% endcollapsecard %}

{% collapsecard "What Is The State?" "What Is The State?"%}
Since we need the minimum cost this time, how about we let $dp[i]$ be the minimum cost to reach the $i$-th floor? Our final answer will be $dp[n]$, where $n$ is the length of cost.
{% endcollapsecard %}
{% collapsecard "What Are The Base Cases?" "What Are The Base Cases?"%}
Because we can start at step 0 or step 1 without paying anything first, we set $$dp[0] = dp[1] = 1.$$
{% endcollapsecard %}
{% collapsecard "What Is The DP Equation?" "What Is The DP Equation?"%}
To reach step $i$, we could come from $i - 1$ with cost $dp[i - 1] + cost[i - 1]$, or $i - 2$ with cost $dp[i - 2] + cost[i - 2]$. Since we want the minimum cost, we will choose the minimum between the two values.

$$dp[i] = min(dp[i - 1] + cost[i - 1], dp[i - 2] + cost[i - 2])$$
{% endcollapsecard %}
{% collapsecard "Solution" "Solution"%}

```cpp
int dp[1005];
int minCostClimbingStairs(vector<int>& cost) {
    int n = size(cost);
    init(dp, 1e9);
    dp[0] = 0;
    dp[1] = 0;
    for (int i = 2; i <= n; i++) {
        dp[i] = min(dp[i - 1] + cost[i - 1], dp[i - 2] + cost[i - 2]);
    }
    return dp[n];
}
```

Time Complexity: $O(N)$

{% endcollapsecard %}

### Climbing Stairs, but step consistency?

{% collapsecard "Problem Statement" "Problem Statement"%}
You are given an integer array score where $score[i]$ is the points you get when stepping on the $i$-th step of a staircase (0-based), and a penalty $k$.

You start just before step 0, and want to reach step $len(score) - 1$. On each move you can climb 1 or 2 steps, and you earn the score on the step you land on.

However, If this move’s length (1 or 2) is different from your previous move’s length, you incur a penalty of `k` points. The very first step you take has no penalty since the “previous” move length doesn't exist.

Return the maximum total score you can get when you reach the top.

Constraints: $1 \leq n = len(score) \leq 2e4$, $-1e4 \leq k, score[i] \leq 1e4$

```cpp
Example 1:
k = 3, score[5] = {1, -2, -3, 4}
Answer: 2
Explaination: 
1) two 2-steps: -2 + 4 = 2
2) all 1-steps: 1 + (-2) + (-3) + 4 = 0
3) 1 - 1 - 2: 1 + (-2) + 4 - 3(penalty) = 0
4) 2 - 1 - 1: (-2) + (-3) - 3(penalty) + 4 = -1 
5) 1 - 2 - 1: 1 + (-3) - 3(penalty) + 4 - 3(penalty) = -4

Example 2:
k = -2, score[5] = {0, -2, 1, -3, 4}
Answer: 7
Explaination: 
“Penalty” = -2 means you gain 2 when you switch parity.
Best: 1-step -> 2-step -> 2-step:
1 -> 2: 0 + 1 + 2 = 3   (odd -> even gives +2)
2 -> 4: 3 + 4     = 7   (even -> even no bonus)
-> 7

Example 3:
k = 1000, score[5] = {1, -99, 1, -99, 1}
Answer: -195
```

{% endcollapsecard %}

Hmm, the difficulty seems to have ramped up a bit, so let’s walk through how to break it down. This also shows the back-and-forth of developing a DP solution (you rarely nail state and the equation recurrence on the first try).

{% collapsecard "My thought process" "My thought process"%}
Alright, so the first question we should ask is "What Is The State?" According to previous experiences, a natural start would be
$$ dp[i] = \#\text{Max score when reaching $i$-th step} $$
with the answer being $dp[n - 1]$.

We could also define base cases with $dp[0] = score[0]$ and $dp[1] = max(score[1], score[0] + score[1])$. So far so good, right?

However, there will be anissue when we try to design the DP equation. A critical information in this problem is that *the size of your previous step will impact the value you obtain this step*. With our current design of $dp[i]$, we have no way in knowing whether this state comes from an even step or an odd step!

Hence, we need to revise our state to encorporate the knowledge of step parity. We could do this by adding an additional dimension recording whether the step taken was even or odd. That is,

$$ dp[i][0] = \#\text{Max score when reaching $i$-th step, where the step taken is even} $$

$$ dp[i][1] = \#\text{Max score when reaching $i$-th step, where the step taken is odd} $$

With this new state design, the final answer would be $max(dp[n - 1][0], dp[n - 1][1])$, and we have base case

```cpp
dp[0][1] = score[0];
dp[1][0] = score[1];
dp[1][1] = score[0] + score[1];
```

(Make sure to know why!)

Finally, we can write out a new DP equation.

Let’s think of how we can get $dp[i][1]$. Since we know the step taken to get here was odd, it must come from the $i - 1$ step. There are now 2 cases: either we came from a 1-step $dp[i - 1][1]$ and not take any penalty, or pfrom a 2-step $dp[i - 1][0]$ and take the penalty. 

The case for $dp[i][0]$ is similar, so we can get the following equation:

```cpp
dp[i][1] = max(dp[i - 1][1], dp[i - 1][0] - k) + score[i];
dp[i][0] = max(dp[i - 2][1] - k, dp[i - 2][0]) + score[i];
```

{% endcollapsecard %}

{% collapsecard "Solution" "Solution"%}

```cpp
int dp[50001][2];
int climbStairsStepConsistency(const vector<int>& score, int k) {
    int n = score.size();
    if (n == 1) return score[0];
    init(dp, -1e9);
    dp[0][1] = score[0];
    dp[1][0] = score[1];
    dp[1][1] = score[0] + score[1];
    for (int i = 2; i < n; i++) {
        dp[i][1] = max(dp[i - 1][1], dp[i - 1][0] - k) + score[i];
        dp[i][0] = max(dp[i - 2][1] - k, dp[i - 2][0]) + score[i];
    }
    return max(dp[n - 1][1], dp[n - 1][0]);
}
```

Complexity: $O(N)$

{% endcollapsecard %}

### Climbing Stairs, but only to larger values?

{% collapsecard "Problem Statement" "Problem Statement"%}
You are given an integer array nums where $nums[i]$ is the value of the $i$-th step of a staircase (0-based).

You start just before step 0, and you want to try climbing the stairs. However, you can only climb to a step if it’s value is strictly larger than the one you are standing on (The first climb is always valid). What is the maximum amount of steps you can take? (You are not required to climb to the top of the stairs.)

Constraints: $1 \leq len(nums) \leq 2500$, $-1e4 \leq nums[i] \leq 1e4$

```cpp
Example 1:
nums = [10,9,2,5,3,7,101,18]
Ans: 4
Explanation: The most optimal route would be 2 -> 3 -> 7 -> 18.
Example 2:
nums = [0,1,0,3,2,3]
Ans: 4
Example 3:
nums = [7,7,7,7,7,7,7]
Ans: 1
```

{% endcollapsecard %}

{% collapsecard "State?" "State?"%}
A natural way to track progress is:

$$ dp[i] = \#\text{Max number of steps taken to land on the $i$-th step}$$

Then, the answer would be the maximum of all states.

(Check the solution of the next question to see more discussion on states.)
{% endcollapsecard %}

{% collapsecard "Base case?" "Base case?"%}
There are two ways we can set the base case. The first one is to set $dp[0] = 1$, and the second one would be to set every state to 1. The only difference is if you need to set $dp[i]$ to 1 if there are no previous smaller steps.
{% endcollapsecard %}

{% collapsecard "DP equation?" "DP equation?"%}
We can only jump from steps before us with a strictly smaller value, so

$$ dp[i] = 1 + \max_{\forall j < i \text{ s.t } nums[j] < nums[i]}dp[j] $$

and $dp[i] = 1$ if there are no previous smaller steps.
{% endcollapsecard %}

{% collapsecard "Solution" "Solution"%}
In fact, this question is equivalent to a very classic problem called Longest Increasing Subsequence, and we just solved it!

[Leetcode link](https://leetcode.com/problems/longest-increasing-subsequence/)

```cpp
    int dp[20005];
    int lengthOfLIS(vector<int>& nums) {
        int n = nums.size();
        init(dp, 1);
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < i; j++) {
                if (nums[j] < nums[i])
                    dp[i] = max(dp[i], dp[j] + 1);
            }
        }
        int mx = 1;
        for (int i = 0; i < n; i++) mx = max(mx, dp[i]);
        return mx;
    }
```

Complexity: $O(N^2)$

{% endcollapsecard %}

{% collapsecard "Bonus: O(nlogn) Solution" "Bonus: O(nlogn) Solution"%}
LIS can actually be solved in $O(nlogn)$ using greedy!

The idea is that we want to have the subsequence as long as possible. But if we cannot make the subsequence longer, we last value of the subsuequence (the tail) as small as possible, so there are more chances to append values in the future!

```cpp
    int lengthOfLIS(vector<int>& nums) {
        vector<int> end;
        for (int x : nums) {
            // find the first end >= x
            auto it = lower_bound(tails.begin(), tails.end(), x);
            if (it == tails.end()) {
                // x extends the largest subsequence
                tails.push_back(x);
            } else {
                // x becomes a better end for this length
                *it = x;
            }
        }
        return (int)tails.size();
    }
```

Time complexity: $O(NlogN)$
{% endcollapsecard %}

### Climbing Stairs, but you get tired?

{% collapsecard "Problem Statement" "Problem Statement"%}
You are in front of a staircase with $n$ steps (indexed from $0$ to $n - 1$). Two arrays of length $n$ are given:

$value[i]$: points that you collect when you land on step $i$.

$energy[i]$: the energy cost you expend when landing on step $i$ (The cost depends only on the landing step since this is a magic staircase.)

You start just before step 0 with a energy budget $C$, and your task is to return the maximum possible points obtained during this trip without using up all your energy.

Constraints: $1 \leq n \leq 100, 1 \leq energy[i] \leq C \leq 1e5, 1 \leq value[i] \leq 1e5$
{% endcollapsecard %}

{% collapsecard "Hint: State" "Hint: State"%}
What extra information do you need so you know if you can afford to land on a step? Since each step can be taken or skipped, how would that choice appear in your DP definition?
{% endcollapsecard %}

{% collapsecard "Solution" "Solution"%}
This problem is the classic "0/1 Knapsack Problem", with the energy in the problem statement usually being the capacity of the knapsack we have, and each step corresponding to an item with some weight and value.

Our problem asks for the maximum value, but we also need to encode how much energy has been used so far. A reasonable state design would be

$$ dp[i][e] = \#\text{Maximum value obtained from only the first $i$ steps, using exactly $e$ energy} $$

The answer would then be $\displaystyle\max_{0 \le e \le C} dp[n-1][e]$.

*(Note that $dp[i][e]$ doesn’t require us to actually step on the $i$-th step.)*

Our initial values can be $dp[0][0] = 0$ and $dp[0][energy[0]] = value[0]$.

For the DP equation, we can enumerate through the energy used, and choose to take the step or not.

```cpp
dp[i][e] = max(
    dp[i - 1][e], // We choose to not take this step
    dp[i - 1][e - energy[i]] + value[i]; // we take this step
)
```

{% collapsecard "Code" "Code"%}

```cpp
int dp[101][20001];
int knapSack(int n, int C, int value[], int energy[]) {
    init(dp, -1e9);
    dp[0][energy[0]] = value[0];
    dp[0][0] = 0;
    for (int i = 1; i < n; i++) {
        for (int e = 0; e <= C; e++) {
            if (e >= energy[i]) {
                dp[i][e] = max(dp[i - 1][e], dp[i - 1][e - energy[i]] + value[i]);
            } else {
                dp[i][e] = dp[i - 1][e];
            }
        }
    }
    int ret = -1;
    for (int e = 0; e <= C; e++) {
        ret = max(ret, dp[n - 1][e]);
    }
    return ret;
}
```

Time Complexity: $O(NC)$

{% endcollapsecard %}

{% collapsecard "This is not reasonable at all!" "This is not reasonable at all!"%}
I hope you feel weird about the state design.

You might wonder why we defined

$$ dp[i][e] = \#\text{Maximum value obtained from only the first $i$ steps, using exactly $e$ energy} $$

Instead of something like

$$ dp[i][e] = \#\text{Maximum value obtained landing on the $i$-th step, using exactly $e$ energy}?$$

Our design was closer to the latter during LIS!

To answer this, Let's look at the LIS quesiton first. Assume that for that question, we set our state as

$$ dp[i] = \#\text{Max number of steps from only the first $i$ steps} $$

Then the answer would be simply $dp[n - 1]$ (0-base).

However, writing the DP equation will be difficult, since LIS requires us to have the information of "What was the last value?" which the current design does not properly encode.

We could encode the information in the state:

$$ dp[i][j] = \#\text{Max number of steps from the first $i$ steps, with $nums[j]$ being the last value}$$

Which is fine, but suffers from worse space complexity.

Now let’s look at this problem. If we make the state as

$$ dp[i][e] = \#\text{Maximum value obtained when stepping on the $i$-th step, using exactly $e$ energy} $$

The DP equation isn’t very difficult to come up with. However, the original state design creates a convenient *monotonicity* of the states (i.e $dp[i - 1][e] \leq dp[i][e]$ for all $i$).
With this monotonicity, we can obtain the answer by $\displaystyle\max_{0 \le e \le C} dp[n-1][e]$.

On the other hand, our new design makes our state no longer monotonically increasing with respect to $i$, which then require us to enumerate through both dimensions to obtain the answer. Even though the complexity is the same, one comes with additional complexity and inconvenience.

To summarize, the reason why we chose let

$$ dp[i] = \#\text{Max number of steps taken to land on the $i$-th step}$$

is that we require the information of the $i$-th step itself during our DP recurrence.

On the other hand, knapsack does not need any information on the values itself and instead only requires the current accumulated energy. This is why we have our original design, whose monotonicity makes finding the final answer simple.

{% endcollapsecard %}

{% endcollapsecard %}

{% collapsecard "Bonus 1: O(N) Space Complexity" "Bonus 1: O(N) Space Complexity"%}

Notice in our DP equation:

```cpp
dp[i][e] = max(
    dp[i - 1][e], // We choose to not take this step
    dp[i - 1][e - energy[i]] + value[i]; // we take this step
)
```

For each i, only the array $dp[i][...]$ and $dp[i - 1][...]$ matters, which means that we can actually just use 2 1D arrays to simulate the process! (This technique is called "Rolling DP".)

```cpp
dp_cur[i][e] = max(
    dp_prev[e], // We choose to not take this step
    dp_prev[e - energy[i]] + value[i]; // we take this step
)

// make dp_cur into dp_prev next iteration
```

In fact, we could optimize this further by only using one 1D array!

```cpp
dp[e] = max(
    dp[e],
    dp[e - energy[i]],
)
```

**However**, with this design we need to be careful, and enumerate through $e$ from *largest to smallest*. (Try to understand why this is the case!)

{% collapsecard "Why do we need to enumerate from largest to smallest?" "Why do we need to enumerate from largest to smallest?"%}

Consider the case where there is only 1 step with weight 3 and value 1. If we enumerate through $e$ like usual:

```cpp
init(dp, -1e9);
dp[0] = 0;
for(int i = 0; i < 1; i++) {
    for(int e = 0; e <= C, e++) {
        if(e >= energy) {
            dp[e] = max(
                dp[e],
                dp[e - energy[i]],
            )
        } 
    }
    // e = 3: dp[3] = max(dp[3], dp[0] + 1) -> dp[3] = 1;
    // e = 6: dp[6] = max(dp[6], dp[3] + 1) -> dp[6] = dp[3] + 1 = 2;
    // e = 9: dp[6] = max(dp[9], dp[6] + 1) -> dp[9] = dp[6] + 1 = 2;
    // ....
}
```

You can notice that we have now repeatedly used the $i$-th step! In the first 2 state designs, there was a clear before/after relationship so each step will only get taken once. However, the current state design does not have such relationship, so we would double count if not careful enough.
{% endcollapsecard %}

{% endcollapsecard %}

{% collapsecard "Bonus 2: High Energy, Small Values" "Bonus 2: High Energy, Small Values"%}
The previous constraints was $1 \leq n \leq 100, 1 \leq energy[i] \leq C \leq 1e5, 1 \leq value[i] \leq 1e5$.

How would you solve the problem if $1 \leq n \leq 100, 1 \leq energy[i] \leq C \leq 1e9, 1 \leq value[i] \leq 1e3$?

[Link to the problem](https://atcoder.jp/contests/dp/tasks/dp_e)
{% endcollapsecard %}

Phew! You just solved 8 DP questions, good job! I hope after these questions, you have a better understanding of DP, how to construct states, base cases and DP equations. Do note that even though in our example of climbing stairs we always work the states upwards, there might be some DP questions that require you to reverse, or even work from the middle!

A good thing with coming up problems about staircases is that you can generate a lot of variations easily. Knapsack stair climbing + LIS? Penalize by the difference of step length? Multiple staircases? The possibilities are infinite!

The point of the staircase is just a simple template, and to tell you that we can create solve so many different DP problems just from understanding the basics.

## Further Practice

This section will no longer be about staircases (Since I'm not that interested in making up stories about magical staircases), and instead be real DP problems from various sources that I think are worth doing.

### [Atcoder Educational DP Contest](https://atcoder.jp/contests/dp/tasks)

I highly recommend doing problems A ~ H. A, B, D, E should look relatively familiar if you did the previous staircase problems.

The other problems are not that easy. L and M should require the knowledge of prefix sums, so try it out if you know it!

### [CF 1526C1. Potions](https://codeforces.com/problemset/problem/1526/C1)

This is one of the first 1500 problems I've solved when I started competitive programming in high school. It's a great question, with an intuitive $O(n^2)$ DP solution and an elegant $O(nlogn)$ greedy solution. It's always my goto problem for anyone interested in competitive programming!

## Appendix

### Guessing Complexity from contraints

Let n be the main variable in the problem.

If n ≤ 12, the time complexity can be $O(n!)$.
If n ≤ 25, the time complexity can be $O(2^n)$.
If n ≤ 100, the time complexity can be $O(n^4)$.
If n ≤ 500, the time complexity can be $O(n^3)$.
If n ≤ 10^4, the time complexity can be $O(n^2)$.
If n ≤ 10^6, the time complexity can be $O(n log n)$.
If n ≤ 10^8, the time complexity can be $O(n)$.
If n > 10^8, the time complexity can be $O(log n)$ or $O(1)$.
**Examples of each common time complexity**:
$O(n!)$ [Factorial time]: Permutations of 1 ... n
$O(2^n)$ [Exponential time]: Exhaust all subsets of an array of size n
$O(n^3)$ [Cubic time]: Exhaust all triangles with side length less than n
$O(n^2)$ [Quadratic time]: Slow comparison-based sorting (eg. Bubble Sort, Insertion Sort, Selection Sort)
$O(n log n)$ [Linearithmic time]: Fast comparison-based sorting (eg. Merge Sort)
$O(n)$ [Linear time]: Linear Search (Finding maximum/minimum element in a 1D array), Counting Sort
$O(log n)$ [Logarithmic time]: Binary Search, finding GCD (Greatest Common Divisor) using Euclidean Algorithm
$O(1)$ [Constant time]: Calculation (eg. Solving linear equations in one unknown)

Leetcode often gives relaxed constraints, but knowing what complexities will TLE is very important.
