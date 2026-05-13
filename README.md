# mainwhile

Catch up on code that's already been pushed to main.

## Installation

```bash
npm install -g mainwhile
mainwhile
```

You will be prompted to set a starting point. From there, you can review each change until you've caught up with main. Progress is saved in a git tag, allowing you to pick up from where you left off.

## Usage

### Accept Change

Press `Enter` to continue to the next change.

### View PR

Press `p` to open the Pull Request for the change in the browser.

### Check Out Locally

Press `c` to reset your local repo to the current change.

### Raise Issue

Press `r` to create a Github issue. You'll be prompted for the title, after which the browser will open for you to finalize and submit.

### Exclude Certain Changes

Open the filter panel with `f` and press `Enter` to open your filter config, which supports filter patterns like:

```
# Don't need to review your own changes
email: youremail@example.com
# Or by name
name: Some Name
```

Any matched changes will be excluded from your review.
