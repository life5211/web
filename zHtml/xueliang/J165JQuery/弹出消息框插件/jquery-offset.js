/**
* Returns the location of the element in pixels from the top left corner of the viewport.
*
* For accurate readings make sure to use pixel values for margins, borders and padding.
*
* @example $("#testdiv").offset()
* @result { top: 100, left: 100, scrollTop: 10, scrollLeft: 10 }
*
* @example $("#testdiv").offset({ scroll: false })
* @result { top: 90, left: 90 }
*
* @example var offset = {}
* $("#testdiv").offset({ scroll: false }, offset)
* @result offset = { top: 90, left: 90 }
*
* @name offset
* @param Object options A hash of options describing what should be included in the final calculations of the offset.
*                          The options include:
*                              margin: Should the margin of the element be included in the calculations? True by default.
*                                      If set to false the margin of the element is subtracted from the total offset.
*                              border: Should the border of the element be included in the calculations? True by default.
*                                      If set to false the border of the element is subtracted from the total offset.
*                              padding: Should the padding of the element be included in the calculations? False by default.
*                                       If set to true the padding of the element is added to the total offset.
*                              scroll: Should the scroll offsets of the parent elements be included in the calculations?
*                                      True by default. When true, it adds the total scroll offsets of all parents to the
*                                      total offset and also adds two properties to the returned object, scrollTop and
*                                      scrollLeft. If set to false the scroll offsets of parent elements are ignored.
*                                      If scroll offsets are not needed, set to false to get a performance boost.
* @param Object returnObject An object to store the return value in, so as not to break the chain. If passed in the
*                               chain will not be broken and the result will be assigned to this object.
* @type Object
* @cat Plugins/Dimensions
* @author Brandon Aaron (brandon.aaron@gmail.com || http://brandonaaron.net)
*/

jQuery.fn.offset = function(options, returnObject) {
var x = 0, y = 0, elem = this[0], parent = this[0], sl = 0, st = 0, options = jQuery.extend({ margin: true, border: true, padding: false, scroll: true }, options || {});
do {
     x += parent.offsetLeft || 0;
     y += parent.offsetTop     || 0;

     // Mozilla and IE do not add the border
     if (jQuery.browser.mozilla || jQuery.browser.msie) {
      // get borders
      var bt = parseInt(jQuery.css(parent, 'borderTopWidth')) || 0;
      var bl = parseInt(jQuery.css(parent, 'borderLeftWidth')) || 0;

      // add borders to offset
      x += bl;
      y += bt;

      // Mozilla removes the border if the parent has overflow property other than visible
      if (jQuery.browser.mozilla && parent != elem && jQuery.css(parent, 'overflow') != 'visible') {
       x += bl;
       y += bt;
      }
     }

     var op = parent.offsetParent;
     if (op && (op.tagName == 'BODY' || op.tagName == 'HTML')) {
      // Safari doesn't add the body margin for elments positioned with static or relative
      if (jQuery.browser.safari && jQuery.css(parent, 'position') != 'absolute') {
       x += parseInt(jQuery.css(op, 'marginLeft')) || 0;
       y += parseInt(jQuery.css(op, 'marginTop'))     || 0;
      }

      // Exit the loop
      break;
     }

     if (options.scroll) {
      // Need to get scroll offsets in-between offsetParents
      do {
       sl += parent.scrollLeft || 0;
       st += parent.scrollTop     || 0;

       parent = parent.parentNode;

       // Mozilla removes the border if the parent has overflow property other than visible
       if (jQuery.browser.mozilla && parent != elem && parent != op && parent.style && jQuery.css(parent, 'overflow') != 'visible') {
        y += parseInt(jQuery.css(parent, 'borderTopWidth')) || 0;
        x += parseInt(jQuery.css(parent, 'borderLeftWidth')) || 0;
       }
      } while (parent != op);
     } else {
      parent = parent.offsetParent;
     }
} while (parent);

if ( !options.margin) {
     x -= parseInt(jQuery.css(elem, 'marginLeft')) || 0;
     y -= parseInt(jQuery.css(elem, 'marginTop'))     || 0;
}

// Safari and Opera do not add the border for the element
if ( options.border && (jQuery.browser.safari || jQuery.browser.opera) ) {
     x += parseInt(jQuery.css(elem, 'borderLeftWidth')) || 0;
     y += parseInt(jQuery.css(elem, 'borderTopWidth'))     || 0;
} else if ( !options.border && !(jQuery.browser.safari || jQuery.browser.opera) ) {
     x -= parseInt(jQuery.css(elem, 'borderLeftWidth')) || 0;
     y -= parseInt(jQuery.css(elem, 'borderTopWidth'))     || 0;
}

if ( options.padding ) {
     x += parseInt(jQuery.css(elem, 'paddingLeft')) || 0;
     y += parseInt(jQuery.css(elem, 'paddingTop'))     || 0;
}

// Opera thinks offset is scroll offset for display: inline elements
if (options.scroll && jQuery.browser.opera && jQuery.css(elem, 'display') == 'inline') {
     sl -= elem.scrollLeft || 0;
     st -= elem.scrollTop     || 0;
}

var returnValue = options.scroll ? { top: y - st, left: x - sl, scrollTop:     st, scrollLeft: sl }
            : { top: y, left: x };

if (returnObject) { jQuery.extend(returnObject, returnValue); return this; }
else                 { return returnValue; }
};