# Railway MySQL Connection Guide

## Current Status
❌ **Database temporarily unavailable** - Connection timeout to `interchange.proxy.rlwy.net:47475`

## When Database Becomes Available

### Option 1: Using WSL (Recommended)
```bash
# Install MySQL client in WSL
wsl
sudo apt update
sudo apt install mysql-client

# Connect to Railway database
mysql -h interchange.proxy.rlwy.net -u root -p -P 47475 --protocol=TCP railway
# Password: nwUEyCFMYebiHHgsbRZpbzpbLddMiazE
```

### Option 2: Using Prisma Commands
```bash
# Apply schema to database
npx prisma db push

# Create migration
npx prisma migrate dev --name init

# Open Prisma Studio
npx prisma studio

# Generate client
npx prisma generate
```

### Option 3: Test Connection Script
```bash
# Test database connectivity
npx tsx scripts/test-railway-connection.ts

# Initialize database with sample data
npx tsx scripts/init-prisma-db.ts
```

## Alternative: Install MySQL for Windows

### Using Chocolatey
```powershell
# Install Chocolatey (if not installed)
Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))

# Install MySQL
choco install mysql.workbench
```

### Using Manual Download
1. Download MySQL Workbench from: https://dev.mysql.com/downloads/workbench/
2. Or download MySQL Command Line Client from: https://dev.mysql.com/downloads/mysql/

## Database Schema Status
✅ **Prisma schema is ready** - Complete schema with all tables defined
✅ **Migration SQL generated** - Ready to apply when database is accessible
✅ **Application updated** - All API routes migrated to Prisma

## Connection Details
- **Host:** interchange.proxy.rlwy.net
- **Port:** 47475
- **Database:** railway
- **Username:** root
- **Password:** nwUEyCFMYebiHHgsbRZpbzpbLddMiazE

## Next Steps When Database Is Available
1. Test connection using one of the methods above
2. Apply Prisma schema: `npx prisma db push`
3. Initialize sample data: `npx tsx scripts/init-prisma-db.ts`
4. Verify with Prisma Studio: `npx prisma studio`
5. Deploy updated application to Vercel

## Troubleshooting
- Railway databases sometimes have temporary connectivity issues
- Try connecting again in a few minutes
- Check Railway dashboard for database status
- Ensure your IP is not blocked by Railway's firewall
