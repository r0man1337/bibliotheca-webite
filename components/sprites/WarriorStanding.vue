<template>
  <div class="sprite-view-frame absolute bottom-0 z-20">
    <div class="sprite-renderer"></div>
  </div>
</template>
<style scoped>
.sprite-view-frame {
  width: 155px;
  height: 155px;
  overflow: hidden; /* this will hide any sprites outside of the frame*/
}
.sprite-renderer {
  width: 155px;
  height: 155px;
  background-image: url('~/assets/img/Idle.png'); /* the sprite sheet */
  background-repeat: no-repeat;

  /* this prevents the browser from aliasing our pixel art image and making it blurry */
  -ms-interpolation-mode: nearest-neighbor;
  image-rendering: -webkit-optimize-contrast;
  image-rendering: -moz-crisp-edges;
  image-rendering: -o-pixelated;
  image-rendering: pixelated;

  /* this is where the magic happens! */
  animation: animateSprites 1.5s infinite steps(6);
}

@keyframes animateSprites {
  0% {
    background-position: 0px;
  }
  100% {
    background-position: calc(155px * 6 * -1);
  }
}
</style>
