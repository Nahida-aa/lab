// fn sum(n: i32) -> i32 {
//     let mut res = 0;
//     for i in 1..=n {
//         // 1,2, ..., n
//         res += i;
//     }
//     return res;
// }
// println!("Sum 1 to 100 is {}", sum(100));

// println!("Hello, world!");
// // 变量 i
// let mut i: i32 = 1;
// loop {
//     println!("i is {i}");
//     if i > 30 {
//         break;
//     }
//     i *= 2;
// }

// for _ in 0..5 {
//     println!("For looping... {}", i);
// }

// // 使用 while 5次
// let mut j: i32 = 0;
// while j < 5 {
//     println!("While looping... {}", j);
//     j += 1;
// }

fn map_demo() {
    let list1 = [1, 2, 3, 4, 5];
    let list2: Vec<_> = list1.iter().map(|x| x * 2).collect();
    println!("{:?}", list2);
}
fn main() {
    map_demo();
}
