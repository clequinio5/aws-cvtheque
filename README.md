[![CircleCI](https://circleci.com/gh/clequinio5/aws-cvtheque.svg?style=shield)](https://app.circleci.com/pipelines/github/clequinio5/aws-cvtheque)

# CI/CD AWS deployment of a CVtheque

## Overview

## Infrastructure

## Stack

## Deploy

1) Generate a new key-pair named 'fscrawler' in AWS and add the private key in the CircleCI project settings. Upload the fingerprint in the config.yml with the one generated from the private key.

2) Add the CircleCI project environment variables:

```
AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY
```

3) Run the CircleCI workflow

