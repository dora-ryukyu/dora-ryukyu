# Othello AI on GitHub Profile

This is a basic CNN-based Othello AI, roughly trained using the **WTHOR** database provided by the French Othello Federation (FFO).
The inference runs entirely on GitHub Actions via ONNX Runtime.

## The Game

<!-- OTHELLO_START -->

**Score**: Black (You) 3 - 3 White (AI)
**Turn**: Your Turn (Black)
**Message**: You played e6. AI played d6.

[🔄 Reset Game](https://github.com/dora-ryukyu/dora-ryukyu/issues/new?title=othello:reset&body=Trigger+reset)


| | a | b | c | d | e | f | g | h |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| **1** | 🟩 | 🟩 | 🟩 | 🟩 | 🟩 | 🟩 | 🟩 | 🟩 |
| **2** | 🟩 | 🟩 | 🟩 | 🟩 | 🟩 | 🟩 | 🟩 | 🟩 |
| **3** | 🟩 | 🟩 | [✨](https://github.com/dora-ryukyu/dora-ryukyu/issues/new?title=othello:move:c3&body=Just+push+Submit+to+play+c3.) | 🟩 | 🟩 | 🟩 | 🟩 | 🟩 |
| **4** | 🟩 | 🟩 | [✨](https://github.com/dora-ryukyu/dora-ryukyu/issues/new?title=othello:move:c4&body=Just+push+Submit+to+play+c4.) | ⚪ | ⚫ | 🟩 | 🟩 | 🟩 |
| **5** | 🟩 | 🟩 | [✨](https://github.com/dora-ryukyu/dora-ryukyu/issues/new?title=othello:move:c5&body=Just+push+Submit+to+play+c5.) | ⚪ | ⚫ | 🟩 | 🟩 | 🟩 |
| **6** | 🟩 | 🟩 | [✨](https://github.com/dora-ryukyu/dora-ryukyu/issues/new?title=othello:move:c6&body=Just+push+Submit+to+play+c6.) | ⚪ | ⚫ | 🟩 | 🟩 | 🟩 |
| **7** | 🟩 | 🟩 | [✨](https://github.com/dora-ryukyu/dora-ryukyu/issues/new?title=othello:move:c7&body=Just+push+Submit+to+play+c7.) | 🟩 | 🟩 | 🟩 | 🟩 | 🟩 |
| **8** | 🟩 | 🟩 | 🟩 | 🟩 | 🟩 | 🟩 | 🟩 | 🟩 |

<!-- OTHELLO_END -->

<details>
<summary><strong>📖 How to Play (Click to Expand)</strong></summary>

1. Click on a valid move (marked with `[✨]` or a link on the board).
2. This will open a new issue with a pre-filled title (e.g., `othello:move:c4`).
3. Just click **"Submit new issue"**.
4. Wait ~30 seconds for the GitHub Action to run.
5. Refresh this page to see the AI's move!

</details>

<details>
<summary><strong>⚙️ Setup for your own profile</strong></summary>

1. Copy this repository.
2. Ensure you have `.github/workflows/othello.yml` and `github_action/` folder.
3. Go to Settings -> Actions -> _General_ -> _Workflow permissions_ and allow "Read and write permissions".
4. Click "Start New Game" above to initialize the board!

</details>

---

### Stats

![Moe Counter](https://count.getloli.com/get/@dora-ryukyu?theme=rule34)

<!-- You can add your self-introduction here later! -->
