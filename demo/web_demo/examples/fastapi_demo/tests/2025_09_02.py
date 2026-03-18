# def 验证(剩余次数: int, 密码: str):
#     if 剩余次数 > 0:
#         if input('请输入密码：') == 密码:
#             print('验证成功，欢迎使用')
#         else:
#             print(f'密码错误，你还有 {剩余次数 - 1} 次机会')
#             验证(剩余次数 - 1, 密码)
#     else:
#         print('验证失败，账户已锁定')

# 验证(5, '135147')

# password = '135147'
# maximum_number_of_verification_attempts = 5

# def verification(remaining_times: int, print) -> bool:
#     if remaining_times <= 0:
#         print('verification failed, the account has been locked')
#         return False
#     enter_password = input('please enter the password: ')
#     if enter_password == password:
#         print('verification successful, welcome to use')
#         return True
#     else:
#         print(f'incorrect password, you have {remaining_times - 1} more chance')
#         return verification(remaining_times - 1, print)

# verification(maximum_number_of_verification_attempts, print1)


def func():
    print(f'a: {a}')

func() # 你认为: a: None; 实际: err
a = 'rust'
func() # 你认为: a: rust
a = 'ts'
func() # 你认为: a: ts
