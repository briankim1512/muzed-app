# Generated by Django 2.2.23 on 2021-05-26 16:43

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='SharedLogs',
            fields=[
                ('log_id', models.CharField(max_length=30, primary_key=True, serialize=False)),
                ('log_details', models.TextField()),
            ],
        ),
        migrations.CreateModel(
            name='UserInfo',
            fields=[
                ('user_id', models.CharField(max_length=30, primary_key=True, serialize=False)),
                ('user_logs', models.TextField()),
            ],
        ),
    ]