# roomquire

**Roomquire** is a personal CLI tool for archiving files to AWS Glacier —  
inspired by the Room of Requirement in Harry Potter, where things appear when truly needed.

## Features

- Upload files to AWS S3 with automatic transition to Glacier
- Restore and download Glacier-stored files with a single command
- Track upload/download history via local SQLite
- List or delete files from your S3 bucket
- Cross-platform (macOS, Windows, Linux)
- Configurable, testable, and simple

## Installation (Development)

```bash
git clone https://github.com/yourname/roomquire.git
cd roomquire
npm install
```

## Usage (in development mode)

```bash
npx ts-node src/index.ts upload ./photo.jpg
npx ts-node src/index.ts download photo.jpg
npx ts-node src/index.ts history
```

## Configuration

Before using, create your `~/.roomquire/config.json` file:

```json
{
  "AWS_ACCESS_KEY_ID": "your-access-key",
  "AWS_SECRET_ACCESS_KEY": "your-secret-key",
  "AWS_REGION": "ap-northeast-2",
  "S3_BUCKET": "your-bucket-name"
}
```

Or run:

```bash
npx ts-node src/index.ts init
```

## Roadmap

- [ ] Basic upload/download
- [ ] History tracking
- [x] `init` setup wizard
- [ ] Interactive mode
- [ ] Package as installable CLI tool (`npm install -g roomquire`)
- [ ] GUI or web-based companion

## License

MIT