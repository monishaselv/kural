import React, { FC } from 'react';
import { View, StyleSheet, Button } from 'react-native';
import Animated, { useAnimatedProps, useDerivedValue, useSharedValue, withTiming } from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';

type CircularProgressProps = {
  strokeWidth: number;
  radius: number;
  backgroundColor: string;
  percentageComplete: number;
};

export const CircularProgress: FC<CircularProgressProps> = ({
  radius,
  strokeWidth,
  backgroundColor,
  percentageComplete,
}) => {
  const innerRadius = radius - strokeWidth / 2;
  const circumfrence = 2 * Math.PI * innerRadius;
  const AnimatedCircle = Animated.createAnimatedComponent(Circle);
  const invertedCompletion = (100 - percentageComplete) / 100;
  const theta = useSharedValue(2 * Math.PI);
  const animateTo = useDerivedValue(() => 2 * Math.PI * invertedCompletion);

  const animatedProps = useAnimatedProps(() => {
    return {
      strokeDashoffset: withTiming(theta.value * innerRadius, {
        duration: 1500,
      }),
    };
  });
  return (
    <View style={styles.container}>
      <Svg style={StyleSheet.absoluteFill}>
        <AnimatedCircle
          animatedProps={animatedProps}
          cx={radius}
          cy={radius}
          r={innerRadius}
          fill={'transparent'}
          stroke={backgroundColor}
          strokeDasharray={`${circumfrence} ${circumfrence}`}
          strokeWidth={strokeWidth}
          strokeDashoffset={2 * Math.PI * (innerRadius * 0.5)}
          strokeLinecap="round"
        />
      </Svg>
      <Button
        title="Animate!"
        onPress={() => {
          theta.value = animateTo.value;
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
});