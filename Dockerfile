FROM python:3.11-slim

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PORT=8080 \
    DB_PATH=/data/level_one.db

WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
# .dockerignore keeps .env (secrets), *.db and logs out of the image.
COPY . .

RUN useradd --create-home --uid 10001 app && mkdir -p /data && chown -R app /data /app
USER app

# Mount a persistent volume here, otherwise the database is lost with the container.
VOLUME /data
EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD python -c "import os,urllib.request; urllib.request.urlopen('http://127.0.0.1:%s/healthz' % os.environ.get('PORT','8080'), timeout=4)"

CMD ["python", "server.py"]
