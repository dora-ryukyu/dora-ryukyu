
const ort = require('onnxruntime-node');
const { BLACK, WHITE, BOARD_SIZE, getValidMoves } = require('./game');

async function createNNAI(modelPath) {
    let session;
    try {
        session = await ort.InferenceSession.create(modelPath);
    } catch (e) {
        console.error(`Failed to create session from ${modelPath}:`, e);
        throw e;
    }

    function boardToTensor(board, player) {
        const opponent = player === BLACK ? WHITE : BLACK;
        const channels = 2;
        const height = BOARD_SIZE;
        const width = BOARD_SIZE;
        const tensorData = new Float32Array(channels * height * width);

        for (let r = 0; r < height; r++) {
            for (let c = 0; c < width; c++) {
                const index = r * width + c;
                if (board[r][c] === player) {
                    tensorData[index] = 1.0;
                } else if (board[r][c] === opponent) {
                    tensorData[height * width + index] = 1.0;
                }
            }
        }
        return new ort.Tensor('float32', tensorData, [1, channels, height, width]);
    }

    return {
        findBestMove: async function(board, player) {
            if (!session) return null;
            
            const validMoves = getValidMoves(board, player);
            if (validMoves.length === 0) return null;

            try {
                const inputTensor = boardToTensor(board, player);
                const inputName = session.inputNames[0];
                const outputName = session.outputNames[0];

                const feeds = { [inputName]: inputTensor };
                const results = await session.run(feeds);
                const outputTensor = results[outputName];

                if (!outputTensor) throw new Error("No output tensor");

                const outputData = outputTensor.data;
                let bestMove = null;
                let maxScore = -Infinity;

                for (const move of validMoves) {
                    const moveIndex = move.row * BOARD_SIZE + move.col;
                    const score = outputData[moveIndex];
                    if (score > maxScore) {
                        maxScore = score;
                        bestMove = move;
                    }
                }
                return bestMove;
            } catch (e) {
                console.error("Inference error:", e);
                return null;
            }
        }
    };
}

module.exports = { createNNAI };
