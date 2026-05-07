import {Composition} from 'remotion';
import {PhoenyxVideo} from './PhoenyxVideo';
import React from 'react';

export const Root: React.FC = () => {
  return (
    <Composition
      id="PhoenyxVideo"
      component={PhoenyxVideo}
      durationInFrames={1050}
      width={1920}
      height={1080}
      fps={30}
      defaultProps={{}}
    />
  );
};
