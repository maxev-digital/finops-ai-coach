module.exports = {
  apps: [
    {
      name: "finops-coach-api",
      script: "uvicorn",
      args: "app.main:app --host 127.0.0.1 --port 8002 --workers 2",
      interpreter: "python3",
      cwd: "/var/www/finops-ai-coach/backend",
      env: { PYTHONUNBUFFERED: "1" },
      error_file: "/var/log/finops-coach-api-error.log",
      out_file: "/var/log/finops-coach-api-out.log",
      restart_delay: 5000,
    },
    {
      name: "finops-coach-frontend",
      script: "node_modules/next/dist/bin/next",
      args: "start --port 3035",
      cwd: "/var/www/finops-ai-coach/frontend",
      env: { NODE_ENV: "production", PORT: "3035" },
      error_file: "/var/log/finops-coach-frontend-error.log",
      out_file: "/var/log/finops-coach-frontend-out.log",
      restart_delay: 5000,
    },
  ],
};
