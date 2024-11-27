# from mcc.api import router as mcc_router
# from mcc.api.user import MathAPI
from ninja_extra import NinjaExtraAPI, api_controller, http_get

api = NinjaExtraAPI(
    title="MCC API",
)

# api.add_router("/users/", users_router)    # You can add a router as an object
# api.add_router("", mcc_router)    # You can add a router as an object
# api.add_router("/orgs/", "orgs.api.router")  #   or by Python path
# api.add_router("/proj/", "blogs.api.router")

# @api.get("/add")
# def add(request, a: int, b: int):
#     return {"result": a + b}

# api.register_controllers(
#     MathAPI
# )
api.auto_discover_controllers()