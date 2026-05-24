# Coolify Self-Hosting Checklist

Use this when deploying Quackback on a Coolify instance that may be reachable from the internet.

## Build

- Build context: repository root.
- Dockerfile: `apps/web/Dockerfile`.
- Expose only the web app port: `3000`.

The Dockerfile builds `@quackback/widget` before the web app. A raw `bun run build` from the repo root may fail unless the widget bundle already exists.

## Required Environment

Set these as Coolify secrets, not committed files:

```bash
BASE_URL="https://feedback.example.com"
DATABASE_URL="postgresql://quackback:REPLACE_ME@postgres:5432/quackback"
REDIS_URL="redis://dragonfly:6379"
SECRET_KEY="$(openssl rand -base64 32)"
BOOTSTRAP_TOKEN="$(openssl rand -base64 24)"
DISABLE_TELEMETRY="true"
```

`BOOTSTRAP_TOKEN` is optional but recommended before first public deploy. When set, the first user must enter it before being promoted to admin.

## Network Exposure

Only publish the Quackback web service. Keep these services internal to Coolify's private network:

- PostgreSQL (`5432`)
- Dragonfly/Redis (`6379`)
- MinIO API (`9000`)
- MinIO console (`9001`)

Do not use the development compose port mappings on an internet-facing host unless firewall rules restrict them.

## Storage

For internal MinIO, avoid exposing MinIO publicly. Use server proxying:

```bash
S3_ENDPOINT="http://minio:9000"
S3_BUCKET="quackback"
S3_REGION="us-east-1"
S3_ACCESS_KEY_ID="REPLACE_ME"
S3_SECRET_ACCESS_KEY="REPLACE_ME"
S3_FORCE_PATH_STYLE="true"
S3_PROXY="true"
S3_PUBLIC_URL=""
```

Use strong non-default MinIO credentials. Do not use `minioadmin/minioadmin` in production.

## First Admin Setup

If `BOOTSTRAP_TOKEN` is set:

1. Deploy the app behind HTTPS.
2. Visit `/onboarding`.
3. Create the first account.
4. Enter the bootstrap token from Coolify secrets.
5. Continue onboarding.

If you do not set `BOOTSTRAP_TOKEN`, keep the service private or behind temporary basic auth until first admin setup is complete.

## Backups

Back up at minimum:

- PostgreSQL database.
- MinIO/S3 bucket if uploads are enabled.
- `SECRET_KEY`; changing or losing it can invalidate auth/encrypted data.
