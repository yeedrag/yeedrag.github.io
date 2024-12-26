---
title: 'Paper Reading 3: BERT/RoBERTa/LoRA'
date: 2024-12-25 15:40:20
tags: ['AI']
---

Hey Yall!

It's been quite a while (again), I finished the first semester of my sophomore year! I'll be giving some recaps later, but let's read some papers first :D

For some context, I took a graduate LLM class this semester, and there were alot of papers that were mentioned, so I wanted to go over them thoroughly throughout the winter break.

In this blog, I will be covering BERT, RoBERTa and LoRA. I was going to do "Attention is all you need" but I decided o maybe put that as a individual blog with detailed implementations for the transformer, since it's such a important model.

## [BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding](https://arxiv.org/pdf/1810.04805)

An important thing to note about BERT in the world of generative models is that it isn't a generative language model! It is purely an encoder that is used to understand language itself, and you need to use it for various downstream tasks. I think it is similar to CLIP for VLMs.

### Why do we need BERT?

BERT improves on language representation models by allowing a bidirectional understanding rather than just left-to-right or vise versa. We usually train a model by providing the tokens before a timestep $t$, and train the model to predict the token on timestep $t$ conditioned on the previous context. However, in terms of langauge understanding like Q&A, sentence comparison, you really need the context of the whole sentence/paragraph instead of just going one way.

### How?

They used two very special unsupervised training task to achieve this bidirectional understanding:

#### Masked LM (MLM)

The idea is very simple, we mask random tokens in the sentence and ask the model to reconstruct the whole sentence before the masking.

Interestingly, they choose 15% of the tokens to mask, but out of these 15%, 80% of the time it will be a mask token [MASK], 10% of the time being a random token, and 10% the token will be unchanged. The intuition they gave in the paper was that this procedure makes it so that the model doesn't always know which word has been replaced, hence requiring the model to really understand the whole contextual representation of the entire sequence. 

(Note that they mask tokens, not words, so if a word is separated into two tokens it might only mask one of them. Whole Word Masking (WWM) was used in newer versions of BERT and makes more sense in my opinion.)

### Next Sentence Prediction (NSP)

Their input for the model consists of two sentences A and B, which are separated by a special token [SEP]. Apart from masking them and doing MLM, they also required the model to additionally do a binary classification to determine if the sentence B is the next sentence of A or not. An illustration can be seen below:

![NSP](image.png)

They said this could help the model understand connections between sentences and could help downstream tasks (spoiler alert: it doesn't), but it is interesting.


### Thoughts?

Well looking at BERT today, it's honestly pretty standard as most frameworks are built upon its ideas, but I can understand why its such an important idea back then.

## [RoBERTa: A Robustly Optimized BERT Pretraining Approach](https://arxiv.org/pdf/1907.11692)

This is a sequal of BERT using the exact same architecture, but using different training approaches.

### Why?

They realized that BERT was actually very much under-trained and had a lot of potential, so they developed a more systematic study to improve BERT.

### How?

#### Training tweaks

I'll compose all the minor training changes here: They used more data and it worked better (Who would've thought..), more pretraining time (thats crazy who would've known???), and bigger batch sizes.

#### Study on NSP

This is one of the more interesting discoveries in this paper. In the original BERT paper, they tried removing NSP loss and it hurt the performance quite a bit. However, in this paper they tried several settings, and they found out that if you remove NSP loss, and change the format of the input from two sentences to just one whole sentence instead, it performs better! (In the original BERT when they were trying to remove NSP, they still kept the 2 sentence input structure). Very weird but cool!

### Thoughts?

There really isn't that much to say about this paper, just that they did a more systematic evaluation on their previous choices. However, I feel like beside the study on the NSP objective, the other improvements like more data, more batches, is quite apparent when a model is undertrained, so this paper isn't that interesting imo.

## [LoRA: Low-Rank Adaptation of Large Language Models](https://arxiv.org/pdf/2106.09685)

### Why?

Usually when we adapt a general LLM to a specific dataset, we do a full finetuning, which is essentially just training all weights on this specific dataset. However, this is obviously very expensive, as most LLMs have several billion parameters. There has been quite some ideas to mitigate this like using task specific heads, but this increases inference latency and also doesn't work as well compared to finetuning. 

### How?

The idea stems from a previous research, which states these LLMs are usually over-parametrized, and that the weight matrices of an LLM are intrinsic low rank. That is, they all reside on a low dimention subspace, so we actually don't need to use this big of a matrix to properly characterize the weights. Since the weights itself are low-rank, the authors hypothesized that the updated weights should naturally be low-rank as well. This also makes sense because adaptation focuses on more local features, which shouldn't require that many dimensions to work with.

For an adapted weight $W'$, we can think of it as the sum of the original weight $W$ and the change of the weigt $\Delta W$, so for an output we have 
$$h = W'x = Wx + \Delta W x$$

Where $W'$, $W$, $\Delta W$ all have dimensions $\mathbb{R}^{d \times k}$.  

LoRA replaces $\Delta W$ with two low rank matrices $A \in \mathbb{R}^{d \times r}$ and $B \in \mathbb{R}^{r \times k}$, where $r \ll \min(d,k)$. Giving 
$$h = Wx + ABx = (W + AB)x$$

It's far less complex training the two matrices $A$ and $B$, where originally we have $O(dk)$, and now only $O(r(d+k))$and during inference we can precompute $W' = W + AB$ so there is also little latency.

Its usually used in the 4 attention weights in transformers, and it also has a plug-and-play style, so we can effeciently adapt to and switch tasks.


### Thoughts?
One interesting observation from the paper was that the low rank matrices was amplifying features that were important for the task but was not focused on in the general model. I'm wondering if doing full tuning we will also get this effect or not (I think it should, but maybe the updates are more general?)

Anyways, interesting paper, easy yet effective idea.







