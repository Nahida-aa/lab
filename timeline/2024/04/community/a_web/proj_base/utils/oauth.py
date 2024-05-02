import json
import requests
from requests.exceptions import ConnectionError

def get_github_login_url(client_id, redirect_url):
    """
    github登录
    :param client_id: appID
    :param redirect_url:  your github redirect_url
    :return: github登录url
    """
    g_l_url = f"https://github.com/login/oauth/authorize?client_id={client_id}&redirect_uri={redirect_url}"
    return g_l_url

import time
from requests.exceptions import ConnectionError

def get_github_info(client_id, client_secret, code, redirect_url):
    """
    获取github用户信息
    :param client_id: appID
    :param client_secret: appSecret
    :param code: github返回的code
    :param redirect_url:  your github redirect_url
    :return: 用户信息
    """
    access_token = get_github_access_token(client_id, client_secret, code, redirect_url)
    user_info_url = 'https://api.github.com/user'
    user_info_headers = {
        'Authorization': f'Bearer {access_token}',
        'Accept': 'application/json'
    }
    for i in range(3):  # 尝试3次
        try:
            user_info_response = requests.get(url=user_info_url, headers=user_info_headers).json()
            return user_info_response
        except ConnectionError:
            if i < 2:  # 如果不是最后一次尝试，等待一段时间然后重试
                time.sleep(5)
            else:  # 如果是最后一次尝试，重新抛出异常
                raise

def get_github_access_token(client_id, client_secret, code, redirect_url):
    """
    获取github access_token
    :param client_id: appID
    :param client_secret: appSecret
    :param code: github返回的code
    :param redirect_url:  your github redirect_url
    :return: access_token
    """
    access_token_url = f'https://github.com/login/oauth/access_token'
    access_token_url_headers = {
        'Accept': 'application/json'
    }
    access_token_url_data = {
        'client_id': client_id,
        'client_secret': client_secret,
        'code': code,
        'redirect_uri': redirect_url
    }
    for i in range(3):  # 尝试3次
        try:
            access_token_response = requests.post(url=access_token_url,
                                                  headers=access_token_url_headers,
                                                  data=access_token_url_data
                                                  ).json() 
            print(access_token_response)
            access_token = access_token_response['access_token']
            return access_token
        except ConnectionError:
            if i < 2:  # 如果不是最后一次尝试，等待一段时间然后重试
                time.sleep(5)
            else:  # 如果是最后一次尝试，重新抛出异常
                raise
