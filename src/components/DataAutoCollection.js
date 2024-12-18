import { imgAddedSrcArrAtom, imgSrcArrAtom } from "../GlobalState";
import { useAtom } from "jotai";
import React, { useState } from "react";
import LabelBarChart from "./ImgBarChart";
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

const directionMap = {
    1: "UP",
    3: "DOWN",
    2: "LEFT",
    0: "RIGHT",
};

export default function LowConfidenceImagesDisplay() {
    const [imgAddedSrcArr, setImgAddedSrcArr] = useAtom(imgAddedSrcArrAtom);
    const [imgSrcArr, setImgSrcArr] = useAtom(imgSrcArrAtom);
    const [sessionAddedImgSrcArr, setSessionAddedImgSrcArr] = useState([]);
    const newestImgAddedSrcArr = imgAddedSrcArr.reverse();

    const handleLabelImage = (index, direction) => {
        // console.log(index, direction);
        setImgAddedSrcArr((prev) =>
            prev.map((imgData, idx) =>
                idx === index ? { ...imgData, label: direction } : imgData
            )
        );
    };

    const handleAddToTrainingData = (index) => {
        const imgData = imgAddedSrcArr[index];
        if (imgData.label) {
            const newImgData = {src: imgData.src, label: imgData.label};
            const newImageArr = [...imgSrcArr, newImgData];
            setImgSrcArr(newImageArr); // Add to training data
            handleDeleteImage(index); // Remove from display
            setSessionAddedImgSrcArr((prev) => [...prev, newImgData]);
            console.log("Added to training data: ", newImgData);
            console.log("ImgSrcArr: ", imgSrcArr);
        } else {
            alert("Please label the image before adding to training data.");
        }
    };

    const handleDeleteImage = (index) => {
        setImgAddedSrcArr((prev) => prev.filter((_, idx) => idx !== index));
    };

    
    return (
        <Box>
            <Typography variant="h6" color="text.primary" gutterBottom textAlign="center" marginTop={2}>
            Before Next Game...
            </Typography>
            <Typography variant="body1" color="text.primary" gutterBottom marginBottom={2} textAlign="center">
                Some images may need to be relabeled for model to learn.
                <br />
                - Please <b>Relabel</b> images in expected directions for model to learn.
                <br />
                - Please <b>Retrain</b> the model after relabeling and adding images for training.
            </Typography>

            <div style={{ display: "flex", justifyContent: "space-around", alignItems: "center", marginBottom: 8}}>
                <div style={{ width: "45%" }}>
                    <LabelBarChart imgArray={imgSrcArr} title="Total Training Data" color="rgba(69, 123, 59, 0.98)" borderColor="rgba(69, 123, 59, 1)" />
                </div>
                <div style={{ width: "45%" }}>
                    <LabelBarChart imgArray={sessionAddedImgSrcArr} title="New Added Images"/>

                </div>
            </div>

            {newestImgAddedSrcArr.length === 0 ? (
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
                    {newestImgAddedSrcArr
                        // .filter((imgData) => imgData.prediction)
                        .map((imgData, index) => (
                            <Grid item xs={12} md={6} lg={4} key={index}>
                                <Card
                                sx={{
                                    border: "1px solid #ccc",
                                    borderRadius: 2,
                                    overflow: "hidden",
                                    boxShadow: 1,
                                    backgroundColor: "#ffffff", // Highlight relabeled images
                                    marginBottom: 2,
                                    marginLeft: 2,
                                    marginRight: 2,
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
                                        sx={{ textAlign: "center", fontSize: "18px" }}
                                    >
                                        Prediction: {directionMap[imgData.prediction] || "No prediction"}
                                        prediction: {imgData.prediction}
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        sx={{ textAlign: "center", fontSize: "18px" }}
                                    >
                                        Confidence: {imgData.confidence}
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        sx={{ textAlign: "center", fontSize: "18px", marginBottom: 1}}
                                    >
                                        New Label: {imgData.label || "No new label"}
                                    </Typography>
                                    <Box
                                        display="flex"
                                        justifyContent="space-between"
                                        marginBottom={2}
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
                                            Add to Train
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
