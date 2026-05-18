from fastapi import APIRouter, Response, status
from fastapi.responses import JSONResponse
from pydantic import BaseModel

router = APIRouter(tags=["auth"],)

# login input
class LoginIn(BaseModel):
    username: str
    password: str
class Token(BaseModel):
    token: str
    expires: int # 过期时间, 单位秒
class ErrorOut(BaseModel):
    error: str
class User(BaseModel):
    username: str
    password: str
    def __getitem__(self, item):
        return getattr(self, item)
假数据_users: list[User] = [
    User(username="aa", password="string"),
    User(username="瑶", password="password2"),
    User(username="user3", password="password3"),
]
def get_user(username: str):
    for user in 假数据_users:
        if user["username"] == username:
            return user
    return None

@router.post("/api/login", 
    responses={
        200: {"model": Token, "description": "- 登录成功"},
        404: {"model": ErrorOut, "description": "用户不存在"},
        401: {"model": ErrorOut, "description": "密码错误"},
    },
)
async def login(login_in: LoginIn, response: Response):
    get_user_result = get_user(login_in.username)
    if not get_user_result:
        return JSONResponse(
            status_code=404,  # 用户不存在，返回 404 状态码
            content=ErrorOut(error="用户不存在").model_dump()
        )
    if get_user_result["password"] != login_in.password:
        response.status_code = status.HTTP_401_UNAUTHORIZED
        return ErrorOut(error="密码错误")

    return Token(token=f"fake_token.{login_in.username}", expires=3600)

class SignupIn(BaseModel):
    username: str
    password: str
    def __getitem__(self, item):
        return getattr(self, item)

@router.post("/api/signup")
async def signup(signup_in: SignupIn, response: Response):
    # 检查用户名是否已存在
    for user in 假数据_users:
        if user["username"] == signup_in.username:
            response.status_code = status.HTTP_409_CONFLICT
            return ErrorOut(error="用户名已存在")
    # 注册用户
    new_user = User(username=signup_in.username, password=signup_in.password)
    假数据_users.append(new_user)
    # return {"message": "注册成功"}
    return Token(token=f"fake_token.{signup_in.username}", expires=3600)
