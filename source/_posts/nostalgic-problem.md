---
title: Nostalgic problem
date: 2023-09-28 20:54:00
tags: ["CP"]
---
While I was doing random 1700~2000 problem, I noticed one problem was the problem I did two years ago when I our club was choosing committee members. I was the only one that got full points in this problem!
Now I revise this problem two years later, it was actually really easy. But 2021 yeedrag tried for nearly 3 days and dozens of attempts to get it accepted!
Here is a comparison of the code for the same problem I wrote two years apart:
2021-05-25 code:

```cpp
int main(){
    int n=0;
    int firstsecond=0;
    int temp=0;
    int left=0;
    int right=0;
    int mid=0;
    int a = 0;
    cin>>n;
    //ask all;
    cout<<"? 1 "<<n;
    cout<<endl;
    cin>>firstsecond;
    if(firstsecond==1){
        a=1;
    }else{
        cout<<"? "<<1<<" "<<firstsecond<<endl;
        cin>>temp;
        if(temp==firstsecond){
            a=0;
        }else{
            a=1;
            }
        }
    if(!a){
        left = 1;
        right = firstsecond-1;
        while(left!=right){
            mid = (left + right+1)/2;
            cout<<"? "<<mid<<" "<<n;
            cout<<endl;
            cin>>temp;
            if(temp==firstsecond){
                left = mid;
            } else {
                right = mid-1;
            }
        }
        cout<<"! "<<left;
        cout<<endl;
        return 0;
    } else {
        left = firstsecond+1;
        right = n;
        while(left!=right){
            mid = (left + right-1)/2;
            cout<<"? "<<1<<" "<<mid;
            cout<<endl;
            cin>>temp;
            if(temp==firstsecond){
                right = mid;
            } else {
                left = mid+1;
            }
        }
        cout<<"! "<<left;
        cout<<endl;
        return 0;
    }
}
```

2023-09-29 code:

```cpp
int query(int l, int r) {
    cout << "? " << l << " " << r << endl;
    int ret; 
    cin >> ret;
    return ret;
}
void solve() {
    int n;
    cin >> n;
    int second = query(1, n);
    int l = 1, r = n;
    int q;
    if(second == 1) {
        l = 2;
        r = n;
    } else if(second == n) {
        l = 1;
        r = n - 1;
    } else {
        q = query(1, second);
        if(q != second) l = second + 1;
        else r = second - 1;
    }
    while(r - l > 1) {
        int m = (r + l) >> 1;
        q = query(min(m, second), max(m, second)); 
        if(q != second) {
            if(r < second) r = m - 1;
            else l = m + 1;
        } else {
            if(r < second) l = m;
            else r = m;
        }
    }
    if(r < second) {
        q = (query(r, second) == second) ? r : l;
    } else {
        q = (query(second, l) == second) ? l : r;
    }
    cout << "! " << q << endl;
    return;
}
```

As you can see, the coding style, indents and whole organization was drastically different, so nostalgic :D
