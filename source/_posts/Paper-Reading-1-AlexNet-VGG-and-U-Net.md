---
title: 'Paper Reading 1: AlexNet, VGG and U-Net'
date: 2024-02-24 16:28:26
tags: ["AI"]
---
For the first week of my goal of reading AI paper, I chose three very classic CV papers to read from. Lets see what we can learn from reading these very old yet groundbreaking papers!

I'll roughly talk about the main important parts of the papers and add my own thoughts and opinions. Details can be found in the original paper that I've linked in the title.

## [ImageNet Classification with Deep Convolutional Neural Networks (2012)](https://papers.nips.cc/paper_files/paper/2012/file/c399862d3b9d6b76c8436e924a68c45b-Paper.pdf)

This is the paper about the well-known model "AlexNet". I would say this is one of the most influential CV papers of all time. This is the first paper that really showed the world what large scale Convolution Neural Networks can do, and also mentioned several techniques that are used even today.

### Dataset for AlexNet

An important background to note about this paper is the existence of ImageNet, a large scale image database with over 15 milion labeled high-res images in over 22000 categories.

Prior to these big datasets, there were only small dataset that were not enough data to train a "large" CNN model like AlexNet.

### ReLU Nonlinearity

One big contribution about AlexNet is choosing ReLU instead of the more common non-linear functions like tanh or sigmoid as its output function (which we like to call activation functions today). According to the paper, this change enabled around 25% faster convergence speed compared to tanh.

### Multi GPU Training

Since AlexNet was so big, they used multiple GPUs to train their models, which is also something common with todays huge models.

### Local Responce Normalization (LRN)

This was a normalization technique introduced in this paper. The idea is similar to lateral inhibition in biological systems, where it amplifies the strong responces by damping the neighbors.

Do note that this method of normalization isn't being used alot in recent years, with it being overshadowed by more popular techniques like Batch Normalization, but its still an interesting idea to learn from.

### Overlapping Pooling

In this paper they used max pooling in certain layers. Pooling before this paper usually used non-overlapping pooling, but according to this paper, making the pooling overlap can reduce the error rates and that they observed the model is harder to overfit with overlapping pooling.

Overlapping pooling is also quite the norm in recent years, at least I was really suprised to know that they didn't do overlapping pooling before.

### Reducing Overfitting

In the paper, they mentioned two tricks they employed that reduced overfitting. These two methods are also used alot even today.

#### Data Augmentation

The main augmentation used is image translation and horizontal reflection. They extracted random patches from the images and also flipped them, which in total increases the size of the dataset by 2048. During testing, they do the same thing to the testing image, and average the predictions made on each patches, which is something I don't think we do now.

Secondly, they also alter the intensities of the RGB channels in the images, which is also quite common now.

#### Drop Out

They also employed a famous technique called drop out, which randomly drops out neurons during training, and this forces the model to be more robust and not rely on certain neurons.

Something interesting is that they chose a 50% chance to drop out a neuron. During testing, they would multiply the output with 0.5 to make an approximation of the loss from the drop out. I think what we usually do now is scale the remaining neurons up to make the expectaion the same as before.

### Other Details and Discussion

In the paper, they concluded the depth of the model is extremely important, and even just removing one layer made the performance drop drastically.

They chose to use stochastic gradient descent with batch size 128, momentum 0.9, weight decay of 0.0005. They concluded that the weight decay was important for the model to learn. (Note: Adam was published at 2014)
They also used a fixed learning rate, only scaling it by 1/10 when the validation learning rate stopped improving. The whole model took 6 days on a GTX 580 3GB.

## [Very Deep Convolutional Networks for Large-Scale Image Recognition (2014)](https://arxiv.org/pdf/1409.1556.pdf)

This paper is the paper for famous VGG model, where it kinda developed a systematic way to build CNNs, and shown the world how important depth is for a model.

### 3 x 3 Convolutions

