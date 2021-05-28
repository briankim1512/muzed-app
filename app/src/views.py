from django.shortcuts import render
from django.http import JsonResponse
from src.models import UserInfo, SharedLogs, LogImages
import json

# Create your views here.

def index(request):
    return render(request, 'index.html')

def api(request):
    response = {'result': 'failed'}
    request = json.loads(request.body)

    if request['type'] == 'regular_get':
        try:
            user_info = UserInfo.objects.get(user_id__exact=request['userID'])
            response = {'result': user_info.user_logs}
        except UserInfo.DoesNotExist as err:
            response = {'result': ''}

    if request['type'] == 'regular_post':
        try:
            user_info = UserInfo.objects.get(user_id__exact=request['userID'])
            user_info.user_logs = request['data']
            user_info.save()
            response = {'result': 'success'}
        except UserInfo.DoesNotExist as err:
            new_user_info = UserInfo(user_id=request['userID'], user_logs=request['data'])
            new_user_info.save()

    if request['type'] == 'shared_get':
        log_info = SharedLogs.objects.get(log_id__exact=request['sharedID'])
        response = {'result': log_info.log_details}

    if request['type'] == 'shared_post':
        shared_log = SharedLogs(log_id=request['uid'], log_details=request['data'])
        shared_log.save()
        response = {'result': 'success'}

    return JsonResponse(response)

def upload_image(request):
    response = {'result': 'failed'}

    log_image = LogImages(image_id=request.POST.get('image_id'), image_file=request.FILES['image_file'])
    log_image.save()
    response = {
        'result': 'success',
        'url': log_image.image_file.url
    }

    return JsonResponse(response)
