# NFC & QR setup

## NFC managed URLs

Each NFC tag has a short, unique public **code** and a managed URL of the form:

```
https://fenixnfc.uz/t/<CODE>
```

Write this managed URL to the physical NFC tag. Because the destination is
resolved server-side, you can **reassign** a tag to a different page or URL
later without re-writing the chip — the same managed URL keeps working.

### Redirect flow (`/t/<code>`)

1. Validate the code exists.
2. Confirm the tag is `active` and the workspace is `active`.
3. Record a scan (increments total/unique scan counters, stores a `nfc_scan`
   analytics event) via the `fx_resolve_nfc` RPC.
4. Resolve the destination (assigned page slug or approved custom URL).
5. Redirect quickly, preserving approved UTM parameters.
6. Unknown, disabled, or suspended states redirect to `/nfc-status` with a
   friendly explanation (never a redirect loop, never a raw error).

### Managing tags

From **Settings → NFC tags** you can create, rename, assign a page or custom
URL, reassign, disable/reactivate, add a table number, delete, copy the managed
URL, and generate a QR code. Manager-level permission is required; each change
is audited.

## QR codes

QR codes can be generated for a public page, a managed NFC URL, or an approved
custom URL. The generator (`src/lib/qr/generate.ts`, using `qrcode`) supports:

- PNG (data URL) and SVG output
- Foreground/background colors and transparent background
- Size, margin, and error-correction level
- A **contrast warning** when foreground/background contrast is too low to scan
  reliably

QR output is verified programmatically in the unit tests by decoding the
generated image, so a generated code is guaranteed scannable.
