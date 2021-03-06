
window.get_viewport_size = function() {
  var e = window, a = 'inner';
  if (!('innerWidth' in window )) {
    a = 'client';
    e = document.documentElement || document.body;
  }
  return { width : e[ a+'Width' ] , height : e[ a+'Height' ] };
};

(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] 
                                   || window[vendors[x]+'CancelRequestAnimationFrame'];
    }
 
    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); }, 
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
 
    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());

if (!Date.now) {
  Date.now = function() { return new Date().getTime(); }
}

(function() {
  var orientation = undefined;
  
  var elements = $('.header-wrapper');

  var step = function() {
    var size = get_viewport_size();
    var o;

    if (size.height > size.width) {
      o = 1;
    } else {
      o = 0;
    }

    if (orientation === undefined || orientation !== o) {
      orientation = o;
      elements.css('min-height', '' + size.height + 'px');
    }
  };

  $(window).on('load resize', step);
  step();
})();

(function() {
  var timestamp_end = 1453885200;

  var groups = [
    [['dag', 'dagen'], 60*60*24],
    [['uur', 'uur'], 60*60],
    [['minuut', 'minuten'], 60],
    [['seconde', 'seconden'], 1],
  ];

  var prev_difference = undefined;

  var callback = function(t) {
    timestamp = Math.floor(Date.now() / 1000);

    difference = timestamp_end - timestamp;

    if (prev_difference !== undefined && prev_difference === difference) {
      window.requestAnimationFrame(callback);
      return;
    }

    prev_difference = difference;

    if (difference <= 0) {
      $('.counter').html('<p><strong>De sponsorbrochure komt echt heel snel nu!</strong></p>');
      return;
    }

    var difference_components = [];
    var found = false;
    $.each(groups, function(index, group) {
      var size = group[1];

      if (difference < size && !found) {
        return;
      }

      found = true;

      var number = (difference - (difference % size)) / size;
      difference = difference - (number * size);

      if (number == 1) {
        difference_components.push('' + number + '&nbsp;' + group[0][0]);
      } else {
        difference_components.push('' + number + '&nbsp;' + group[0][1]);
      }
    });

    var text = '<p><strong>' + difference_components.join(' &mdash; ') + '</strong><br />tot de sponsorbrochure online komt.</p>';

    $('.counter').html(text);

    window.requestAnimationFrame(callback);
  };

  window.requestAnimationFrame(callback);
})();


$.fn.shuffle = function() {
  var m = this.length;
  var i, t, temp_element;

  while(m) {
    i = Math.floor(Math.random() * m--)

    if(i != m) {
      temp_element = $('<span />');
      $(this[i]).after(temp_element);
      $(this[i]).detach();
      $(this[m]).after(this[i]);
      $(this[m]).detach();
      $(temp_element).after(this[m]);
      $(temp_element).detach();
    }
    
    t = this[m];
    this[m] = this[i];
    this[i] = t;
  }

  return this;
}

$('.sponsors').each(function() {
  $('.sponsor', this).shuffle();
});

/*!
 * equalize.js
 * Author & copyright (c) 2012: Tim Svensen
 * Dual MIT & GPL license
 *
 * Page: http://tsvensen.github.com/equalize.js
 * Repo: https://github.com/tsvensen/equalize.js/
 */
!function(i){i.fn.equalize=function(e){var n,t,h=!1,c=!1;return i.isPlainObject(e)?(n=e.equalize||"height",h=e.children||!1,c=e.reset||!1):n=e||"height",i.isFunction(i.fn[n])?(t=0<n.indexOf("eight")?"height":"width",this.each(function(){var e=h?i(this).find(h):i(this).children(),s=0;e.each(function(){var e=i(this);c&&e.css(t,""),e=e[n](),e>s&&(s=e)}),e.css(t,s+"px")})):!1}}(jQuery);

(function() {
  
  var setup = function() {
    $('.speakers').each(function () {
      $('.info', this).css('height', '');
      $(this).equalize({children: '.info', 'equalize': 'outerHeight'});
    });
  };

  setup();
  $(window).on('load resize', setup);
})();


$(document).ready(function(){
  // Target your .container, .wrapper, .post, etc.
  $("body").fitVids();
});

$(document).ready(function() {
  var history_enabled = (window.history && window.history.pushState);

  $('.program-slot:has(.program-slot-inner):has(.program-slot-expanded)').each(function() {
    var $slot = $(this);
    $slot.addClass('clickable');

    $('.program-slot-inner', $slot).click(function() {
      $('.program-slot-expanded', $slot).fadeIn();
      $('body').addClass('slot-open');
      if (history_enabled) {
        history.replaceState({}, '', window.location.pathname + '#' + $slot.attr('data-hash'));
      }
    });

    $('.program-slot-expanded', $slot).click(function() {
      $('.program-slot-expanded', $slot).fadeOut();
      $('body').removeClass('slot-open');
      if (history_enabled) {
        history.replaceState({}, '', window.location.pathname)
      }
    });
  });

  (function() {
    if (window.location.hash != '' && window.location.hash.match(/^#[a-z0-9-]+$/)) {
      var h = window.location.hash.substring(1), 
          slot;

      if ($(".program-slot[data-hash=" + h + ']').length > 0) {
        slot = $(".program-slot[data-hash=" + h + ']').eq(0)
        $(window).scrollTop($('.program-wrapper').offset().top - 30);
        $('.program').scrollLeft(slot.offset().left + $('.program').scrollLeft() - $('.program').offset().left);
        slot.find('.program-slot-inner').click();
        return;
      }
    }

    var now = new Date;
    var start = new Date(2016, 3, 19, 9, 0, 0);
    var end = new Date(2016, 3, 19, 17, 30, 0);
    
    if (now >= start && now <= end) {
      var quarters = (end - start) / 1000 / 60 / 15;
      var now_quarters = Math.floor((now - start) / 1000 / 60 / 15);
      var width = $('.program .program-slots').eq(0).width();
      var o = Math.floor(width / quarters * now_quarters);
      $('.program').scrollLeft(o);
    }
  })();

  $(document).keyup(function(e) {
    if (e.keyCode == 27) {
      $('.program-slot:has(.program-slot-inner) .program-slot-expanded').fadeOut();
      $('body').removeClass('slot-open');
    }
  });

  return;
});