According to the paper, a 3x3 convolution is the smallest size to cature the notion of left/right, up/down and center. They discovered that not only you can stack 3x3 convolutions to have the same effective receptive field as larger convolutions (two 3x3 is the same as a 5x5), you can even achieve a higher accuracy due to incoporating more non-linearity in between the convolutions (deep with small filters > shallow but large fillers). Futhermore, stacking small filters decreases the model's parameters (three 3x3 with $c$ channels has $3 \cdot (3^2c^2) = 27c^2$ params, while one 7x7 with $c$ channels has $7^2c = 49c^2$ params), which makes training cheaper.

However, they also tested models that incorporated 1x1 convolutions (Used in Network in Network (NiN)), but performs worse than the 3x3 counterpart, which suggests that non-linearity is important, but so is capturing spatial context.

### Scale Jittering

They also mentioned an interesting augmentation idea, which is randomly scaling the images and cropping them.They did two tests, one is scaling the images to a fixed size, the second one is scaling the images to [256, 512], and then cropping the image. They found out that doing scale jittering at training time did lead to significantly better results than fixing the size, even when the fixed scale is used in test time.

They also tested scale jittering during test time, and while it was better than fixed, they suspected was due to a different treatment of boundary conditions, and their combination outperforms both of them.

### Other Details and Discussion

They also tested AlexNet's LRN, but found that it didn't have much improvement compared to the models that didn't employ this technique.

They also didn't sample multiple crops at the same time like AlexNet did, but I didn't really understand why they said they didn't while I felt like they did :/.

The rest of the tricks, the batch size, the learning rate and details are all the same as AlexNet, so I won't go over them again.

The training was done on 4 Titan Black GPUs, and each net took around 2~3 weeks.

## [U-Net: Convolutional Networks for Biomedical Image Segmentation (2015)](https://arxiv.org/pdf/1505.04597.pdf)

This is the paper for the famous semantic segmentation model U-Net, which has precise localization, and is even used in my research for historical map segmentation.

### Challenges

It's important to note the challenges behind biomedical image segmentation, and the problems with previous works.

One of the most difficult problem is the precision required in biomedical images, having precise localization is a must when dealing with medical images that might become a life or death situation. There has been previous attempts to localize and assign each pixel to a class by using a small sliding window and predicting each patch. This method however is too computational heavy, and also loses the whole context of the picture since you are only using a small part of the image.

Secondly, the separation of touching objects of the same classes is also a tricky situation to handle, and their boundaries are really similar and its easy for the model to think that they all belong to one object.

### Architecture

Since the most important part of U-Net is the architecture, I will give a brief explaination of how it works.

![unet](unet.png)

As you can see in the picture, there are two main paths: The left part is the contraction path (Or encoder in recent terms), where it downsamples the original images, capturing the pictures high-level features.

The right part is the Expansion path (decoder), where is starts to upsample the feature maps, and also connecting with previous maps from the contraction path (This is actually really similar to skip-connection in ResNet, which I will cover in later readings). This way, the model can localize better while retaining the information of high-level features.

Also notice that the model did not utilize any fully connected layers (or dense layers), which makes this model a fully convolutional network, that is said to be able to enable seemless segmentation of arbitrarily large images.

### Loss

In order to combat the boundary problem, they used a weighted soft-max + cross entropy loss to penalize wrong border assigning.

Recent days we will tend to use Dice Loss or focal loss, which usually has better effects accoring to my own experience.

### Data Augmentation

Data augmentation was also an important part of medical image segmentation, as often only few training images are availiable. The augmentation they chose is shift and rotation, as well as elastic deformation and gray scale variations. According to the paper, these augmentations contributed massively to their success.

## Final Words

This week I read the three aforementioned papers, and its honestly really fascinating to see some of the techniques that we are still using to this day, while some ideas and questions have better solutions now. Also, reading papers isn't as difficult as I thought, although I think maybe this is because im quite familiar with these models and methods. All in all, I really enjoyed reading these papers, and we'll see whats coming up next!
