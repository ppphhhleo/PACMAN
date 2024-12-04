import { imgAddedSrcArrAtom, imgSrcArrAtom } from "../GlobalState";
import { useAtom } from "jotai";
import React from "react";
import { Grid, Button, Box } from "@mui/material";
import {
    ArrowUpward,
    ArrowDownward,
    ArrowBack,
    ArrowForward,
} from "@mui/icons-material/";

const DIRECTIONS = {
    up: { icon: <ArrowUpward />, label: "Up" },
    down: { icon: <ArrowDownward />, label: "Down" },
    left: { icon: <ArrowBack />, label: "Left" },
    right: { icon: <ArrowForward />, label: "Right" },
};

export default function LowConfidenceImagesDisplay() {
    const [imgAddedSrcArr, setImgAddedSrcArr] = useAtom(imgAddedSrcArrAtom);
    const [imgSrcArr, setImgSrcArr] = useAtom(imgSrcArrAtom);

    const handleLabelImage = (index, direction) => {
        setImgAddedSrcArr((prev) =>
            prev.map((imgData, idx) =>
                idx === index ? { ...imgData, label: direction } : imgData
            )
        );
    };

    const handleAddToTrainingData = (index) => {
        const imgData = imgAddedSrcArr[index];
        if (imgData.label) {
            setImgSrcArr((prev) => [...prev, imgData]); // Add to training data
            handleDeleteImage(index); // Remove from display
        } else {
            alert("Please label the image before adding to training data.");
        }
    };

    const handleDeleteImage = (index) => {
        setImgAddedSrcArr((prev) => prev.filter((_, idx) => idx !== index));
    };

    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <Box textAlign="center">
                    <h3>Low Confidence Images</h3>
                </Box>
            </Grid>
            {imgAddedSrcArr.length === 0 ? (
                <Grid item xs={12}>
                    <Box
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        sx={{
                            p: 2,
                            border: "1px dashed grey",
                            height: "100px",
                            backgroundColor: "#f9f9f9",
                            textAlign: "center",
                        }}
                    >
                        No low-confidence images yet.
                    </Box>
                </Grid>
            ) : (
                imgAddedSrcArr.map((imgData, index) => (
                    <Grid item xs={3} key={index}>
                        <Box
                            textAlign="center"
                            sx={{
                                border: "1px solid #ccc",
                                padding: "10px",
                                borderRadius: "5px",
                                backgroundColor: "#f9f9f9",
                            }}
                        >
                            <img
                                height={"100px"}
                                src={imgData.src}
                                alt={`Prediction: ${imgData.label}`}
                                style={{ border: "1px solid #ccc", padding: "5px" }}
                            />
                            <p style={{ fontSize: "12px", marginTop: "5px" }}>
                                Prediction: {imgData.label || "Unlabeled"}
                            </p>
                            <p style={{ fontSize: "12px", marginTop: "5px" }}>
                                Confidence: {imgData.confidence}
                            </p>
                            <Box>
                                {/* Direction Buttons */}
                                {Object.keys(DIRECTIONS).map((directionKey) => {
                                    const direction = DIRECTIONS[directionKey];
                                    return (
                                        <Button
                                            key={directionKey}
                                            size="small"
                                            variant="outlined"
                                            endIcon={direction.icon}
                                            onClick={() => handleLabelImage(index, directionKey)}
                                            sx={{ margin: "2px" }}
                                        >
                                            {/* {direction.label} */}
                                        </Button>
                                    );
                                })}
                            </Box>
                            <Box sx={{ marginTop: "5px" }}>
                                <Button
                                    size="small"
                                    variant="contained"
                                    color="primary"
                                    onClick={() => handleAddToTrainingData(index)}
                                    sx={{ margin: "2px" }}
                                >
                                    Add to Training Data
                                </Button>
                                <Button
                                    size="small"
                                    variant="contained"
                                    color="secondary"
                                    onClick={() => handleDeleteImage(index)}
                                    sx={{ margin: "2px" }}
                                >
                                    Delete
                                </Button>
                            </Box>
                        </Box>
                    </Grid>
                ))
            )}
        </Grid>
    );
}
