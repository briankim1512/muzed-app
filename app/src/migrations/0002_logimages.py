# Generated by Django 2.2.23 on 2021-05-28 15:40

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('src', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='LogImages',
            fields=[
                ('image_id', models.CharField(max_length=30, primary_key=True, serialize=False)),
                ('image_file', models.FileField(upload_to='')),
            ],
        ),
    ]
