import { imgAddedSrcArrAtom } from "../GlobalState";
import { useAtom } from "jotai";
import React from "react";
import { Box, Grid } from "@mui/material";

export default function LowConfidenceImagesDisplay() {
    const [imgAddedSrcArr] = useAtom(imgAddedSrcArrAtom);

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
                        <Box textAlign="center">
                            <img
                                height={"100px"}
                                src={imgData.src}
                                alt={`Low confidence label: ${imgData.label}`}
                                style={{ border: "1px solid #ccc", padding: "5px" }}
                            />
                            <p style={{ fontSize: "12px", marginTop: "5px" }}>
                                Label: {imgData.label}
                            </p>
                        </Box>
                    </Grid>
                ))
            )}
        </Grid>
    );
}