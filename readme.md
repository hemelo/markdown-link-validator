# Markdown Link Validator 

A simple link validator from Markdown file

## Usage 

You can count how many links are on a markdown file by:

```
$ node cli.js --markdown=./test.md
2 links were found on ./test.md
```

But you can also show details from links found in the file

```
$ node cli.js --markdown=./test.md --details
1 link is valid
[
  {
    "teste": "https://twitter.com",
    "status": 200
  }
]
```

To validate add --validate on command 

```
$ node cli.js --markdown=./test.md --validate
2 links were found on ./test.md
All links are valid
```