import React from "react";
import {
    Canvas,
    Rect,
    RadialGradient,
    Skia,
    Shader,
    vec,
    Text,
    useFont
} from "@shopify/react-native-skia";

export const RadialGradientDemo = () => {
    const fontSize = 32;
    const font = useFont(require("../../../assets/fonts/Inter_Bold.ttf"), fontSize);
    return (
        <Canvas style={{ flex: 1,justifyContent:'center',alignItems:'center' }}>
            {/* <Rect x={0} y={0} width={256} height={256}> */}
            <Text
                x={0}
                y={fontSize}
                text="Hello World"
                font={font}
            >
                <RadialGradient
                    c={vec(128, 128)}
                    r={128}
                    colors={["blue", "yellow"]}
                />
            </Text>
            {/* </Rect> */}
        </Canvas>
    );
};