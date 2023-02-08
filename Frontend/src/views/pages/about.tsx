import YouTube from "react-youtube";
const About = () => {
  const _onReady = (event: any) => {
    event.target.pauseVideo();
  };
  const opts = {
    height: "390",
    width: "640",
    playerVars: {
      //  ' https://www.youtube.com/watch?v=8Sm2fYjK2k8&ab_channel=NadavVazana',
    },
  };
  return (
    <section className="about">
      <YouTube
        style={{
          position: "fixed",
          top: "70%",
          left: "50%",
          transform: "translate(-50%,-70%)",
        }}
        videoId="8Sm2fYjK2k8"
        opts={opts}
        onReady={_onReady}
      />
    </section>
  );
};

export default About;
