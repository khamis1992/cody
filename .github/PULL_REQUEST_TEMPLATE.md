# Pull Request

## Description
<!-- Describe your changes -->

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## ⚠️ CLOUDFLARE COMPATIBILITY CHECKLIST

**MANDATORY - Must check ALL items before merging:**

### Code Compatibility
- [ ] No Node.js built-in imports (`crypto`, `fs`, `path`, `http`, `https`, `child_process`, etc.)
- [ ] Using Web Crypto API (`crypto.subtle`) for cryptography
- [ ] Using `fetch` API for HTTP requests (not axios, node-fetch, etc.)
- [ ] No file system operations (`fs.readFile`, `fs.writeFile`, etc.)
- [ ] Environment variables accessed via `context.env` (not `process.env`)

### Dependencies
- [ ] All new dependencies are Cloudflare-compatible
- [ ] Checked npm package for Node.js built-in usage
- [ ] No packages that require Node.js runtime (or added `nodejs_compat`)
- [ ] Updated `wrangler.toml` if needed

### Testing
- [ ] Local build succeeds (`pnpm run build`)
- [ ] Local preview works (`pnpm run preview`)
- [ ] Tested in browser at http://localhost:8788
- [ ] No console errors in browser

### Configuration
- [ ] `wrangler.toml` is present and correct
- [ ] `functions/[[path]].ts` handler is simple and clean
- [ ] No custom routing in `public/_routes.json`
- [ ] Using Remix Cloudflare packages (`@remix-run/cloudflare`)

### Documentation
- [ ] Updated CLOUDFLARE_DEVELOPMENT_RULES.md if adding new patterns
- [ ] Added comments for any Cloudflare-specific workarounds
- [ ] Updated README if changing deployment process

## Testing Evidence

<!-- Paste screenshots or logs showing: -->
<!-- 1. Successful local build -->
<!-- 2. Working local preview -->
<!-- 3. Browser testing results -->

```bash
# Build output
$ pnpm run build
[paste output here]

# Preview output
$ pnpm run preview
[paste output here]
```

## Related Issues
<!-- Link to related issues -->

Closes #

## Additional Notes
<!-- Any additional information -->
