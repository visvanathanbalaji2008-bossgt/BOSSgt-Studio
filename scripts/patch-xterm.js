const fs = require('fs');
const path = require('path');

const xtermPath = path.join(__dirname, '..', 'node_modules', 'xterm', 'lib', 'xterm.js');

if (fs.existsSync(xtermPath)) {
  let content = fs.readFileSync(xtermPath, 'utf8');
  const target = 'get dimensions(){return this._renderer.value.dimensions}';
  const replacement = 'get dimensions(){return(this._renderer&&this._renderer.value&&this._renderer.value.dimensions)||{device:{cell:{width:0,height:0},canvas:{width:0,height:0}},css:{cell:{width:0,height:0},canvas:{width:0,height:0}}}}';

  if (content.includes(target)) {
    content = content.replace(target, replacement);
    fs.writeFileSync(xtermPath, content, 'utf8');
    console.log('✓ Successfully patched xterm.js dimensions getter.');
  } else {
    console.log('✓ xterm.js dimensions getter is already patched.');
  }
}
