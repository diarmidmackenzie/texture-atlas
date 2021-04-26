# texture-atlas

An A-Frame component to use an XML texture atlas (e.g. as output by adobe Animator) (aka a "Sprite Sheet") as a source for 2D textures in A-Frame.

This is a basic initial implementation, which supports the x, y, width and height parameters in an XML texture atlas.  It does not yet support other parameters such as frameX, frameY, frameWidth & frameHeight (which appear in the example XML texture atlas but are ignored).

### Installation

Download texture-atlas.js from this repo, and include like this:

```
<script src="texture-atlas.js"></script>
```



Or via JSDelivr CDN (check the releases in the repo for the best version number to use)

```
<script src="https://cdn.jsdelivr.net/gh/diarmidmackenzie/texture-atlas@latest/texture-atlas.min.js"></script>
```

### Usage

As per the examples, pre-load both the image file (probably a PNG) and the XML file that describes the position of each available subtexture.

Then use selectors for these elements on the texture-atlas component, which should be configured on an <a-image> object (will probably work on other objects like <a-plane> too...)



### Parameters

xml - A selector for an asset consisting of the XML texture atlas.  See the assets folder for an example.  I believe this is a standard format output by Adobe Animate, but I'm not an expert on these things...

src - A selector for an asset containing pictures with offsets matching the data in the XML texture atlas.  See the PNG file in the assets folder for an example.

subTexture - The name of the subTexture to render.  This should match a subTexture "name" in the XML texture atlas.

x, y, width, height - instead of specifying a subTexture name, you can explicitly specify the x, y, width & height parameters to use instead.  This may be useful for debugging, or if you aren't able to use named subTextures for some reason.

That's it... simple :-)



### Examples

See fnf.html for a static example.

See fnf2.html for an animated example (some additional javascript at the top of this HTML file to drive the animation)



## Licensing

### Code

All scripts and scene files are distributed under the [MIT license](LICENSE.md).  


### Assets

Sprite sheets / XML Texture Atlases used in demos are taken from Friday Night Funkin by ninjamuffin99

https://github.com/ninjamuffin99/Funkin

They are licensed under Apache License 2.0, and redistributed here in accordance with clause 4 of that license.

https://github.com/ninjamuffin99/Funkin/blob/master/LICENSE



### Acknowledgements

The atlas-uvs A-Frame component provided an invaluable reference to get things working correctly with THREE.js.

https://github.com/supermedium/superframe/tree/master/components/atlas-uvs/

