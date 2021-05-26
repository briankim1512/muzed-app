from django.db import models

# Create your models here.
class UserInfo(models.Model):
    user_id = models.CharField(primary_key=True, max_length=30)
    user_logs = models.TextField()

class SharedLogs(models.Model):
    log_id = models.CharField(primary_key=True, max_length=30)
    log_details = models.TextField()
