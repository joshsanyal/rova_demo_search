# Generated by Django 4.2.9 on 2024-05-30 23:49

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="ChatSession",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("name", models.CharField(max_length=255)),
                ("last_updated", models.DateTimeField(auto_now_add=True)),
            ],
        ),
        migrations.CreateModel(
            name="UploadedFile",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("filename", models.CharField(max_length=255)),
                ("file", models.FileField(upload_to="uploads/")),
                (
                    "file_organization",
                    models.CharField(default="reference", max_length=255),
                ),
                ("upload_date", models.DateTimeField(auto_now_add=True)),
            ],
        ),
        migrations.CreateModel(
            name="ChatHistory",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("user", models.CharField(max_length=255)),
                ("message", models.TextField()),
                ("documents", models.JSONField(default=list)),
                (
                    "session",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="chats",
                        to="myapi.chatsession",
                    ),
                ),
            ],
        ),
    ]
