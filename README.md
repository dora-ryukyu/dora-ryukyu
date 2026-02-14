# Othello AI on GitHub Profile

This is a basic CNN-based Othello AI, roughly trained using the **WTHOR** database.
The inference runs entirely on GitHub Actions via ONNX Runtime.

## The Game

<!-- OTHELLO_START -->

**Score**: Black (You) 9 - 7 White (AI)
**Turn**: Your Turn (Black)
**Message**: You played g3. AI played c4.

[🔄 Reset Game](https://github.com/dora-ryukyu/dora-ryukyu/issues/new?title=othello:reset&body=Trigger+reset)


| | a | b | c | d | e | f | g | h |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| **1** | 🟩 | 🟩 | 🟩 | 🟩 | [✨](https://github.com/dora-ryukyu/dora-ryukyu/issues/new?title=othello:move:e1&body=Just+push+Submit+to+play+e1.) | 🟩 | 🟩 | 🟩 |
| **2** | 🟩 | 🟩 | 🟩 | [✨](https://github.com/dora-ryukyu/dora-ryukyu/issues/new?title=othello:move:d2&body=Just+push+Submit+to+play+d2.) | ⚪ | ⚫ | [✨](https://github.com/dora-ryukyu/dora-ryukyu/issues/new?title=othello:move:g2&body=Just+push+Submit+to+play+g2.) | 🟩 |
| **3** | 🟩 | [✨](https://github.com/dora-ryukyu/dora-ryukyu/issues/new?title=othello:move:b3&body=Just+push+Submit+to+play+b3.) | [✨](https://github.com/dora-ryukyu/dora-ryukyu/issues/new?title=othello:move:c3&body=Just+push+Submit+to+play+c3.) | ⚪ | ⚪ | ⚪ | ⚫ | 🟩 |
| **4** | 🟩 | [✨](https://github.com/dora-ryukyu/dora-ryukyu/issues/new?title=othello:move:b4&body=Just+push+Submit+to+play+b4.) | ⚪ | ⚪ | ⚪ | ⚫ | 🟩 | 🟩 |
| **5** | 🟩 | 🟩 | ⚫ | ⚫ | ⚫ | 🟩 | 🟩 | 🟩 |
| **6** | 🟩 | 🟩 | 🟩 | ⚫ | ⚫ | 🟩 | 🟩 | 🟩 |
| **7** | 🟩 | 🟩 | ⚫ | 🟩 | 🟩 | 🟩 | 🟩 | 🟩 |
| **8** | 🟩 | 🟩 | 🟩 | 🟩 | 🟩 | 🟩 | 🟩 | 🟩 |

<!-- OTHELLO_END -->

<details>
<summary><strong>📖 How to Play (Click to Expand)</strong></summary>

1. Click on a valid move (marked with `[✨]` or a link on the board).
2. This will open a new issue with a pre-filled title (e.g., `othello:move:c4`).
3. Just click **"Submit new issue"**.
4. Wait for the GitHub Action to run.
5. Refresh this page to see the AI's move!

</details>

<details>
<summary><strong>⚙️ Setup for your own profile</strong></summary>

1. Copy this repository.
2. Ensure you have `.github/workflows/othello.yml` and `github_action/` folder.
3. Place your ONNX model file in `models/cnn_model.onnx`.
4. Go to Settings -> Actions -> _General_ -> _Workflow permissions_ and allow "Read and write permissions".
5. Click "Start New Game" above to initialize the board!

</details>

---

## 🙋‍♂️ About Me

**99.9% Vibe Coder.** 
I leverage the power of LLMs to transform ideas into code at high velocity. 

### 🤖 AI & Machine Learning
- I'm fascinated by AI/ML implementation. The **Othello AI** above is a prime example—built with **CNN (PyTorch)** and running entirely on **GitHub Actions** via **ONNX Runtime**. 
- I love creating "serverless" AI experiences where the logic lives in the workflow.

### 🌐 Web Development
From modern stacks to minimalist experiments:
- **Modern:** [takumi-score-manager](https://github.com/dora-ryukyu/takumi-score-manager) (Next.js, TypeScript)
- **Minimalist:** [MyApps](https://github.com/dora-ryukyu/MyApps) (Vanilla JS/HTML/CSS)
- I switch between modern frameworks and lightweight, vanilla solutions depending on the project's scale and purpose.

### ⚡ Automation
- I believe in automating everything that feels like a chore.
- Developed private scripts for university life (Auto-login to portals, LINE notifications for assignments, etc.). 

### 🎮 Hobbies & Life
- **Music Games:** CHUNITHM / O.N.G.E.K.I / Project SEKAI / Yumesute / TAKUMI³
- **Creation:** Music production (from Lo-fi to Dance music) and Photography.

---

### Stats

![Moe Counter](https://count.getloli.com/get/@dora-ryukyu?theme=rule34)
