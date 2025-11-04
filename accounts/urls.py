from django.urls import path
from .views import NotificationListView, RegisterView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from api.views import UserListView, UserCreateView, current_user    
urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    path('users/', UserListView.as_view(), name='user_list'),
    path('users/register/', UserCreateView.as_view(), name='user_register'),
    path('me/', current_user, name='current_user'),
    path('notifications/', NotificationListView.as_view(), name='notification_list'),
]
