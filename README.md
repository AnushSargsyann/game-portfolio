# Anush Sargsyan — Game Developer Portfolio

One-page portfolio. Every video and image is stored **inside this repo**, so nothing depends on Vimeo or YouTube.

## Folder structure

```
index.html
css/style.css
js/main.js
assets/
  images/
    profile.jpg              ← Anush's photo (already included)
    favicon.svg
    games/                   ← video posters / screenshots (.jpg)
  videos/                    ← game videos (.mp4)
```

## Files to add

Put the files in these exact places with these exact names (lowercase, no spaces):

| Game                  | Video                                   | Poster image (optional)                         |
|-----------------------|-----------------------------------------|-------------------------------------------------|
| Dark Fantasy (video 1)| `assets/videos/dark-fantasy-1.mp4`      | `assets/images/games/dark-fantasy-1.jpg`        |
| Dark Fantasy (video 2)| `assets/videos/dark-fantasy-2.mp4`      | `assets/images/games/dark-fantasy-2.jpg`        |
| Cowboy in Magic World | `assets/videos/cowboy-magic-world.mp4`  | `assets/images/games/cowboy-magic-world.jpg`    |
| Doodle Jump           | `assets/videos/doodle-jump.mp4`         | `assets/images/games/doodle-jump.jpg`           |
| Horror Mansion        | `assets/videos/horror-mansion.mp4`      | `assets/images/games/horror-mansion.jpg`        |

Until a video is uploaded, the page shows a box saying **"File not uploaded yet"** with the path it expects —
so you can see at a glance what's missing. The poster is the picture shown before the video starts; if it's
missing the video still works.

## Getting the videos from Vimeo

The videos are currently on Vimeo. Log in to the Vimeo account that owns them → open each video →
**Download** → choose 720p or 1080p. (Or use the original files from Unity recordings.)

## Keep videos small

- GitHub rejects files over **100 MB** and warns over 50 MB. Aim for **10–25 MB** per video.
- Use **.mp4 (H.264 + AAC)** — it plays in every browser and on phones.
- Do **not** use Git LFS — GitHub Pages won't serve LFS files.
- Compress with ffmpeg (keeps sound, 720p):

  ```
  ffmpeg -i input.mp4 -vf scale=-2:720 -c:v libx264 -crf 26 -preset veryfast -c:a aac -b:a 128k -movflags +faststart dark-fantasy-1.mp4
  ```

- Make a poster image from the 2nd second of a video:

  ```
  ffmpeg -ss 2 -i dark-fantasy-1.mp4 -frames:v 1 -q:v 3 dark-fantasy-1.jpg
  ```

No ffmpeg? HandBrake (free app) with the "Fast 720p30" preset works too.

## Editing content

- **Games:** each game is one `<article class="game">` in `index.html`. Media on the left (`.game__media`),
  info on the right (`.game__info`). Copy a whole `<article>` block to add a new game.
- **Use an image instead of a video:**
  `<img class="media" src="assets/images/games/NAME.jpg" alt="..." loading="lazy">`
  (images open full-screen on click). You can mix several videos and images in one game.
- **Skills:** change the number in `data-value="90"` and the `90%` text.
- **Social links:** in the Contact section, replace `#` with the real Upwork / LinkedIn / Instagram /
  Facebook / itch.io links. Links left as `#` are hidden automatically.
- **Colors:** change `--accent` (magenta) and `--accent-2` (cyan) at the top of `css/style.css`.

## Publish on GitHub Pages

1. On github.com → **New repository** (for example `game-portfolio`), **Public** → **Create repository**.
2. Click **uploading an existing file**, drag in **everything inside this folder** (not the folder itself),
   **Commit changes**. The web uploader takes files up to 25 MB each — for bigger videos use git (below)
   or GitHub Desktop.
3. **Settings → Pages** → Source: **Deploy from a branch**, Branch: **main**, folder **/ (root)** → **Save**.
4. After 1–2 minutes the site is live at `https://YOUR-USERNAME.github.io/game-portfolio/`.

With git:

```bash
cd anush-portfolio
git init
git add .
git commit -m "New game portfolio"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/game-portfolio.git
git push -u origin main
```

Remember: file names on GitHub Pages are case-sensitive — `Doodle-Jump.MP4` is not `doodle-jump.mp4`.
