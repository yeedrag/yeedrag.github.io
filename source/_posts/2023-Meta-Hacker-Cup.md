---
title: 2023 Meta Hacker Cup
date: 2023-10-21 22:05:07
tags: ["CP"]
---

Okay, I know yesterday I said I'm going to grind a mashup every morning, and I didn't do it today, because today is Meta Hacker Cup Round 2!

This blog will be a short recap and summary for my meta hacker cup experience.

## 9/22 ~ 9/27 Practice Round

Rank: 1711 / 12138
AC Count: 2 / 5 (FST 2)

This is a round made for understanding how the contest works (and also making me realise how weak the pretests are).

A1 and B are extremely simple, B even only has 4 lines of code! Although A2 and C has weak pretests, even alot of top coders got FST here.

## 10/7 Round 1

Rank: 1478 / 20324
AC Count: 4 / 7

This round is probably the worst contest experience I've ever had. I couldn't submit solutions for the first hour, and the validation test set was even missing test cases! It was just a big shitshow in summary.
Problem wise, pA was a really simple problem, but I just used brute force $O(t \cdot n^2)$ with $n \leq 1e5$ and $t \leq 20$. This obviously would TLE in codeforces, but in MHC we run code locally, and you have 6 minutes to run the code, so it finished in around 30 seconds.
B is a bruteforce problem, I solved B1 quickly, but my original analysis for B2 was wrong, so I didn't think the bruteforce idea would pass.
C is a beautiful greedy problem. I like this problem the most in the whole MHC event. The observation for C2 was pretty satisfying, and after that the implementation was quite simple yet elegant.

I did not solve D in contest, but I'm ashamed that I didn't notice that $x \cdot 1000000006 \% 1000000007$ is actually equivilent to $x \cdot -1 \% 1000000007$, then it can be converted to a straight forward lazy segment tree problem.

## 10/21 Round 2

Rank: 753 / 6193
AC Count: 3 / 5

My goal for this round was to get in top $2000$, as you can get a free t-shirt!

pA was a very simple BFS implementation problem, which really required not much skill (But apparently because of FSTs you could get in top $2000$ just by solving A1 and A2!).

pB was a pretty tricky problem, and alot of people got FST in this problem. I used a sliding window + prefix sums to check the first two conditions, and bruteforce check palindromes, which when amortized the complexity is quite fast.

All in all, I could've got in round 3 if I solved pB quick enough, but I am still really happy that I got rank 753 (yay t-shirt!). I hope I can get in round 3 next year, good luck to future me!

![certificate](image-6.png)

(I accidentally used my alt fb account lol)
