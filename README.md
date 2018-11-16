#zSlider

## Installation

### Step 1: Link required files:
```html
<!-- zSlider styles -->
<link href="dist/jquery.zslider.css" rel="stylesheet" type="text/css" />
<!-- jQuery library -->
<script src="js/jquery.min.js"></script>
<!-- Mousewheel plugin to handle mouse wheel events -->
<script src="dist/vendor/jquery.mousewheel.js"></script>
<!-- TouchSwipe plugin to handle swipe events -->
<script src="dist/vendor/jquery.touchSwipe.min.js"></script>
<!-- zSlider script -->
<script src="dist/jquery.zslider.js"></script>
```
### Step 2: Create HTML markup:

The list of preview images/elements, each having two obligatory attributes:  
1) 'data-zslider' attribute - the sign that this element is to initiate the slider. To combine several elements in a slider, give them the same value of this attribute
2) 'id' attribute
```html
<ul class="slides">
    <li id="slide-1" data-zslider="gallery1">
        <img class="slidepic" src="img/popups/popup-pic1.jpg" />
    </li>
    <li id="slide-2" data-zslider="gallery1">
        <img class="slidepic" src="img/popups/popup-pic2.jpg" />
    </li>
    <li id="slide-3" data-zslider="gallery1">
        <img class="slidepic" src="img/popups/popup-pic3.jpg" />
    </li>
    <li id="slide-4" data-zslider="gallery1">
        <img class="slidepic" src="img/popups/popup-pic4.jpg" />
    </li>
    <li id="slide-5" data-zslider="gallery1">
        <img class="slidepic" src="img/popups/popup-pic5.jpg" />
    </li>
    <li id="slide-6" data-zslider="gallery1">
        <img class="slidepic" src="img/popups/popup-pic6.jpg" />
    </li>
    <li id="slide-7" data-zslider="gallery1">
        <img class="slidepic" src="img/popups/popup-pic7.jpg" />
    </li>
    <li id="slide-8" data-zslider="gallery1">
        <img class="slidepic" src="img/popups/popup-pic8.jpg" />
    </li>
</ul>
```

### Step 3: Call the plugin: 
```javascript
$('.slides').zSlider();
```
or
```javascript
$('.slides').zSlider(options);
```
where *options* is an object with options. 

## Options:
 
 **transition** - slides transition speed (ms). *Default*: 750ms
 
  **arrows** - show left/right arrows. *Default*: true
  
  **pager** - show pager arrows. *Default*: false
  
  **urlHashListener** - Should slider change URL while sliding and react URL change. *Default*: false
  
  **search** - Create URLs based on dinamic paremeters, for example: ?page=2. *Default*: false
  
  **meetProportions** - Use this option when slides pictures should cover all the available space retaining proportions  *Default*: false
  
  **slidePicture** - jquery selector for the slide image in the format '.slide__picture' subjected to manipulations such as meetProportions *Default*: false
  
  **goToSlideAnimate** - Animate transition to a pointed slider. *Default*: false
  
  **mobW** - With a screen width smaller than this, the mobile version is shown, (px). *Default*: 650