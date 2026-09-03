from django.urls import path

from .views import (
    RegisterView,
    LoginView,
    ProfileView,
    CurrentCustomerView,
)


urlpatterns = [

    # REGISTER
    path(
        "register/",
        RegisterView.as_view(),
        name="register"
    ),

    # LOGIN
    path(
        "login/",
        LoginView.as_view(),
        name="login"
    ),

    # PROFILE
    path(
        "profile/",
        ProfileView.as_view(),
        name="profile"
    ),

    # CURRENT CUSTOMER
    path(
        "current-customer/",
        CurrentCustomerView.as_view(),
        name="current-customer"
    ),
]