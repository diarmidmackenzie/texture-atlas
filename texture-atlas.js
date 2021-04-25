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

// x="6640" y="509" width="374" height="357" frameX="-1" frameY="-5" frameWidth="375" frameHeight="362" -->
  schema: {
    x: {type: 'int'},
    y: {type: 'int'},
    width: {type: 'int'},
    height: {type: 'int'},
    xml: {type: 'string'},
    subTexture: {type: 'string'}
  },

  update: function () {
    const data = this.data;

    if (this.xml !== this.data.xml) {
      // New XML filename - load it up.
      this.xml = this.data.xml;
      this.subTextures = {};
      this.loadXMLDoc(this.xml)
    }

    if (this.data.subTexture) {
      this.subTexture = this.data.subTexture;

      frame = this.subTextures[this.subTexture]

      if (frame) {
        this.updateImage(frame.x,
                         frame.y,
                         frame.width,
                         frame.height)
      }
    }
    else {
        this.updateImage(this.data.x,
                         this.data.y,
                         this.data.width,
                         this.data.height)
    }
  },

  updateImage: function(x, y, width, height) {

    const uvs = getXYGridUvs(x, y, width, height);

    const geometry = this.el.getObject3D('mesh').geometry;
    var float32Array = new Float32Array([uvs[0].x, uvs[0].y, uvs[3].x, uvs[3].y, uvs[1].x, uvs[1].y, uvs[2].x, uvs[2].y]);
    geometry.setAttribute('uv', new THREE.BufferAttribute(float32Array, 2));
    geometry.uvsNeedUpdate = true;
  },

  loadXMLDoc: function(filename) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = () => {
      if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
        const subTextures = xmlhttp.responseXML.getElementsByTagName("SubTexture");

        for (ii = 0; ii < subTextures.length; ii++) {
           const item = subTextures[ii];
           const key = item.attributes[0].nodeValue;
           this.subTextures[key] = Object.assign({},
               ...Array.from(item.attributes,
                             ({name, value}) => ({[name]: value}))
           );
        }

        console.log("SubTextures loaded");
        const frame = this.subTextures[this.subTexture]

        if (frame) {
          this.updateImage(frame.x,
                           frame.y,
                           frame.width,
                           frame.height)
        }
      }
    };
    xmlhttp.open("GET", filename, true);
    xmlhttp.send();
  }

});

/**
 * Return UVs for an texture within an atlas, given the row and column info.
 */
function getXYGridUvs (x, y, width, height) {

  // create a Map caled `uvs` to hold the 4 UV pairs
  const atlasWidth = 8192;
  const atlasHeight = 4096;
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

//module.exports.getGridUvs = getGridUvs;
//module.exports.getXYGridUvs = getXYGridUvs;
