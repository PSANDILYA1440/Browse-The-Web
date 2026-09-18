# Browse The Web

Browse The Web is a private Chromium-based desktop browser built with Electron,
React, and Vite.

## Development

Install dependencies and start the Vite renderer with Electron:

```sh
npm install
npm start
```

## Build

Create the production renderer bundle:

```sh
npm run build
```

Create the universal macOS DMG:

```sh
npm run dist:mac
```

The generated application and DMG are written to `dist/`.

## Native engines

- `CPPEngine/optimizer` validates and normalizes navigation URLs.
- `GoEngine/engine` records browser visits.

The packaged application includes architecture-specific native binaries and
the complete build output under `dist/`.
