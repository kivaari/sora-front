import os
from pathlib import Path
from django.shortcuts import render

BASE_DIR = Path(__file__).resolve().parent.parent

def loader_page(request):
    return render(request, 'main/loader.html')

def registration_page(request):
    return render(request, 'main/registration.html')

def home_page(request):
    # Путь к директории со статическими файлами
    static_dir = os.path.join(BASE_DIR, 'main', 'static', 'main')
    # Получаем список mp3 файлов
    mp3_files = []
    for file in os.listdir(static_dir):
        if file.endswith('.mp3'):
            mp3_files.append({
                'title': os.path.splitext(file)[0],
                'file_name': file,
                'duration': '1:00',  # Здесь можно добавить получение реальной длительности
                'styles': 'hip-hop, edm',  # Можно хранить метаданные в отдельном файле
                'tempo': '160 bpm'
            })
    
    return render(request, 'main/home.html', {'mp3_files': mp3_files})