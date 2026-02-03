# 🚀 How to Run the App (Deployment Mode)

This guide explains how to start your application using Docker and share it with others.

## 1. Start the App (Frontend + Backend)
You do **NOT** need to run `python main.py` or `npm start` manually. Docker handles both.

1.  Open a terminal in the project folder.
2.  Run this command:
    ```bash
    docker-compose up -d
    ```
    *(The `-d` runs it in the background)*.

## 2. Share it (Public Link)
To let others access it from their phones/laptops:

1.  Look at your **ngrok** dashboard or just run:
    ```bash
    ngrok http --domain=calvin-uncarved-amado.ngrok-free.dev 3000
    ```
2.  Share the link: `https://calvin-uncarved-amado.ngrok-free.dev`

## 3. Stop the App
When you are done, run:
```bash
docker-compose down
```

---

## Troubleshooting
- **Port 3000 already in use?**
    - You might have `npm start` running locally. Close that terminal or run `docker-compose down`.
- **"Docker not running"?**
    - Open the **Docker Desktop** app on your PC first.
