// For aux use.
var uvs = [
  new THREE.Vector2(),
  new THREE.Vector2(),
  new THREE.Vector2(),
  new THREE.Vector2()
];

/**
 * 1-indexed.
 */
AFRAME.registerComponent('texture-atlas', {
  dependencies: ['geometry'],

  schema: {
    xml: {type: 'selector'},
    src: {type: 'selector'},
    subTexture: {type: 'string'},
    x: {type: 'int'},
    y: {type: 'int'},
    width: {type: 'int'},
    height: {type: 'int'},

  },

  update: function () {
    const data = this.data;

    this.el.setAttribute("material", {'src': this.data.src});

    if (this.xml !== this.data.xml) {
      // New XML filename - load it up.
      this.xml = this.data.xml;
      this.subTextures = {};

      // completes synchronously as it references an already-loaded asset.
      this.parseXMLData(this.xml)
    }

    if (this.data.subTexture) {
      this.subTexture = this.data.subTexture;

      frame = this.subTextures[this.subTexture]

      if (frame) {
        this.updateImage(frame.x,
                         frame.y,
                         frame.width,
                         frame.height,
                         this.data.src)
      }
    }
    else {
        this.updateImage(this.data.x,
                         this.data.y,
                         this.data.width,
                         this.data.height,
                         this.data.src)
    }
  },

  updateImage: function(x, y, width, height, src) {

    const uvs = getXYGridUvs(x, y, width, height, src.width, src.height);

    const geometry = this.el.getObject3D('mesh').geometry;
    var float32Array = new Float32Array([uvs[0].x, uvs[0].y, uvs[3].x, uvs[3].y, uvs[1].x, uvs[1].y, uvs[2].x, uvs[2].y]);
    geometry.setAttribute('uv', new THREE.BufferAttribute(float32Array, 2));
    geometry.uvsNeedUpdate = true;
  },

  parseXMLData: function(xml) {
    parser = new DOMParser();
    xmlDoc = parser.parseFromString(xml.data,"text/xml");

    const subTextures = xmlDoc.getElementsByTagName("SubTexture");

    for (ii = 0; ii < subTextures.length; ii++) {
       const item = subTextures[ii];
       const key = item.attributes[0].nodeValue;
       this.subTextures[key] = Object.assign({},
           ...Array.from(item.attributes,
                         ({name, value}) => ({[name]: value}))
       );
    }
  }

});

/**
 * Return UVs for an texture within an atlas, given the co-ordinates.
 */
function getXYGridUvs (x, y, width, height, atlasWidth, atlasHeight) {

  // create a Map caled `uvs` to hold the 4 UV pairs
  x = Number(x)
  y = Number(y)
  width = Number(width)
  height = Number(height)

  uvs[1].set(x / atlasWidth,
             1 - (y + height) / atlasHeight);
  uvs[0].set(x / atlasWidth,
             1 - y / atlasHeight);
  uvs[3].set((x + width) / atlasWidth,
             1 - y / atlasHeight);
  uvs[2].set((x + width) / atlasWidth,
             1 - (y + height) / atlasHeight);
  return uvs;
}
