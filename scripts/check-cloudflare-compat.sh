#!/bin/bash

# Cloudflare Compatibility Checker
# Checks for common issues that cause Cloudflare deployment failures

set -e

echo "🔍 Cloudflare Compatibility Checker"
echo "===================================="
echo ""

ERRORS=0
WARNINGS=0

# Check 1: Node.js built-in imports
echo "📦 Checking for Node.js built-in imports..."
FORBIDDEN_FILES=$(grep -r "from '[\"']crypto[\"']\|from '[\"']fs[\"']\|from '[\"']path[\"']\|from '[\"']os[\"']\|from '[\"']child_process[\"']\|from '[\"']http[\"']\|from '[\"']https[\"']\|from '[\"']net[\"']\|from '[\"']stream[\"']\|from '[\"']buffer[\"']\|require('[\"']crypto[\"']\|require('[\"']fs[\"']\|require('[\"']path[\"']" app/ --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" 2>/dev/null || true)

if [ -n "$FORBIDDEN_FILES" ]; then
  echo "❌ ERROR: Node.js built-in imports found!"
  echo "$FORBIDDEN_FILES"
  echo ""
  ERRORS=$((ERRORS + 1))
else
  echo "✅ No Node.js built-in imports found"
fi
echo ""

# Check 2: wrangler.toml exists
echo "📄 Checking for wrangler.toml..."
if [ ! -f "wrangler.toml" ]; then
  echo "⚠️  WARNING: wrangler.toml not found!"
  echo "   This may cause issues if dependencies need Node.js modules."
  WARNINGS=$((WARNINGS + 1))
else
  echo "✅ wrangler.toml exists"
  
  # Check if nodejs_compat is enabled
  if grep -q "nodejs_compat" wrangler.toml; then
    echo "✅ nodejs_compat is enabled"
  else
    echo "⚠️  WARNING: nodejs_compat not found in wrangler.toml"
    echo "   Add: compatibility_flags = [\"nodejs_compat\"]"
    WARNINGS=$((WARNINGS + 1))
  fi
fi
echo ""

# Check 3: Functions handler exists and is simple
echo "🔧 Checking functions handler..."
if [ ! -f "functions/[[path]].ts" ]; then
  echo "⚠️  WARNING: functions/[[path]].ts not found!"
  echo "   Cloudflare Pages needs this file to serve Remix apps."
  WARNINGS=$((WARNINGS + 1))
else
  LINES=$(wc -l < "functions/[[path]].ts")
  if [ "$LINES" -gt 30 ]; then
    echo "⚠️  WARNING: functions/[[path]].ts is too complex ($LINES lines)"
    echo "   Keep it simple (< 20 lines). Let Remix handle routing."
    WARNINGS=$((WARNINGS + 1))
  else
    echo "✅ functions/[[path]].ts exists and is simple"
  fi
fi
echo ""

# Check 4: Problematic dependencies
echo "📚 Checking for problematic dependencies..."
PROBLEMATIC_DEPS=""

if grep -q '"axios"' package.json 2>/dev/null; then
  PROBLEMATIC_DEPS="$PROBLEMATIC_DEPS\n  - axios (use native fetch instead)"
fi

if grep -q '"node-fetch"' package.json 2>/dev/null; then
  PROBLEMATIC_DEPS="$PROBLEMATIC_DEPS\n  - node-fetch (use native fetch instead)"
fi

if grep -q '"jsonwebtoken"' package.json 2>/dev/null; then
  PROBLEMATIC_DEPS="$PROBLEMATIC_DEPS\n  - jsonwebtoken (use jose instead)"
fi

if grep -q '"bcrypt"' package.json 2>/dev/null; then
  PROBLEMATIC_DEPS="$PROBLEMATIC_DEPS\n  - bcrypt (use bcryptjs instead)"
fi

if [ -n "$PROBLEMATIC_DEPS" ]; then
  echo "⚠️  WARNING: Potentially problematic dependencies found:"
  echo -e "$PROBLEMATIC_DEPS"
  echo ""
  WARNINGS=$((WARNINGS + 1))
else
  echo "✅ No known problematic dependencies"
fi
echo ""

# Check 5: process.env usage
echo "🌍 Checking for process.env usage..."
PROCESS_ENV_FILES=$(grep -r "process\.env" app/ --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" 2>/dev/null || true)

if [ -n "$PROCESS_ENV_FILES" ]; then
  echo "⚠️  WARNING: process.env usage found!"
  echo "   Use context.env instead in loaders/actions"
  echo "$PROCESS_ENV_FILES"
  echo ""
  WARNINGS=$((WARNINGS + 1))
else
  echo "✅ No process.env usage found"
fi
echo ""

# Check 6: File system operations
echo "📁 Checking for file system operations..."
FS_FILES=$(grep -r "fs\.readFile\|fs\.writeFile\|fs\.existsSync\|fs\.readFileSync\|fs\.writeFileSync" app/ --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" 2>/dev/null || true)

if [ -n "$FS_FILES" ]; then
  echo "❌ ERROR: File system operations found!"
  echo "   Use Cloudflare R2, KV, or D1 instead"
  echo "$FS_FILES"
  echo ""
  ERRORS=$((ERRORS + 1))
else
  echo "✅ No file system operations found"
fi
echo ""

# Check 7: Build test
echo "🏗️  Testing build..."
if pnpm run build > /tmp/build.log 2>&1; then
  echo "✅ Build succeeded"
else
  echo "❌ ERROR: Build failed!"
  echo "   Check /tmp/build.log for details"
  tail -20 /tmp/build.log
  ERRORS=$((ERRORS + 1))
fi
echo ""

# Summary
echo "===================================="
echo "📊 Summary"
echo "===================================="
echo "Errors: $ERRORS"
echo "Warnings: $WARNINGS"
echo ""

if [ $ERRORS -gt 0 ]; then
  echo "❌ FAILED: Fix errors before deploying to Cloudflare"
  exit 1
elif [ $WARNINGS -gt 0 ]; then
  echo "⚠️  PASSED WITH WARNINGS: Review warnings before deploying"
  exit 0
else
  echo "✅ ALL CHECKS PASSED: Ready for Cloudflare deployment!"
  exit 0
fi
