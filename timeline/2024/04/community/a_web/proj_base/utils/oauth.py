
def github_login_url(client_id, redirect_url):
    """
    github登录
    :param client_id: appID
    :param redirect_url:  your github redirect_url
    :return: 用户名
    """
    g_l_url = f"https://github.com/login/oauth/authorize?client_id={client_id}&redirect_uri={redirect_url}"
    return g_l_url
    