const inOutQuintic = function(t, b, c, d) {
  var ts = (t/=d)*t,
  tc = ts*t;
  return b+c*(6*tc*ts + -15*ts*ts + 10*tc);
};

// requestAnimationFrame for Smart Animating http://goo.gl/sx5sts
var requestAnimFrame = (function(){
  return  window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function( callback ){ window.setTimeout(callback, 1000 / 60); };
})();
  
function move(amount, el) {
  if (el) {
    el.scrollTop = amount;
  } else {
    document.documentElement.scrollTop = amount;
    document.body.parentNode.scrollTop = amount;
    document.body.scrollTop = amount;
  }
}

function position(el) {
  if (el)
    return el.scrollTop;
  return document.documentElement.scrollTop || document.body.parentNode.scrollTop || document.body.scrollTop;
}

function scrollTo(to, callback, duration, el) { // el is the element to scroll, if not given, then body will be used
  // because it's so fucking difficult to detect the scrolling element, just move them all
  var start = position(el),
    change = to - start,
    currentTime = 0,
    increment = 20;
  duration = (typeof(duration) === 'undefined') ? 500 : duration;
  const animateScroll = () => {
    // increment the time
    currentTime += increment;
    // find the value with the quadratic in-out easing function
    const val = inOutQuintic(currentTime, start, change, duration);
    // move the document.body
    move(val, el);
    // do the animation unless its over
    if (currentTime < duration) {
      requestAnimFrame(animateScroll);
    } else {
      if (callback && typeof(callback) === 'function') {
        // the animation is done so lets callback
        callback();
      }
    }
  };
  animateScroll();
}

module.exports = scrollTo;
