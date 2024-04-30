
def github_login_url(client_id, redirect_url):
    """
    github登录
    :param client_id: appID
    :param redirect_url:  your github redirect_url
    :return: github登录url
    """
    g_l_url = f"https://github.com/login/oauth/authorize?client_id={client_id}&redirect_uri={redirect_url}"
    return g_l_url

def github_info(client_id, client_secret, code):
    """
    获取github用户信息
    :param client_id: appID
    :param client_secret: appSecret
    :param code: github返回的code
    :return: 用户信息
    """
    pass
    