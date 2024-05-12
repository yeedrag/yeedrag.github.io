---
title: 'Linear Algebra in ML: PCA'
date: 2024-05-11 01:29:00
tags: ["Math", "AI"]
katex: true
---
Hey guys! Since class is over and im back at Taiwan, I want to share some learning on some mathematical foundations for ML. I'm not sure what I want to cover nor how deep I want to cover, although I'll try to make this as approachable for people.

Prerequisites: 

Matrix Operations and Identities, Basis, Diagonalizability, Eigenvalues and Vectors, Variance and Covariance

# What is PCA and Why?

Principal Component Analysis (PCA) is a powerful statistical technique commonly used for dimension reduction and simplification, while retaining the important information in the data.

Consider a typical RGB image with dimensions of 224 x 224 x 3, totaling 150,528 data points for a single image. That is quite alot of data points for each image! In reality, many of these points are correlated and don't significantly contribute to our understanding of the image's content—altering a few pixels won't change whether an image of a cat is recognized as a dog.

Performing dimension reduction with PCA can speed up computation by reducing the number of dimensions to process, allowing only the most crucial information to be retained while removing redundant, useless data (noise).

# Formulating and Solving PCA

Consider a dataset where each data point $\mathbf{x}_i$ has $m$ features, represented as columns in the matrix $\mathbf{X}$. Here, $\mathbf{X}$ is a $m \times n$ matrix with datapoints $\mathbf{x}_1, \dots, \mathbf{x}_n$. We want to preprocess it to mean = 0.

The goal of PCA is to reduce the dimensionality of this dataset from $m$ to $k$ (where $k < m$) by finding a new orthonormal basis $\beta' = \{\beta'_1, \dots, \beta'_k\}$, $\beta'_1 \geq \dots \geq \beta'_k$ that "best expresses" the variability in the data. 

After obtaining $\beta'$, each data point $\mathbf{x}_i$ is projected onto this new basis to obtain:

