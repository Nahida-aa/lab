list1 = [1,2,3,4,5]
def f(x):
    return x*2
list2 = map(f, list1)
print(list(list2))