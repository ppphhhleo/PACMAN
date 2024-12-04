import { imgAddedSrcArrAtom, imgSrcArrAtom } from "../GlobalState";
import { useAtom } from "jotai";
import React from "react";
import { Grid, Button, Box, Typography, Card, CardContent } from "@mui/material";
import {
    ArrowUpward,
    ArrowDownward,
    ArrowBack,
    ArrowForward,
    Delete as DeleteIcon,
    Add as AddIcon,
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
        <Box>
            <Typography variant="h6" color="text.primary" gutterBottom>
                Low Confidence Images
            </Typography>
            {imgAddedSrcArr.length === 0 ? (
                <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    sx={{
                        p: 2,
                        border: "1px dashed grey",
                        height: "150px",
                        backgroundColor: "#f9f9f9",
                        textAlign: "center",
                    }}
                >
                    No low-confidence images to display.
                </Box>
            ) : (
                <Grid container spacing={2}>
                    {imgAddedSrcArr.map((imgData, index) => (
                        <Grid item xs={12} md={6} lg={4} key={index}>
                            <Card
                                sx={{
                                    border: "1px solid #ccc",
                                    borderRadius: 2,
                                    overflow: "hidden",
                                    boxShadow: 1,
                                    backgroundColor: "#ffffff", // Highlight relabeled images
                                }}
                            >
                                <CardContent sx={{ padding: 1 }}>
                                    <Box textAlign="center" marginBottom={1}>
                                        <img
                                            height={"100px"}
                                            src={imgData.src}
                                            alt={`Prediction: ${imgData.label}`}
                                            style={{
                                                borderRadius: "5px",
                                                border: "1px solid #ccc",
                                                maxWidth: "100%",
                                            }}
                                        />
                                    </Box>
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        sx={{ marginBottom: 1 }}
                                    >
                                        Prediction: {imgData.label || "Unlabeled"}
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        sx={{ marginBottom: 1 }}
                                    >
                                        Confidence: {imgData.confidence}
                                    </Typography>
                                    <Box
                                        display="flex"
                                        justifyContent="space-between"
                                        marginBottom={1}
                                    >
                                        {Object.keys(DIRECTIONS).map((directionKey) => {
                                            const direction = DIRECTIONS[directionKey];
                                            const isSelected =
                                                imgData.label === directionKey; // Highlight selected button
                                            return (
                                                <Button
                                                    key={directionKey}
                                                    size="small"
                                                    variant={isSelected ? "contained" : "outlined"}
                                                    color={isSelected ? "primary" : "inherit"}
                                                    endIcon={direction.icon}
                                                    onClick={() =>
                                                        handleLabelImage(index, directionKey)
                                                    }
                                                    sx={{
                                                        padding: "5px 10px",
                                                        margin: "0 2px",
                                                    }}
                                                >
                                                    {direction.label}
                                                </Button>
                                            );
                                        })}
                                    </Box>
                                    <Box
                                        display="flex"
                                        justifyContent="space-between"
                                        marginTop={1}
                                    >
                                        <Button
                                            size="small"
                                            variant="contained"
                                            color="primary"
                                            onClick={() => handleAddToTrainingData(index)}
                                            startIcon={<AddIcon />}
                                        >
                                            Add to Training
                                        </Button>
                                        <Button
                                            size="small"
                                            variant="contained"
                                            color="secondary"
                                            onClick={() => handleDeleteImage(index)}
                                            startIcon={<DeleteIcon />}
                                        >
                                            Delete
                                        </Button>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Box>
    );
}
