import { atom } from "jotai";
import { loadTruncatedMobileNet } from "./model";

// ---- Configurations ----
export const epochsAtom = atom(100); // Number of epochs
export const batchSizeAtom = atom(1); // Selected batch size
export const hiddenUnitsAtom = atom(100); // Number of hidden units
export const learningRateAtom = atom(0.0001); // Learning rate
export const gameRunningAtom = atom(false); // Game state
export const predictionAtom = atom(null); // Current prediction

// ---- Model Training ----
export const modelAtom = atom(null); // Model
export const truncatedMobileNetAtom = atom(loadTruncatedMobileNet()); // truncatedMobileNet
export const imgSrcArrAtom = atom([]); // collected images, formate {src: string, label: string}
export const imgAddedSrcArrAtom = atom([]); // collected images, formate {src: string, label: string, prediction: string, confidence: number}
// ---- UI Display ----
export const lossAtom = atom(null); // Loss value
export const lossArrayAtom = atom([]); // Loss value array {loss: number, trial: number}
export const trainingProgressAtom = atom(-1); // Training progress
export const stopTrainingAtom = atom(false); // Flag to stop training
export const gameTrialAtom = atom(1); // Game trial number