$$
\mathbf{y}_i = (\mathbf{x}_i \cdot \beta'_1)\beta'_1 + \dots + (\mathbf{x}_i \cdot \beta'_k)\beta'_k
$$

where we denote $\mathbf{Y}$ as a matrix whose column $i$ is the coefficients of $\mathbf{y}_i$.

We can also write this projection process as a matrix equation:

$$
\mathbf{Y} = \mathbf{B}\mathbf{X}
$$

Where the $i$'th row $\mathbf{B}_i = \beta'_i$. (This equation is also called change of basis)

## Optimization Objective

We need to clairify what "best expresses" meant in the previous paragraph.

In the best case, we would want each principal component have the highest variance. High variance indicates wide spread from the mean, which essentially means we retain as much information as possible from the original dataset.

Futhermore, we would wish the covariance between the principal components is minimized. Having high covariance means the components are correlated, and would be redundant.

Combined together, it's easy to see in the most optimal case, the covariance matrix for $\mathbf{Y}$, $\mathbf{C_Y} = \frac{1}{n - 1}\mathbf{Y}\mathbf{Y}^T$, should be a diagonal matrix. 

Our problem now becomes finding $\mathbf{B}$ that satisfies our goals, which we can find out by manipulating some equations:

$$
\begin{aligned}
\mathbf{C_Y} &= \frac{1}{n - 1}\mathbf{Y}\mathbf{Y}^T \\
&= \frac{1}{n - 1}(\mathbf{B}\mathbf{X})(\mathbf{B}\mathbf{X})^T \\
&= \frac{1}{n - 1}\mathbf{B}(\mathbf{X}\mathbf{X}^T)\mathbf{B}^T \\
&= \frac{1}{n - 1}\mathbf{B}(\mathbf{P}\mathbf{D}\mathbf{P}^{-1})\mathbf{B}^T,
\end{aligned}
$$

where $\mathbf{P}$ and $\mathbf{D}$ are the eigenvectors and eigenvalues of $\mathbf{X}\mathbf{X}^T$, respectively.

Notice if we choose $\mathbf{B} = \mathbf{P}_k^T$, containing only the top $k$ eigenvectors, simplifies $\mathbf{C_Y}$ to:

$$
\begin{aligned}
\mathbf{C_Y} &= \frac{1}{n - 1}(\mathbf{P}_k^T\mathbf{P})\mathbf{D}(\mathbf{P^{-1}}\mathbf{P}_k) \\  &= 
\frac{1}{n - 1} \mathbf{I}_k\mathbf{D}\mathbf{I}_k^T \\ &=
\frac{1}{n - 1} \mathbf{D}_k
\end{aligned}
$$

where $\mathbf{D}_k$ contains only the largest $k$ eigenvalues.

Thus, We've shown choosing $\mathbf{B} = \mathbf{P}_k^T$ ensures that $\mathbf{C_Y}$ is diagonal, effectively making each principal component capture distinct variance from the dataset, and "best expressing" the data as per our initial goal.

We are also guaranteed that $\mathbf{B}$ forms a orthonormal basis, since $\mathbf{P}$ is also orthonormal due to being eigenvectors of symmertrical matricies.

# Examples

After roughly going through the idea behind PCA, I will give two examples to make the process even clearer.

## Example 1: Tabular Data

This example will go through the process of PCA mathematically via a simple tabular a data.

$$
\mathbf{X} = \begin{bmatrix}
2.3 & 2.6 & 1.5 & 3.1 \\
4.9 & 5.3 & 3.2 & 6.3 \\
5.1 & 5.2 & 4.9 & 5.3 \\
8.2 & 6.3 & 7.4 & 6.8 \\
4.4 & 3.1 & 3.6 & 3.5 \\
\end{bmatrix}
$$

Our dataset contains 4 data points aranged in columns and 5 features for each data point. I designed it so $x_2$ is around 2 times of $x_1$, and $x_4$ is two times of $x_5$, and $x_3$ is independent.

### Step 1. Center the data

We first want to make the mean of the data 0 to calculate the covariance matrix later.

$$
\mathbf{X}_{\text{c}} = \mathbf{X} - \bar\mathbf{X} = 
\begin{bmatrix}
    -0.075 & 0.225 & -0.875 & 0.725 \\
    -0.025 & 0.375 & -1.725 & 1.375 \\
    -0.025 & 0.075 & -0.225 & 0.175 \\
    1.025 & -0.875 & 0.225 & -0.375 \\
    0.75 & -0.55 & -0.05 & -0.15 \\
\end{bmatrix}  
$$

We use $\mathbf{X} = \mathbf{X}_\text{c}$ from now on.

### Step 2. Calculate the symmetric matrix $\mathbf{X}\mathbf{X}^T$

$$
\begin{aligned}
\mathbf{X}\mathbf{X}^T &= 
\begin{bmatrix}
    -0.075 & 0.225 & -0.875 & 0.725 \\
    -0.025 & 0.375 & -1.725 & 1.375 \\
    -0.025 & 0.075 & -0.225 & 0.175 \\
    1.025 & -0.875 & 0.225 & -0.375 \\
    0.75 & -0.55 & -0.05 & -0.15 \\
\end{bmatrix} 
\begin{bmatrix}
    -0.075 & -0.025 & -0.025 & 1.025 & 0.75 \\
    0.225 & 0.375 & 0.075 & -0.875 & -0.55 \\
    -0.875 & -1.725 & -0.225 & 0.225 & -0.05 \\
    0.725 & 1.375 & 0.175 & -0.375 & -0.15 \\
\end{bmatrix} \\ &=
\begin{bmatrix}
    1.347 & 2.592 & 0.343 & -0.742 & -0.245 \\
    2.592 & 5.008 & 0.658 & -1.257 & -0.345 \\
    0.343 & 0.658 & 0.088 & -0.207 & -0.075 \\
    -0.742 & -1.257 & -0.207 & 2.007 & 1.295 \\
    -0.245 & -0.345 & -0.075 & 1.295 & 0.89 \\
\end{bmatrix}
\end{aligned}
$$

### Step 3. Find eigenvalues and vectors for the matrix

You can use your favorite method to find the quantities, I just used a solver and this is the result:

Eigen Values: 

$
\begin{bmatrix}
    -4 \cdot 10^{-7} & -0.0 & 0.0 & 0.0 & 0.0 \\
    -0.0 & -2.7 \cdot 10^{-7} & 0.0 & 0.0 & 0.0 \\
    -0.0 & -0.0 & 0.002 & 0.0 & 0.0 \\
    -0.0 & -0.0 & 0.0 & 2.351 & 0.0 \\
    -0.0 & -0.0 & 0.0 & 0.0 & 6.986 \\
\end{bmatrix}
$

Eigen Vectors: 

$
\begin{bmatrix}
    -0.833 & 0.012 & 0.324 & 0.116 & -0.434 \\
    0.455 & 0.094 & -0.053 & 0.311 & -0.827 \\
    -0.042 & -0.966 & -0.227 & 0.02 & -0.111 \\
    0.15 & -0.154 & 0.541 & 0.75 & 0.313 \\
    -0.274 & 0.183 & -0.74 & 0.571 & 0.132 \\
\end{bmatrix}
$

(Note: torch.linalg.eigh returns the eigenvalues and vectors from small to big)

### Step 4. Choose your $k$ and do reduction

In this example, I will choose $k = 3$, but usually you would want to choose the smallest $k$ that can keep some percentage of the variance (95 or 99).

When $k = 3$, we choose

$\mathbf{B} = \mathbf{P}_k^T =$

$
\begin{bmatrix}
    0.324 & -0.053 & -0.227 & 0.541 & -0.74 \\
    0.116 & 0.311 & 0.02 & 0.75 & 0.571 \\
    -0.434 & -0.827 & -0.111 & 0.313 & 0.132 \\
\end{bmatrix}
$

Then,

$
\begin{aligned}
3\mathbf{C_Y} &= \mathbf{B}\mathbf{P}\mathbf{D}\mathbf{P^{-1}}\mathbf{B^{-1}} \\ &=
\begin{bmatrix}
    0.002 & 0.0 & 0.0 \\
    0.0 & 2.351 & 0.0 \\
    0.0 & 0.0 & 6.986 \\
\end{bmatrix}
\end{aligned}
$
Which is what we expected.

### Step 5. Project to new basis and reconstruct data

We will now obtain the projection coefficient matrix $\mathbf{Y}$ and use it to reconstruct the data with the new basis.

$\mathbf{Y} = \mathbf{B}\mathbf{X} =
\begin{bmatrix}
    -0.018 & -0.031 & 0.018 & 0.03 \\
    1.181 & -0.826 & -0.503 & 0.148 \\
    0.475 & -0.762 & 1.895 & -1.608 \\
\end{bmatrix}
$

And if we try to reconstruct the original matrix with our new basis:

$\mathbf{B}^T\mathbf{Y} + X_\text{mean} = 
\begin{bmatrix}
    2.3 & 2.6 & 1.5 & 3.1 \\
    4.9 & 5.3 & 3.2 & 6.3 \\
    5.1 & 5.2 & 4.9 & 5.3 \\
    8.2 & 6.3 & 7.4 & 6.8 \\
    4.4 & 3.1 & 3.6 & 3.5 \\
\end{bmatrix}
$

And if we use $k = 2$:

$
\begin{bmatrix}
    2.306 & 2.61 & 1.494 & 3.09 \\
    4.899 & 5.298 & 3.201 & 6.302 \\
    5.096 & 5.193 & 4.904 & 5.307 \\
    8.21 & 6.317 & 7.39 & 6.784 \\
    4.387 & 3.077 & 3.613 & 3.522 \\
\end{bmatrix}
$

And finally, $k = 1$:

$
\begin{bmatrix}
    2.169 & 2.706 & 1.553 & 3.073 \\
    4.532 & 5.556 & 3.357 & 6.255 \\
    5.072 & 5.21 & 4.914 & 5.304 \\
    7.324 & 6.937 & 7.767 & 6.672 \\
    3.713 & 3.549 & 3.9 & 3.438 \\
\end{bmatrix}
$

As you can see, PCA did a pretty good job in perserving the relationships of features with fewer dimensions.

## Example 2: MNIST

MNIST is a classic hand writing digit dataset. We will use PCA to reduce the dimension of it and check the reconstruction results w.r.t different $k$.

[Here is the google colab for this example](https://colab.research.google.com/drive/1l0tPmVIBreJFQmfSA2u19g60MXAk8pa8?usp=sharing), I will only show the result and the code for PCA in this blog.

```py
def PCA(images, k):
  # Flatten the image and center the data
  images = images.reshape([images.shape[0], -1])
  mean = images.mean(0)
  images = images - mean 
  # Calculate covariance matrix and eigenvalues/vectors
  cov_matrix = torch.matmul(images.T, images) / (images.shape[0] - 1)
  eigen_values, eigen_vectors = torch.linalg.eigh(cov_matrix)
  # Get eigenvectors w.r.t top k eigenvalues
  eigen_vectors_k = eigen_vectors[:, -k:]
  # Get Y, matrix with coefficients w.r.t new basis
  projected_data = torch.matmul(images, eigen_vectors_k)
  # Reconstruct images
  new_images = torch.matmul(projected_data, eigen_vectors_k.T) + mean
  return new_images
```

![PCA](PCA.png)

# Afterword

PCA is quite an old, yet powerful linear dimension reduction algorithm. The whole encoder-decoder architecture, and embedding systems all use dimension reduction, so this is very important! If you want to learn more about dimension reduction, (deep)auto-encoders are a good place to start. Good luck!

It took me quite some time to compose this blog, so I hope it was clear and concise for you to understand.

My freshman year is finally over, and after my grades all roll out, I think I will make a short blog to summarize up my first year in college!

Taiwan food yummy~

# References

[A Tutorial on Principal Component Analysis](https://www.cs.cmu.edu/~elaw/papers/pca.pdf)

[ML Lecture 13: Unsupervised Learning - Linear Methods](https://youtu.be/iwh5o_M4BNU?si=mPfm6E6RLNkHPlQw)

