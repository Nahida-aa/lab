#python3
#接口类型：互亿无线触发短信接口，支持发送验证码短信、订单通知短信等。
#账户注册：请通过该地址开通账户https://user.ihuyi.com/new/register.html
#注意事项：
#（1）调试期间，请用默认的模板进行测试，默认模板详见接口文档；
#（2）请使用 用户名 及 APIkey来调用接口，APIkey在会员中心可以获取；
#（3）该代码仅供接入互亿无线短信接口参考使用，客户可根据实际需要自行编写；

import json
import urllib.parse
import urllib.request
# import sys
# sys.path.insert(0, 'a_web')
# from settings.dev import APIID, APIKEY
# from proj_base.settings.dev import APIID, APIKEY
# from django.conf.settings.dev import APIID, APIKEY
from django.conf import settings
APIID = settings.APIID
APIKEY = settings.APIKEY

# def send_sms_code(smscode, mobile):
#     #接口地址
#     url = 'http://106.ihuyi.com/webservice/sms.php?method=Submit'
#     #定义请求的数据
#     values = {
#         'account':APIID,
#         'password':APIKEY,
#         'mobile': mobile,
#         'content':f'您的验证码是：{smscode}。请不要把验证码泄露给其他人。',
#         # 'content':f'您的验证码是：123456。请不要把验证码泄露给其他人。',
#         'format':'json',
#     }
#     #将数据进行编码
#     data = urllib.parse.urlencode(values).encode(encoding='UTF8')
#     #发起请求
#     req = urllib.request.Request(url, data)
#     response = urllib.request.urlopen(req)
#     res = response.read()
#     content = res.decode("utf8")
#     # b'{"code":2,"msg":"提交成功","smsid":"20210428101312345"}'
#     #返回请求结果
#     return json.loads(content)

def send_sms_code(smscode, mobile):
    return {
        'code': 2,
        'msg': '此功能已被禁用',
        'smsid': '20210428101312345',
    }

#-----------------------------------
#python2

#接口类型：互亿无线触发短信接口，支持发送验证码短信、订单通知短信等。
#账户注册：请通过该地址开通账户https://user.ihuyi.com/new/register.html
#注意事项：
#（1）调试期间，请使用用系统默认的短信内容：您的验证码是：【变量】。请不要把验证码泄露给其他人。
#（2）请使用 APIID 及 APIKEY来调用接口，可在会员中心获取；
#（3）该代码仅供接入互亿无线短信接口参考使用，客户可根据实际需要自行编写；
   
#!/usr/local/bin/python
# #-*- coding:utf-8 -*-
# import httplib
# import urllib
 
# host  = "106.ihuyi.com"
# sms_send_uri = "/webservice/sms.php?method=Submit"
 
# #查看用户名 登录用户中心->验证码通知短信>产品总览->API接口信息->APIID
# account  = "用户名"
# #查看密码 登录用户中心->验证码通知短信>产品总览->API接口信息->APIKEY
# password = "密码"
 
# def send_sms(text, mobile):
#     params = urllib.urlencode({'account': account, 'password' : password, 'content': text, 'mobile':mobile,'format':'json' })
#     headers = {"Content-type": "application/x-www-form-urlencoded", "Accept": "text/plain"}
#     conn = httplib.HTTPConnection(host, port=80, timeout=30)
#     conn.request("POST", sms_send_uri, params, headers)
#     response = conn.getresponse()
#     response_str = response.read()
#     conn.close()
#     return response_str
 
# if __name__ == '__main__':
 
#     mobile = "138xxxxxxxx"
#     text = "您的验证码是：121254。请不要把验证码泄露给其他人。"
 
#     print(send_sms(text, mobile))